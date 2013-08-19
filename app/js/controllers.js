'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []).config(['$httpProvider', function($httpProvider) {
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.interceptors.push('httpInterceptor');
}]);
// http interceptor to remove jsonp hijacking and parse json responses appropriately
app.factory('httpInterceptor', function($q){
  return{
    response: function(response){
      // parse out the jsonp anti hijacking while
      var re = /^while\(1\);/;
      if(re.test(response.data)){
        response.data = response.data.replace(re, '');
      }
      // if the response is json parse it as such
      if(response.config.headers['Accept'] === 'application/json, text/plain, */*'){
    	response.data = JSON.parse(response.data);  
      }
      return response;
    }
  }
});

// user provider that returns a promise to ensure we have the user from the server
app.factory('userProvider', function($q, $http){
  var user;
  var getUser = function() {
	var deferred = $q.defer();
	if(!user){
      $http.get('https://canvas.rayku.com/api/v1/accounts/1/logins', {cache:true}).then(function(Obj){
	    user = Obj.data[0];
        deferred.resolve(user);
      });
	}else{
      deferred.resolve(user);
	}
    return deferred.promise;
  };
  
  return {
	getUser : getUser
  };
});

app
  .controller('ProfileCtrl', function($http, $scope, userProvider){
    userProvider.getUser().then(function(user){
      $http.get('https://canvas.rayku.com/api/v1/users/'+user.user_id+'/profile').success(function(data){
        $scope.user = data;
      });
    });
  })
  .controller('ModuleCtrl', function($http, $scope, userProvider) {
    userProvider.getUser().then(function(user){
    })
  });
