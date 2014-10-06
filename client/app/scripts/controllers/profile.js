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
	// Make the request to the server ... which doesn't exist just yet
			var request = $http.get('/api/recommend/'+$routeParams.userID);
 
			// we'll come back to here and fill in more when ready
			request.success(function (data) {
				// to be filled in on success
			});
 
			request.error(function (data) {
				// to be filled in on error
			});
});