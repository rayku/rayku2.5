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
  
  $routeProvider.when('/course/:courseId', {templateUrl: 'partials/course.html'});
  $routeProvider.when('/course/:courseId/unit/:moduleId', {templateUrl: 'partials/course.html', controller: 'UnitViewCtrl'});
  $routeProvider.when('/lesson', {templateUrl: 'partials/lesson.html', controller: 'LessonViewCtrl'});
  //$routeProvider.otherwise({redirectTo: '/course'});
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
   userProvider.getUser().then(function(user){
    $http.get('https://canvas.rayku.com/api/v1/courses/1/pages/module-1-lesson-1').success(function(data){
      console.log(data);
      //Get Video Id from returned string
      var body = data.body.match(/<a[^\b>]+>(.+)[\<]\/a>/)[1];
      var videoId = body.split("=")[1];
      $scope.video = videoId;
      
      //set lesson to data returned
      $scope.lesson = data;
    })
  })
}).controller('ProfileCtrl', function($http, $scope, userProvider){
    userProvider.getUser().then(function(user){
      $http.get('https://canvas.rayku.com/api/v1/users/'+user.user_id+'/profile').success(function(data){
        $scope.user = data;
      })
    })
}).controller('CourseViewCtrl', function($http, $scope, userProvider, $routeParams, $location){
  userProvider.getUser().then(function(user){
    $http.get('https://canvas.rayku.com/api/v1/courses/'+$routeParams.courseId).success(function(data){
      $scope.course = data;
    });
    $http.get('https://canvas.rayku.com/api/v1/courses/'+$routeParams.courseId+'/modules').success(function(data){
      for(var i = 0; i < data.length; i++){
    	if(data[i].state == "started"){
    	  $scope.unit = data[i];
    	  $location.path('/course/'+$routeParams.courseId+'/unit/'+data[i].id);
    	  break;
    	}
      }
    })
  })
}).controller('UnitViewCtrl', function($http, $scope, userProvider, $routeParams){
  userProvider.getUser().then(function(user){
    $http.get('https://canvas.rayku.com/api/v1/courses/'+$routeParams.courseId+'/modules/'+$routeParams.moduleId+'/items').success(function(data){
	  $scope.chapters = data;
	  console.log(data);
	})
  })
});
