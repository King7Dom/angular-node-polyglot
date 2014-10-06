'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SigninCtrl
 * @description
 * # SigninCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
.controller('SigninCtrl', function ($scope, User) {
	$scope.userID = User.get();
	$scope.login = function (userID) {
		User.save(userID);
	};
});
