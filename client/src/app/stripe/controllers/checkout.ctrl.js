'use strict';

/**
 * Stripe Checkout Controller
 */

angular.module('stripe.controllers.checkout', [])
  .controller('StripeCheckoutCtrl', function ($scope, $window, $http) {
    
    var stripePubKey = 'pk_test_czwzkTp2tactuLOEOqbMTRzG'; // replace with live key in production

    // This identifies your website in the createToken call below
    $window.Stripe.setPublishableKey(stripePubKey);

    // converts a string dollar amount to cents by stripping off any '$' signs,
    // turning the string into a float and multiplying by 100.
    var dollarsToCents = function (dollars) {
      var cents = +dollars.replace('$', '') * 100;
      return cents;
    };

    // callback for the create token response
    // if there are no errors, the token will be sent to the server in order to process the charge
    // otherwise an error message will be sent back to the scope to be displayed
    var tokenResponseHandler = function (status, response) {
      console.log(status, response);
      if (response.error) {
        // send error response to the scope
        $scope.$apply(function () {
          $scope.stripe.status = 'processing-error';
          $scope.stripe.response = response.error;
        });
      }
      else {
        $scope.stripe.status = 'processing';
        $scope.stripe.token = response.id; // token contains id, last4, and card type
        
        console.log($scope.stripe.token);
        console.log($scope.card);

        var data = {
          amount: dollarsToCents($scope.card.amount),
          token: $scope.stripe.token,
          description: 'Andre and Pia\'s wedding present'
        };

        console.log(data);

        // send charge request to the server
        $http.post('/api/stripe/charges/create', data)

          // callback if server successfully processed the request
          .success(function (data) {

            // return an error if the stripe servers responsed with an error
            if ('error' === data.status) {
              $scope.stripe.error = {};
              $scope.stripe.status = 'processing-error';
              $scope.stripe.error.type = data.name;
              $scope.stripe.error.msg = data.message;
            }
            
            // charge was successfully processed
            if ('success' === data.status) $scope.stripe.status = 'success';

            // reenable the submit button
            $scope.stripe.disableSubmit = false;

            console.log(data);
          })

          // callback if server could not process the request
          .error(function (data) {
            $scope.stripe.status = 'server-error';
            console.log(data);
          });
      }
    };

    // Initialize the scope variables
    $scope.amounts = [];
    $scope.selectedAmount = null;
    $scope.showForm = false;
    $scope.card = {}; // the form model
    $scope.stripe = {}; // stores form interaction and stripe responses
    $scope.stripe.attempted = false;
    $scope.stripe.disableSubmit = false;

    $scope.resetForm = function () {
      $scope.card = {};
      $scope.stripe = {};
      $scope.selectedAmount = null;
      $scope.stripe.attempted = false;
      $scope.stripe.disableSubmit = false;
      $scope.cardform.$setPristine();
    };

    $scope.displayForm = function (amount) {
      $scope.showForm = true;
      $scope.selectedAmount = amount;
    };

    $scope.closeForm = function () {
      $scope.showForm = false;
      $scope.resetForm();
    };

    // Process card function
    $scope.process = function (card) {

      /* jshint camelcase: false */

      $scope.stripe.status = 'processing';

      var
        data = {},
        exp = card.exp.split('/');

      // set required token data fields
      data.number = card.number;
      data.cvc = card.cvc;
      data.exp_month = exp[0];
      data.exp_year = exp[1];

      // set optional token data fields
      data.name = card.cardholder ? card.cardholder : '';
      if (card.address) {
        data.address_line1 = card.address.line1 ? card.address.line1 : '';
        data.address_line2 = card.address.line2 ? card.address.line2 : '';
        data.address_city = card.address.city ? card.address.city : '';
        data.address_state = card.address.state ? card.address.state : '';
        data.address_zip = card.address.zip ? card.address.zip : '';
        data.address_country = card.address.country ? card.address.country : '';
      }

      console.log(data);

      // create a single use stripe token and send request to server
      $window.Stripe.createToken(data, tokenResponseHandler);
    };
  });