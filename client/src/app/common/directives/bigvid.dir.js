'use strict';

/**
 * Directive for a background video
 */

angular.module('common.directives.bigvid', [])

  .directive('bigvid', function (_, utils) {
    
    var defaults = {};
    
    var directiveDefinitionObject = {
      
      templateUrl: 'common/templates/bigvid.tpl.html',

      link: {
        pre: function (scope, element, attrs) {
          
          scope.isMobile = utils.isMobile();
          
          var opts = _.merge(defaults, attrs);
          var videos = [];

          if (opts.webm) videos.push({src: opts.webm, type: 'video/webm'});
          if (opts.mp4) videos.push({src: opts.mp4, type: 'video/mp4'});
          if (opts.ogg) videos.push({src: opts.ogg, type: 'video/ogg'});

          scope.videos = videos;
        }
      }
    };

    return directiveDefinitionObject;
  });