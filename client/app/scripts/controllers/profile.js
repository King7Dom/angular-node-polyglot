'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the clientApp
 */
var app = angular.module('clientApp')

app.controller('ProfileCtrl', function ($scope) {

});

app.controller('TagRecommendCtrl', function ($scope, $http, $routeParams){

	var request = $http.get('/api/recommend/tag/'+$routeParams.userID);

	request.success(function (data) {
		console.log(data);
		$scope.recommendList = data;
	});

	request.error(function (data) {
		console.log(data.message);
	});
});

app.controller('CountRecommendCtrl', function ($scope, $http, $routeParams){

	var request = $http.get('/api/recommend/count/'+$routeParams.userID);

	request.success(function (data) {
		console.log(data);
		$scope.recommendList = data;
	});

	request.error(function (data) {
		console.log(data.message);
	});
});

app.controller('SumRecommendCtrl', function ($scope, $http, $routeParams){

	var request = $http.get('/api/recommend/sum/'+$routeParams.userID);

	request.success(function (data) {
		console.log(data);
		$scope.recommendList = data;
	});

	request.error(function (data) {
		console.log(data.message);
	});
});