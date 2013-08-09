'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []).config(['$httpProvider', function($httpProvider) {
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.defaults.withCredentials = true;
}]);

app.
  controller('MyCtrl1', function($http, $scope) {
	$http.get('http://canvas.rayku.net/api/v1/courses.json').success(function(data){
	  $scope.course = JSON.parse(data.replace(/^while\(1\);/, ''))[0];
	});
  })
  .controller('MyCtrl2', [function() {

  }]);