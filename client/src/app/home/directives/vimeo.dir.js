'use strict';

angular.module('home.directives')
  .directive('vimeo', function ($sce, _, utils, $window, $timeout) {

    var defaults = {
      src: '//player.vimeo.com/video/73007829?byline=0&amp;portrait=0&amp;title=0'
    };

    var calculateSize = function (iframe, parent, videoRatio) {
      var
        width = utils.width(parent),
        height = utils.width(parent) * videoRatio;

      iframe.width = width;
      iframe.height = height;
    };

    var directiveDefinitionObject = {
      template: '<iframe ng-src="{{src}}" frameborder="0" width="400" height="225" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
      link: function (scope, element, attrs) {
        var opts = _.merge(defaults, attrs);
        scope.src = $sce.trustAsResourceUrl(opts.src);

        var
          parent = element[0],
          iframe = element[0].firstChild,
          videoRatio = ( iframe.height / iframe.width );

        calculateSize(iframe, parent, videoRatio);

        // If the window is resized, the dimensions need to be recalculated
        $window.addEventListener('resize', function () {
          $timeout.cancel(scope.rebuild);
          scope.rebuild = $timeout(function () {
            calculateSize(iframe, parent, videoRatio);
          });
        });
      }
    };

    return directiveDefinitionObject;
  });