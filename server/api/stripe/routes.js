'use strict';

var
  config = require('../../config'),
  stripe = require('stripe')(config.stripe.apiKey);

var routes = function (app) {
  // Define the stripe api routing
  app.namespace('/api/stripe/charges', function () {
    app.post('/create', function (req, res) {
      
      var
        token = req.param('token', null), // retrieve the card token created using Stripe.js
        amount = req.param('amount', 0),
        description = req.param('description', '');

      stripe.charges.create({
        currency: 'usd',
        card: token,
        amount: amount,
        description: description
      },
      // callback
      function (err, charge) {
        if (err) {
          console.log(err, charge);
          
          res.json({
            status: 'error',
            name: err.name,
            message: err.message,
            code: err.code,
            param: err.param
          });
        }

        res.json({status: 'success', charge: charge});
      });

    });
  });
};

module.exports = routes;