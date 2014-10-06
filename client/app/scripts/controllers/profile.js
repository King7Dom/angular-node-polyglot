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
		console.log(data.msg);
	});

	request.error(function (data) {
		console.log(data.msg);
	});
});