'use strict';

/* Controllers */

/**
 * https://canvas.rayku.com/api/v1/courses/ - get my courses
 * https://canvas.rayku.com/api/v1/courses/1/modules/ - get the modules for A course
 * https://canvas.rayku.com/api/v1/courses/1/modules/2/items - get the items in A module for A course
 * https://canvas.rayku.com/api/v1/courses/1/pages/module-1-lesson-1 - get the page
 */

var app = angular.module('myApp', []).config(['$httpProvider' , '$routeProvider', function($httpProvider, $routeProvider) {
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.interceptors.push('httpInterceptor');
  
  $routeProvider
    .when('/course/:courseId' , { controller: 'CourseCtrl' })
    .when('/course/:courseId/module/:moduleId/content/:content', { controller: 'CourseContentCtrl' })
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
  .controller('CourseContentCtrl', function($http, $scope, userProvider, $routeParams){
	userProvider.getUser().then(function(user){
	  $http.get('https://canvas.rayku.com/v1/courses/'+$routeParams.courseId+'/pages/'+$routeParams.content).then(function(data){
		
	  })
	})
  });
