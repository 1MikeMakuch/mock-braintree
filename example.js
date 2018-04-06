var braintree = require('./index');

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
