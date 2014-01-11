'use strict';

angular.module('common', ['common.utils', 'common.directives']);

angular.module('common.directives', [
  'common.directives.bigvid',
  'common.directives.gstaticmap',
  'common.directives.skrollr',
  'common.directives.videojs'
]);