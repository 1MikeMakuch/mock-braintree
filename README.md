# mock-braintree
For testing backend without calling braintree.

Most braintree APIs are stubbed out and provide reasonable/workable return values. Suggestions and PRs welcome.

## Install

    npm install mock-braintree --save

## Usage

    var braintree = require('mock-braintree');

    var purchaseObj = {
      paymentMethodToken: 'fake-valid-visa-nonce',
      amount: 12.34,
      options: {
        submitForSettlement: true,
      },
    };
    return braintree.transaction.sale(purchaseObj).then(result => {
      console.log(JSON.stringify(result));
    });

## Run

    $ DEBUG='mock-braintree' node example.js 
      mock-braintree mock braintree.connect {} +0ms
      mock-braintree mock braintree.transaction.sale {"paymentMethodToken":"fake-valid-visa-nonce","amount":12.34,"options":{"submitForSettlement":true}} +2ms
      mock-braintree mock braintree sale amount 12.34 +1ms
    {"success":true,"transaction":{"addOns":[],"additionalProcessorResponse":null,"amount":12.34,"androidPayCard":{},"applePayCard":{},"authorizationAdjustments":[],"authorizedTransactionId":null,"avsErrorResponseCode":null,"avsPostalCodeResponseCode":"M","avsStreetAddressResponseCode":"I","billing":{"company":null,"countryCodeAlpha2":null,"countryCodeAlpha3":null,"countryCodeNumeric":null,"countryName":null,"extendedAddress":null,"firstName":null,"id":"s2","lastName":null,"locality":null,"postalCode":"12345","region":null,"streetAddress":null},"channel":null,"coinbaseAccount":{},"createdAt":"2018-03-01T14:36:52Z","creditCard":{"bin":"401288","cardType":"Visa","cardholderName":null,"commercial":"Unknown","countryOfIssuance":"","customerLocation":"US","debit":"Unknown","durbinRegulated":"Unknown","expirationDate":"12/2019","expirationMonth":"12","expirationYear":"2019","healthcar
    [snip]
