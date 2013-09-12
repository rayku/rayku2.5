'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []).config(['$httpProvider', function($httpProvider) {
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.defaults.withCredentials = true;
}]);

app
  .controller('ProfileCtrl', function($http, $scope){
    $http.get('https://canvas.rayku.com/api/v1/accounts/1/logins').success(function(data){
	  $scope.login = JSON.parse(data.replace(/^while\(1\);/, ''))[0];
	  $http.get('https://canvas.rayku.com/api/v1/users/'+$scope.login.user_id+'/profile').success(function(data){
		$scope.user = JSON.parse(data.replace(/^while\(1\);/, ''));
	  })
	})
  })
  .controller('MyCtrl1', function($http, $scope) {
	$http.get('http://canvas.rayku.net/api/v1/courses.json').success(function(data){
	  $scope.course = JSON.parse(data.replace(/^while\(1\);/, ''))[0];
	  $http.get('')
	});
  })
  .controller('MyCtrl2', function() {

  })
  .controller('MyLessons', function() {

  });