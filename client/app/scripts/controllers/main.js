'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
	.controller('MainCtrl', function ($scope, $location, User) {
		if (User.get()) {
			$location.path('/profile/' + User.get());
		}
	});
