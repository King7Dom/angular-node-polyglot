'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ArtistprofileCtrl
 * @description
 * # ArtistprofileCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
	.controller('ArtistprofileCtrl', function ($scope) {

		var request = $http.get('/api/artist/'+$routeParams.artistID);

		

	});
