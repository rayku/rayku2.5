'use strict';

var app = angular.module('myApp', []).config(['$httpProvider' , '$routeProvider', function($httpProvider, $routeProvider) {
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.interceptors.push('httpInterceptor');
  
  $routeProvider.when('/course/:courseId', {templateUrl: 'partials/course.html'});
  $routeProvider.when('/course/:courseId/unit/:moduleId', {templateUrl: 'partials/course.html', controller: 'UnitViewCtrl'});
  $routeProvider.when('/course/:courseId/:type/:moduleId/:lessonId', {templateUrl: 'partials/lesson.html', controller: 'LessonViewCtrl'});
  $routeProvider.when('/course/:courseId/:type/:moduleId/:solutionId', {templateUrl: 'partials/lesson.html', controller: 'LessonViewCtrl'});
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
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

app.factory('userProvider', function($q, $http, $location){
  var user;
  var getUser = function() {
	var deferred = $q.defer();
	if(!user){
      $http.get(domain+'/api/v1/accounts/1/logins', {cache:true}).error(function(Obj){
        if(Obj.status == "unauthenticated"){
          $location.path('/login');
        }
      }).then(function(Obj){
    	if(Obj.data.length == 0){
    	  $location.path('/login');
    	}
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

app.controller('LoginCtrl', function($http, $scope, $location){
  $http.get(domain+'/api/v1/accounts/1/logins').success(function($data){
	$location.path('/course/1');
  });
  
  $scope.login = function(user){
	var login_form = $.param({
	  'pseudonym_session[unique_id]': user.username,
	  'pseudonym_session[password]' : user.password
	});
	
	$http.post(domain+'/login?nonldap=true', login_form, { headers: {'Content-Type': 'application/x-www-form-urlencoded'} }).success(function($data){
	  $location.path('/course/1');
	});
  };
  
  // This function is yucky
  $scope.register = function(user){
	var register_form = $.param({
	  'user[name]' : user.fname ,
	  'pseudonym[unique_id]' : user.email ,
	  'pseudonym[password]' : user.password
	});
	
	// Register
	$http.post(domain+'/api/v1/accounts/1/users?access_token=XEs3w4Ar8trTwaK60go0J7AnYUhZYmHbiCCqNW2IuGYjBOOetlF4yfdcQ2d1CIdn', register_form, {headers: {
	  'Content-Type': 'application/x-www-form-urlencoded'
    }}).success(function($data){
      var login_form = $.param({
	    'pseudonym_session[unique_id]': user.email,
	    'pseudonym_session[password]' : user.password
	  });
	
      // Login
	  $http.post(domain+'/login?nonldap=true', login_form, { headers: {'Content-Type': 'application/x-www-form-urlencoded'} }).success(function($data){
	    var enrolment = $.param({
	      'enrollment[user_id]' : $data.pseudonym.user_id,
	      'enrollment[type]' : 'StudentEnrollment',
	      'enrollment[enrollment_state]' : 'active',
	    });
	    
	    // Enroll
	    $http.post(domain+'/api/v1/courses/1/enrollments?access_token=XEs3w4Ar8trTwaK60go0J7AnYUhZYmHbiCCqNW2IuGYjBOOetlF4yfdcQ2d1CIdn', enrolment, { headers: {'Content-Type': 'application/x-www-form-urlencoded'} }).success(function(){
	      $location.path('/course/1');
	    });
	  });
	});
  };
}).controller('LessonViewCtrl', function($http, $scope, userProvider, $routeParams){
  userProvider.getUser().then(function(user){
    $http.get(domain+'/api/v1/courses/'+$routeParams.courseId+'/pages/'+$routeParams.moduleId).success(function(data){
      data.body = JSON.parse(data.body.match(/<p>(.*?)<\/p>/)[1]);
      $scope.data = data;
      $scope.type = $routeParams.type;
      
      if($routeParams.type == 'solution'){
    	$scope.video = data.body.solution_videos[$routeParams.solutionId-1];
    	$scope.videos = data.body.solution_videos;
      }
      
      if($routeParams.type == 'lesson'){
      	$scope.video = data.body.lesson_videos[$routeParams.lessonId-1];
      	$scope.videos = data.body.lesson_videos;
      }
      
      $scope.course = {'id': $routeParams.courseId};
    });
  })
}).controller('ProfileCtrl', function($http, $scope, userProvider){
  console.log('profile controller');
  userProvider.getUser().then(function(user){
    $http.get(domain+'/api/v1/users/'+user.user_id+'/profile').success(function(data){
      $scope.user = data;
    })
  })
}).controller('CourseViewCtrl', function($http, $scope, userProvider, $routeParams, $location){
  userProvider.getUser().then(function(user){
    $http.get(domain+'/api/v1/courses/'+$routeParams.courseId).success(function(data){
      $scope.course = data;
    });
    $http.get(domain+'/api/v1/courses/'+$routeParams.courseId+'/modules').success(function(data){
      $scope.modules = data;
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
    $http.get(domain+'/api/v1/courses/'+$routeParams.courseId+'/modules/'+$routeParams.moduleId+'/items').success(function(data){
	  $scope.chapters = data;
	})
  })
});
