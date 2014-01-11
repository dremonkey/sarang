'use strict';

/**
 * Directive for a simple google static map
 */

angular.module('common.directives.gstaticmap', [])
  .directive('googleStaticMap', function (_) {

    var defaults = {
      center: '37.77493,-122.419415', // lat,long
      zoom: 13,
      dimen: '400x400'
    };
    
    var directiveDefinitionObject = {
      link: function (scope, element, attrs) {

        var opts = _.merge(defaults, attrs);

        var
          base = 'http://maps.googleapis.com/maps/api/staticmap?',
          srcParams = [
            'sensor=false',
            'zoom=' + opts.zoom,
            'center=' + opts.center,
            'key=' + 'AIzaSyDcQj4QoMeoQDkRZiJvPY5zmuwnIPsiuqo',
            'size=' + opts.dimen
          ],
          linkParams = [
            'z=' + opts.zoom,
            'q=' + opts.center.latitude + ',' + opts.center.longitude
          ];
        
        var
          src = base + srcParams.join('&'),
          href = 'https://maps.google.com/maps?' + linkParams.join('&'),
          img = '<a class="gmap-link" href="' + href + '"><img src="' + src + '"/></a>';

        angular.element(element[0]).append(img);
      }
    };

    return directiveDefinitionObject;
  });