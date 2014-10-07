'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ArtistprofileCtrl
 * @description
 * # ArtistprofileCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
	.controller('ArtistprofileCtrl', function ($scope, $http, $routeParams) {

		var request = $http.get('/api/artist/'+$routeParams.artistID);

		request.success(function (data) {
			$scope.artist = data;
		});

		request.error(function (data) {
			console.log(data.message);
		});

	});
