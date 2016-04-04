var myApp = angular.module('fruitApp',['ui.router']);

myApp.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('homelist',{
                url:'/',
                templateUrl:'listfruit.html',
                controller:'listCtrl'
            })
            .state('details',{
                url:'/details/:fruitname',
                templateUrl:'fruitdetails.html',
                controller:'detailCtrl'
            })
            .state('addfruit',{
                url:'/addfruit',
                templateUrl:'addfruit.html',
                controller:'detailCtrl'
            })
            .state('editfruit',{
                url:'/editfruit/:fruitname',
                templateUrl:'editfruit.html',
                controller:'editCtrl'
            })
            .state('menu',{
                url:'#/menu',
                templateUrl:'menu.html'
            })
            .state('share',{
                url:'/',
                templateUrl:'share.html'
            })
}])

.controller('listCtrl', ['$scope','$http', function($scope,$http){
    $http.get('/fruits').then(function(res){
         $scope.fruits = res.data;
    });

}])
.controller('detailCtrl', ['$http','$scope','$state','$stateParams', function($http,$scope,$state,$stateParams){
    $http.get('/fruits/' + $stateParams.fruitname).then(function(res){
        $scope.fruit = res.data;
    });
    
    //Add fruit
    
    $scope.save = function(addfruit){
        $scope.addFruit = {};
    
        $http.post('/fruits',addfruit).then(function(){
            $scope.addFruit = {};
            $state.go('homelist');
        })
    };
   
    //Delete fruit
      $scope.remove = function(){
           console.log('delete');
          if(confirm('Are you sure you want to delete it?')){
             $http.delete('/fruits/'+$stateParams.fruitname).then(function(status){
                console.log(status);
                $state.go('homelist');
            })
          }
           
      };   
}])
.controller('editCtrl',['$http','$scope','$state','$stateParams', function($http,$scope,$state,$stateParams){
      $http.get('/fruits/' +$stateParams.fruitname).then(function(res){
          $scope.fruit = res.data;
      });
    //Edit fruit
    $scope.update = function(fruitname){
        var data = $scope.fruit;
        
        $http.put('/fruits/'+$stateParams.fruitname, data).then(function(status){
            $scope.fruit = {};
            $state.go('details', {
                fruitname: data.title
            })
        });
    };
    
    $scope.cancel = function(){
        $state.go('details',{
            fruitname: $scope.fruit.title
        })
    }
    
}]);