'use strict';

/**
 * General Utility Services
 */
angular.module('common.utils', [])
  
  // Allows lodash to be injected
  .factory('_', function () {
    return window._;
  })

  // utility function
  .factory('utils', function ($window) {
    var utils = {};

    /**
     * Returns a random integer between min and max
     * Using Math.round() will give you a non-uniform distribution!
     */
    utils.getRandomInt = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    utils.width = function (el) {
      if (typeof el.clip !== 'undefined') {
        return el.clip.width;
      }
      else {
        if (el.style.pixelWidth) {
          return el.style.pixelWidth;
        }
        else {
          // return el.offsetWidth;
          return el.clientWidth;
        }
      }
    };

    utils.height = function (el) {
      if (typeof el.clip !== 'undefined') {
        return el.clip.height;
      }
      else {
        if (el.style.pixelHeight) {
          return el.style.pixelHeight;
        }
        else {
          // return el.offsetHeight;
          return el.clientHeight;
        }
      }
    };

    utils.hexToRgb = function (hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result) {
        var rgb = [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ];

        return 'rgb('+rgb.join(',')+')';
      }
      else {
        return null;
      }
    };

    utils.isMobile = function () {
      if ((Modernizr.touch && screen.width <= 1024) || $window.outerWidth <= 480) {
        return true;
      }
      return false;
    };

    return utils;
  });