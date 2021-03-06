'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the clientApp
 */
var app = angular.module('clientApp');

app.controller('ProfileCtrl', function () {

});

app.controller('FriendsCtrl', function ($scope, $http, $routeParams) {

	getFriend();

	function getFriend() {
		var request = $http.get('/api/friend/'+$routeParams.userID);

		request.success(function (data) {
			$scope.friends = data;
		});

		request.error(function (data) {
			console.log(data.message);
		});
	};

	$scope.addFriend = function () {
		console.log('FriendID: ' + $scope.friendID);
		if ($scope.friendID) {
			var addFriendRequest = $http.post('/api/friend/add', 
				{'userID':$routeParams.userID, 
				'friendID':$scope.friendID}
			);

			addFriendRequest.success(function (data) {
				console.log(data.message);
				getFriend();

			});
			addFriendRequest.error(function (data) {
				console.log(data.message);
			})
		}
		else {
			alert('There is no friendID!');
			return false;
		}
	};
});

app.controller('TagRecommendCtrl', function ($scope, $http, $routeParams){

	var request = $http.get('/api/recommend/tag/'+$routeParams.userID);

	request.success(function (data) {
		console.log(data);
		var dataRows = [];
		var listener = [];
		$scope.rows = dataRows;

		if (data.length) {
			for (var i=0; i<data.length; i++) {
				listener[data[i].id] = data[i].uniqueListener;
				var artistRequest = $http.get('/api/artist/thumbnail/'+data[i].id);

				artistRequest
				.success(function (artistData) {
					console.log(artistData);
					artistData.listener = listener[artistData._id];
					if (dataRows.length === 0) {
						dataRows.push([artistData]);
					}
					else if (dataRows[dataRows.length-1].length >= 2){
						dataRows.push([artistData]);
					}
					else {
						dataRows[dataRows.length-1].push(artistData);
					}
				})
				.error(function (data) {
					console.log(data.message);
				});
			}

		}
	});

	request.error(function (data) {
		console.log(data.message);
	});
});

app.controller('CountRecommendCtrl', function ($scope, $http, $routeParams){

	var request = $http.get('/api/recommend/count/'+$routeParams.userID);

	request.success(function (data) {
		console.log(data);
		var dataRows = [];
		var count = [];
		$scope.rows = dataRows;

		if (data.length) {
			for (var i=0; i<data.length; i++) {
				count[data[i].id] = data[i].count;
				var artistRequest = $http.get('/api/artist/thumbnail/'+data[i].id);

				artistRequest
				.success(function (artistData) {
					artistData.count = count[artistData._id];
					if (dataRows.length === 0) {
						dataRows.push([artistData]);
					}
					else if (dataRows[dataRows.length-1].length >= 2){
						dataRows.push([artistData]);
					}
					else {
						dataRows[dataRows.length-1].push(artistData);
					}
				})
				.error(function (data) {
					console.log(data.message);
				});
			}
		}
	});

	request.error(function (data) {
		console.log(data.message);
	});
});

app.controller('SumRecommendCtrl', function ($scope, $http, $routeParams){

	var request = $http.get('/api/recommend/sum/'+$routeParams.userID);

	request.success(function (data) {
		console.log(data);
		var dataRows = [];
		var sum = [];
		$scope.rows = dataRows;

		if (data.length) {
			for (var i=0; i<data.length; i++) {
				sum[data[i].id] = data[i].sum;
				var artistRequest = $http.get('/api/artist/thumbnail/'+data[i].id);

				artistRequest
				.success(function (artistData) {
					artistData.sum = sum[artistData._id];
					if (dataRows.length === 0) {
						dataRows.push([artistData]);
					}
					else if (dataRows[dataRows.length-1].length >= 2){
						dataRows.push([artistData]);
					}
					else {
						dataRows[dataRows.length-1].push(artistData);
					}
				})
				.error(function (data) {
					console.log(data.message);
				});
			}
		}
	});

	request.error(function (data) {
		console.log(data.message);
	});
});