'use strict';

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
  
  $routeProvider.when('/course', {templateUrl: 'partials/course.html', controller: 'CourseContentCtrl'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/course'});
}]);



app.factory('httpInterceptor', function($q){
  return{
    response: function(response){
      var re = /^while\(1\);/;
      if(re.test(response.data)){
        response.data = response.data.replace(re, '');
      }
      if(response.config.headers['Accept'] === 'application/json, text/plain, */*'){
    	try{
      	  response.data = JSON.parse(response.data);
    	}catch(e){
    	  response.data = response.data;
    	}
      }
      return response;
    }
  }
});

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
  .controller('LessonViewCtrl', function($http, $scope, userProvider, $routeParams){
	 console.log('hello world'); 
  })
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
