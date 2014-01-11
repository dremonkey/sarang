'use strict';

/**
 * Attach to any element that needs the skrollr functionality
 */

angular.module('common.directives.skrollr', [])
  .directive('skrollr', function (utils) {

    var _skrollr = skrollr.get();

    // Helper function to recursively traverse an element and extract all child nodes
    function getNodes(el, elements) {
      elements = elements || [];
      elements.push(el);
      var children = el.childNodes;
      for (var i=0; i < children.length; i++) {
        if (children[i].nodeType === 1) {
          elements = getNodes(children[i], elements);
        }
      }
      return elements;
    }
    
    var directiveDefinitionObject = {
      link: function (scope, element) {
        if (!utils.isMobile()) {
          if ('undefined' === typeof(_skrollr)) {
            _skrollr = skrollr.init({
              forceHeight: false
            });
            // skrollr.menu.init(_skrollr, {
            //   animate: true,
            //   easing: 'sqrt',
            //   duration: function(currentTop, targetTop) {
            //     return Math.abs(currentTop - targetTop) * 10;
            //   }
            // });
          }
          else {
            var elements = getNodes(element[0]);
            _skrollr.refresh(elements);
          }
        }
      }
    };

    return directiveDefinitionObject;
  });