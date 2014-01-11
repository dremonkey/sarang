'use strict';

/**
 * Attach to any element that needs the skrollr functionality
 */

angular.module('common.directives.videojs', [])
  .directive('videojs', function ($window, utils, $timeout) {

    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = [37, 38, 39, 40];

    var preventDefault = function (e) {
      e = e || window.event;
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    };

    var keydown = function (e) {
      for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
          preventDefault(e);
          return;
        }
      }
    };

    var wheel = function (e) {
      preventDefault(e);
    };

    var disableScroll = function () {
      if ($window.addEventListener) {
        $window.addEventListener('DOMMouseScroll', wheel, false);
      }
      $window.onmousewheel = document.onmousewheel = wheel;
      document.onkeydown = keydown;
    };

    var enableScroll = function () {
      if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
      }
      window.onmousewheel = document.onmousewheel = document.onkeydown = null;
    };

    var directiveDefinitionObject = {
      link: function (scope, element) {
      
        var
          $win = angular.element($window),
          wrapper = element[0].parentNode,
          width = utils.width(wrapper),
          height = utils.height(wrapper),
          player = videojs(element[0]),
          vidStart = 143.35,
          r1 = 16/9, // aspect ratio w : h
          r2 = 9/16; // aspect ratio h : w

        var isPlaying = false; // boolean to track if video is playing

        var vHeight = width * r2 > height ? width * r2 : height;
        var vWidth = height * r1 > width ? height * r1 : width;
        
        // temporarily disable window scroll before video is loaded, otherwise when the
        // video has loaded the browser jumps back to the top of the screen
        // 9/21/13 this seems to have been fixed in version 1.2 of AngularJS
        disableScroll();
        
        // enable scrolling
        $timeout(enableScroll, 1500);

        player.ready(function(){
          player.volume(0);
          player.width(vWidth);
          player.height(vHeight);

          player.on('play', function () {
            isPlaying = true;
          });

          player.on('pause', function () {
            isPlaying = false;
          });

          player.on('loadeddata', function () {
            player.currentTime(vidStart);
          });

          $win.bind('scroll', function () {
            if (!isPlaying && 400 > this.scrollY) {
              player.play();
            }
            else if (isPlaying && 400 <= this.scrollY) {
              player.pause();
            }
          });
        });
      }
    };

    return directiveDefinitionObject;
  });