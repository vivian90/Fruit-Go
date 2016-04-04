var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require('body-parser');
var express = require('express'),
    path = require('path'),
    
    app = express();


MongoClient.connect("mongodb://localhost:27017/fruit", function(err,db){
    assert.equal(null, err);
    
    app.use('/', express.static(__dirname + '/public'));
    app.use(bodyParser.json());
    
    app.get('/', function(req, res){
      res.sendFile(__dirname + '/public/index.html');
    });
    
    app.get('/fruits', function(req,res){
       db.collection('fruitlist').find().toArray(function(err, fruits){
           res.send(fruits);
       })
        
    });
    
     app.get('/fruits/:name', function(req,res){
         
        var fruitName = req.params.name;
         db.collection('fruitlist').findOne({'title':fruitName}, 
            function(err, fruit){
              res.json(fruit);
        });
       
    });
    
    app.post('/fruits', function(req,res){
        console.log(req.body);
        
        db.collection('fruitlist').insertOne(req.body, function(err){
           res.send("Ok"); 
        })
        
    });
    
    app.put('/fruits/:name', function(req,res){
        console.log('edit');
        var fruitname = req.params.name;
        console.log(req.body);
        var updatedfruit = {
            title: req.body.title,
            price: req.body.price,
            imgurl: req.body.imgurl,
            detail: req.body.detail,
            unit: req.body.unit,
            producer: req.body.producer
        }
        
        db.collection('fruitlist').update({'title':fruitname},updatedfruit,{upsert: true},
           function(err){
            if(!err){
                res.send("updated");
            }else{
                console.log(err);
                return res.status(404).send("Updating failed");
            }
    });
    });
        
     app.delete('/fruits/:name', function(req,res){
     console.log('delete');
     var fruitname = req.params.name;         
     db.collection('fruitlist').remove({'title':fruitname},1,
        function(err){
             if(!err){
                 res.send("deleted")
             }else{
                    console.log(err);
                    return res.status(404).send("Updating failed");
             }
         
        });
 })
     
    
    app.use(function(req, res){
        res.sendStatus(404);
    });
    
    var server = app.listen(3000, function(){
        console.log("Server listening on port :3000...")
    })
    
});