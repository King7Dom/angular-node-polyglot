'use strict';

var appServices = angular.module('appServices',[]);

appServices.service('User', function($location){
	var userID;

	this.save = function (userId) {
		userID = userId;
		$location.path('/profile/' + userID);
	};

	this.get = function () {
		return parseInt(userID);
	};
});