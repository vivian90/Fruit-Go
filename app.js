var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectId; 
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
    
     app.get('/fruits/:id', function(req,res){
         
        var id = req.params.id;
        id = new ObjectID(id);
         db.collection('fruitlist').findOne({'_id':id}, 
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
    
    app.put('/fruits/:id', function(req,res){
        console.log('edit');
        var id = req.params.id;
         id = new ObjectID(id);
        console.log(req.body);
        var updatedfruit = {
            title: req.body.title,
            price: req.body.price,
            imgurl: req.body.imgurl,
            detail: req.body.detail,
            unit: req.body.unit,
            producer: req.body.producer
        }
        
        db.collection('fruitlist').update({'_id':id},updatedfruit,{upsert: true},
           function(err){
            if(!err){
                res.send("updated");
            }else{
                console.log(err);
                return res.status(404).send("Updating failed");
            }
    });
    });
        
     app.delete('/fruits/:id', function(req,res){
     console.log('delete');
     var id = req.params.id;   
          id = new ObjectID(id);
     db.collection('fruitlist').remove({'_id':id},1,
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