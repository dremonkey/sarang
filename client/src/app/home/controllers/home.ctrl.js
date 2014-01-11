'use strict';

angular.module('home.controllers')
  .controller('HomeCtrl', function ($scope, $rootScope, utils) {
    $scope.fbEventURL = 'https://www.facebook.com/events/223996884423247/';
    $scope.isMobile = utils.isMobile();
  });