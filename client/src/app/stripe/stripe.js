'use strict';

/**
 * Stripe Module
 */

angular.module('stripe', [
  'stripe.controllers',
  'stripe.directives',
  'ngAnimate'
]);

angular.module('stripe.controllers', [
  'stripe.controllers.checkout'
]);

angular.module('stripe.directives', [
  'stripe.directives.checkout'
]);