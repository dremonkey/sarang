'use strict';

angular.module('home', ['ui.router.compat', 'home.controllers', 'home.directives', 'snap'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: function () {
          var url = 'home/templates/index.tpl.html';
          // If using a mobile device, load a different template
          if ((Modernizr.touch && screen.width <= 1024) || window.outerWidth <= 480) {
            url = 'home/templates/mobile.tpl.html';
          }
          return url;
        },
        controller: 'HomeCtrl'
      });
  });

angular.module('home.controllers', []);

angular.module('home.directives', []);