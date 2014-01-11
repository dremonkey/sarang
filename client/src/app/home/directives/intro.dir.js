'use strict';

angular.module('home.directives')
  .directive('home', function (utils) {
    var directiveDefinitionObject = {

      priority: 10,

      link: function (scope) {
        scope.isMobile = utils.isMobile();
      }
    };

    return directiveDefinitionObject;
  });