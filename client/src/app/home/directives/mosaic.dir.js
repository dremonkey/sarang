'use strict';

angular.module('home.directives')
  .directive('mosaic', function (_, utils, $window, $timeout) {

    var defaults = {
      tiles: 100,
      fadeDuration: 300,
      bgFrom: '#FFFFFF',
      bgTo: '#000000'
    };

    /**
     * Calculate the tile dimensions based on window width, height, and desired number of
     * tiles to be generated.
     */
    var getDimen = function (tileCount, element) {

      var
        w = utils.width(element[0]),
        h = utils.height(element[0]),
        area = w * h;

      // calculate exact tile width/height dimensions (assuming area is a perfect square)
      var exact = Math.sqrt(area / tileCount);

      var
        cols = Math.floor(w/exact), // calculate the number of cols
        rows = Math.ceil(h/exact), // calculate the number of rows
        dimen = w/cols,
        tw = dimen + 'px',
        th = dimen + 'px';

      // return the dimensions
      return {
        cols: cols,
        rows: rows,
        tileWidth: tw,
        tileHeight: th
      };
    };

    /**
     * Responsible for adding the mosaic tiles to the page
     */
    var buildTiles = function (opts, element) {

      var
        html = '',
        dimen = getDimen(opts.tiles, element);
      
      // Calculate the minimum number of tiles needed and save it
      // The resulting number may be different from (but close to) the attr tiles BUT is 
      // guaranteed cover the area is completely.
      var tiles = dimen.cols * (dimen.rows + 2);

      for (var i = tiles; i >= 0; i--) {
        var
          mid = utils.getRandomInt(50, +opts.fadeDuration),
          end = utils.getRandomInt(mid+150, mid+250),
          styles = [
            'float:left',
            'width:' + dimen.tileWidth,
            'height:' + dimen.tileHeight,
          ].join(';'),
          data0 = [
            'opacity:0.7',
            'background-color:' + utils.hexToRgb(opts.bgFrom)
          ].join(';'),
          dataMid = [
            'opacity:0.2'
          ].join(';'),
          dataEnd = [
            'opacity:1.0',
            'background-color:' + utils.hexToRgb(opts.bgTo)
          ].join(';');

        var tile = '<div class="tile" data-0="'+data0+'" data-'+mid+'="'+dataMid+'" data-'+end+'="'+dataEnd+'" style='+styles+'></div>';
        
        html += tile;
      }

      return angular.element(element[0]).append(html);
    };

    var directiveDefinitionObject = {

      priority: 10,

      link: {
        pre: function (scope, element, attrs) {

          var opts = _.merge(defaults, attrs);

          // mosiac doesn't look good on mobile so it is disabled
          if (utils.isMobile()) {
            var html = '<div class="tile" style="width:100%;height:100%;"></div>';
            var el = angular.element(element[0]).css({width:'100%',height:'100%'});
            el.append(html);
          }
          else {

            var mosaic = buildTiles(opts, element);

            // If the window is resized, the tile dimensions need to be recalculated
            $window.addEventListener('resize', function () {
              $timeout.cancel(scope.rebuild);
              scope.rebuild = $timeout(function () {
                var dimen = getDimen(opts.tiles, element);
                for (var i = mosaic[0].children.length - 1; i >= 0; i--) {
                  var el = angular.element(mosaic[0].children[i]);
                  if (el.hasClass('tile')) {
                    el.css({
                      width: dimen.tileWidth,
                      height: dimen.tileHeight
                    });
                  }
                }
              }, 100);
            });
          }
        }
      }
    };

    return directiveDefinitionObject;
  });