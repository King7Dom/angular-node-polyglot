'use strict';

describe('Controller: ArtistprofileCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ArtistprofileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ArtistprofileCtrl = $controller('ArtistprofileCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
