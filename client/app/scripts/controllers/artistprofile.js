'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ArtistprofileCtrl
 * @description
 * # ArtistprofileCtrl
 * Controller of the clientApp
 */
var app = angular.module('clientApp')

app.controller('ArtistprofileCtrl', function ($scope, $http, $routeParams, User) {

	getArtist();

	function getArtist() {
		var request = $http.get('/api/artist/'+$routeParams.artistID);

		request.success(function (data) {
			$scope.artist = data;
		});

		request.error(function (data) {
			console.log(data.message);
		});
	}

	$scope.addTag = function () {
		if ($scope.tagName) {
			console.log('Artist: '+ $routeParams.artistID);
			console.log('Tag: ' + $scope.tagName);
			console.log('User: ' + User.get());
			var addTagRequest = $http.post('/api/artist/tag', 
				{ 'userID': User.get(), 'artistID': $routeParams.artistID, 'tagName': $scope.tagName }
			);

			addTagRequest.success(function (data) {
				console.log(data.message);
				getArtist();
				$scope.tagName = null;
			});

			addTagRequest.error(function (data) {
				console.log(data.message);
			});

		}
		else {
			alert('No tag given!');
			return false;
		}
	}
	

});
