'use strict';

// mockBraintree.js - makes unit tests run much faster.

const uuid = require('uuid');
const debug = require('debug')('mock-braintree');

// braintree.customer.create
// braintree.customer.search
// braintree.paymentMethod.create
// braintree.subscription.create
// braintree.subscription.update
// braintree.transaction.sale
// braintree.connect
// braintree.clientToken.generate

var braintree = {
  clientToken: {},
  transaction: {setFindStatus: () => {}},
  customer: {},
  paymentMethod: {},
  subscription: {},
  Environment: {},
  webhookTesting: {},
  webhookNotification: {},
  WebhookNotification: {
    Kind: {
      SubscriptionCanceled: 'subscription_canceled',
      SubscriptionChargedSuccessfully: 'subscription_charged_successfully',
      SubscriptionChargedUnsuccessfully: 'subscription_charged_unsuccessfully',
      SubscriptionExpired: 'subscription_expired',
      SubscriptionTrialEnded: 'subscription_trial_ended',
      SubscriptionWentActive: 'subscription_went_active',
      SubscriptionWentPastDue: 'subscription_went_past_due',
    },
    parse: function() {},
  },
  Transaction: {
    Status: {
      Authorizing: 0,
      Authorized: 1,
      Settled: 2,
      Settling: 3,
      SettlementConfirmed: 4,
      SettlementPending: 5,
      SubmittedForSettlement: 6,
    },
  },
};

//braintree.TRANSACTION_SUCCESS_STATUSES = braintree.Transaction.Status;

braintree.webhookTesting.sampleNotification = function(obj, id) {
  return {
    bt_signature: 'ppthc4k9dh95kmjs|8ed1ba76e9a05e0a07ab4d63214bdb845edaa7a8',
    bt_payload:
      'PG5vdGlmaWNhdGlvbj4KICAgIDx0aW1lc3RhbXAgdHlwZT0iZGF0ZXRpbWUiPjIwMTgtMDMtMjFUMjA6NDM6MjVaPC90aW1lc3RhbXA+CiAgICA8a2luZD5zdWJzY3JpcHRpb25fY2hhcmdlZF9zdWNjZXNzZnVsbHk8L2tpbmQ+CiAgICA8c3ViamVjdD48c3Vic2NyaXB0aW9uPgogICAgPGlkPnBsdWdoPC9pZD4KICAgIDx0cmFuc2FjdGlvbnMgdHlwZT0iYXJyYXkiPgogICAgICA8dHJhbnNhY3Rpb24+CiAgICAgICAgPHN0YXR1cz5zdWJtaXR0ZWRfZm9yX3NldHRsZW1lbnQ8L3N0YXR1cz4KICAgICAgICA8YW1vdW50PjQ5Ljk5PC9hbW91bnQ+CiAgICAgIDwvdHJhbnNhY3Rpb24+CiAgICA8L3RyYW5zYWN0aW9ucz4KICAgIDxhZGRfb25zIHR5cGU9ImFycmF5Ij48L2FkZF9vbnM+CiAgICA8ZGlzY291bnRzIHR5cGU9ImFycmF5Ij48L2Rpc2NvdW50cz4KPC9zdWJzY3JpcHRpb24+PC9zdWJqZWN0Pgo8L25vdGlmaWNhdGlvbj4=\n',
  };
};

braintree.webhookNotification.parse = function(sig, payload) {
  debug('mock braintree.webhookNotification.parse');
  return new Promise((res, rej) => {
    res({kind: 'check'});
  });
};

var TransactionRefundResult = null;

braintree.transaction.setRefundResult = function(result) {
  debug('mock braintree.transaction.setRefundStatus', JSON.stringify(result));
  TransactionRefundResult = result;
};

braintree.transaction.refund = function(id, amount) {
  debug('mock braintree.transaction.refund', id, amount, '\n');

  if (TransactionRefundResult) {
    var tmp = TransactionRefundResult;
    TransactionRefundResult = null;
    return tmp;
  }

  if (amount) {
    return {
      success: true,
      transaction: {
        id: String(uuid.v4()).replace(/-.*/, '-mock'),
        updatedAt: '2018-03-01T15:28:04Z',
        amount: amount,
        refundedTransactionId: id,
      },
    };
  } else {
    return {
      success: true,
      transaction: {
        id: String(uuid.v4()).replace(/-.*/, '-mock'),
        updatedAt: '2018-03-01T15:28:04Z',
        refundedTransactionId: id,
      },
    };
  }
};
braintree.transaction.void = function(id) {
  return new Promise((res, rej) => {
    res({
      success: true,
      transaction: {
        id: id,
        updatedAt: '2018-03-01T15:28:04Z',
      },
    });
  });
};

var TransactionFindStatus = 'settled';

braintree.transaction.setFindStatus = function(status) {
  debug('mock braintree.transaction.setFindStatus', JSON.stringify(status));
  TransactionFindStatus = status;
};
braintree.transaction.getFindStatus = function() {
  debug('mock braintree.transaction.getFindStatus', TransactionFindStatus);
  return TransactionFindStatus;
};

braintree.transaction.find = function(id) {
  debug('\n\nmock braintree.transaction.find status:', id, TransactionFindStatus);
  //       status: 'authorized', // requires void
  //       status: 'settled', // requires refund
  return new Promise((res, rej) => {
    res({
      status: TransactionFindStatus,
      id: id,
      type: 'sale',
    });
  });
};

braintree.clientToken.generate = function(obj, callback) {
  var response = {
    clientToken: String(uuid.v4()).replace(/-.*/, '-mock'),
  };
  callback({}, response);
};

braintree.xyzzy = function() {
  debug('mock braintree', JSON.stringify(braintree));
};

braintree.transaction.sale = function(saleObj) {
  debug('mock braintree.transaction.sale', JSON.stringify(saleObj));
  return new Promise((res, rej) => {
    res(sale(saleObj.amount));
  });
};

braintree.customer.create = function(obj) {
  debug('mock braintree.customer.create', JSON.stringify(obj));
  return customerCreate(obj);
};
braintree.customer.delete = function(obj) {
  return new Promise((res, rej) => {
    res(true);
  });
};

var searchObj = {};
searchObj.private = {
  email: null,
};
searchObj.email = function() {
  return {
    is: function(email) {
      searchObj.private.email = email;
    },
  };
};

braintree.customer.search = function(searchFunction) {
  searchFunction(searchObj);
  var stream = new require('stream').Readable({objectMode: true});
  stream._read = function(size) {};
  stream.push(customerSearch(searchObj.private));
  stream.push(null);
  return stream;
};

braintree.paymentMethod.create = function(obj) {
  debug('mock braintree.paymentMethod.create', JSON.stringify(obj));
  return paymentMethodCreate(obj);
};
braintree.paymentMethod.delete = function(token) {
  debug('mock braintree.paymentMethod.delete', token);
  return new Promise((res, rej) => {
    return res(true);
  });
};

var subscriptionData = {};

braintree.subscription.create = function(obj) {
  debug('mock braintree.subscription.create', JSON.stringify(obj));
  return new Promise((res, rej) => {
    subscriptionData = subscriptionCreate(obj);
    res(subscriptionData);
  });
};

braintree.subscription.update = function(id, priceObj) {
  debug('mock braintree.subscription.update', id, JSON.stringify(priceObj), '\n');
  subscriptionData.id = id;
  subscriptionData.price = priceObj.price;
  return new Promise((res, rej) => {
    res({success: true});
  });
};

braintree.subscription.search = function(searchFunction) {
  debug('mock braintree.subscription.search');
  var stream = new require('stream').Readable({objectMode: true});
  stream._read = function(size) {};
  stream.push(subscriptionData);
  stream.push(null);
  return stream;
};

braintree.subscription.cancel = function(id) {
  debug('mock braintree.subscription.cancel', id, '\n');
  return new Promise((res, rej) => {
    res({success: true});
  });
};

function subscriptionUpdate(obj) {
  return {
    subscription: {
      addOns: [],
      balance: '0.00',
      billingDayOfMonth: 1,
      billingPeriodEndDate: '2018-03-31',
      billingPeriodStartDate: '2018-03-01',
      createdAt: '2018-03-01T15:28:04Z',
      currentBillingCycle: 1,
      daysPastDue: null,
      description: null,
      descriptor: {
        name: null,
        phone: null,
        url: null,
      },
      discounts: [],
      failureCount: 0,
      firstBillingDate: '2018-03-01',
      id: '92sr4m',
      merchantAccountId: 'xyzzy',
      neverExpires: false,
      nextBillAmount: '29.23',
      nextBillingDate: '2018-04-01',
      nextBillingPeriodAmount: '29.23',
      numberOfBillingCycles: 3,
      paidThroughDate: '2018-03-31',
      paymentMethodToken: '8yrn3s',
      planId: obj.planId,
      price: '29.23',
      status: 'Active',
      statusHistory: [
        {
          balance: '0.00',
          currencyIsoCode: 'USD',
          planId: obj.planId,
          price: '29.23',
          status: 'Active',
          subscriptionSource: 'api',
          timestamp: '2018-03-01T15:38:51Z',
          user: 'foo@bar.com',
        },
        {
          balance: '0.00',
          currencyIsoCode: 'USD',
          planId: obj.planId,
          price: '21.23',
          status: 'Active',
          subscriptionSource: 'api',
          timestamp: '2018-03-01T15:28:04Z',
          user: 'foo@bar.com',
        },
      ],
      transactions: [
        {
          addOns: [],
          additionalProcessorResponse: null,
          amount: '21.23',
          androidPayCard: {},
          applePayCard: {},
          authorizationAdjustments: [],
          authorizedTransactionId: null,
          avsErrorResponseCode: null,
          avsPostalCodeResponseCode: 'M',
          avsStreetAddressResponseCode: 'I',
          billing: {
            company: null,
            countryCodeAlpha2: null,
            countryCodeAlpha3: null,
            countryCodeNumeric: null,
            countryName: null,
            extendedAddress: null,
            firstName: null,
            id: 's2',
            lastName: null,
            locality: null,
            postalCode: '94107',
            region: null,
            streetAddress: null,
          },
          channel: null,
          coinbaseAccount: {},
          createdAt: '2018-03-01T15:28:04Z',
          creditCard: {
            bin: '401288',
            cardType: 'Visa',
            cardholderName: null,
            commercial: 'Unknown',
            countryOfIssuance: '',
            customerLocation: 'US',
            debit: 'Unknown',
            durbinRegulated: 'Unknown',
            expirationDate: '12/2019',
            expirationMonth: '12',
            expirationYear: '2019',
            healthcare: 'Unknown',
            imageUrl: 'https://assets.braintreegateway.com/payment_method_logo/visa.png?environment=sandbox',
            issuingBank: 'Unknown',
            last4: '1881',
            maskedNumber: '401288******1881',
            payroll: 'Unknown',
            prepaid: 'No',
            productId: 'Unknown',
            token: '8yrn3s',
            uniqueNumberIdentifier: '5c8ed688bf608503c86be012e62a73ad',
            venmoSdk: false,
          },
          currencyIsoCode: 'USD',
          customFields: '',
          customer: {
            company: null,
            email: 'foo+user@bar.com',
            fax: null,
            firstName: 'Test',
            id: '556410396',
            lastName: 'User',
            phone: null,
            website: null,
          },
          cvvResponseCode: 'I',
          descriptor: {
            name: null,
            phone: null,
            url: null,
          },
          disbursementDetails: {
            disbursementDate: null,
            fundsHeld: null,
            settlementAmount: null,
            settlementCurrencyExchangeRate: null,
            settlementCurrencyIsoCode: null,
            success: null,
          },
          discountAmount: null,
          discounts: [],
          disputes: [],
          escrowStatus: null,
          gatewayRejectionReason: null,
          id: 'nc5vmw39',
          masterMerchantAccountId: null,
          masterpassCard: {},
          merchantAccountId: 'xyzzy',
          orderId: null,
          partialSettlementTransactionIds: [],
          paymentInstrumentType: 'credit_card',
          paypalAccount: {},
          planId: obj.planId,
          processorAuthorizationCode: '134X9C',
          processorResponseCode: '1000',
          processorResponseText: 'Approved',
          processorSettlementResponseCode: '',
          processorSettlementResponseText: '',
          purchaseOrderNumber: null,
          recurring: true,
          refundId: null,
          refundIds: [],
          refundedTransactionId: null,
          serviceFeeAmount: null,
          settlementBatchId: null,
          shipping: {
            company: null,
            countryCodeAlpha2: null,
            countryCodeAlpha3: null,
            countryCodeNumeric: null,
            countryName: null,
            extendedAddress: null,
            firstName: null,
            id: null,
            lastName: null,
            locality: null,
            postalCode: null,
            region: null,
            streetAddress: null,
          },
          shippingAmount: null,
          shipsFromPostalCode: null,
          status: 'submitted_for_settlement',
          statusHistory: [
            {
              amount: '21.23',
              status: 'authorized',
              timestamp: '2018-03-01T15:28:04Z',
              transactionSource: 'recurring',
              user: 'foo@bar.com',
            },
            {
              amount: '21.23',
              status: 'submitted_for_settlement',
              timestamp: '2018-03-01T15:28:04Z',
              transactionSource: 'recurring',
              user: 'foo@bar.com',
            },
          ],
          subMerchantAccountId: null,
          subscription: {
            billingPeriodEndDate: '2018-03-31',
            billingPeriodStartDate: '2018-03-01',
          },
          subscriptionId: '92sr4m',
          taxAmount: null,
          taxExempt: false,
          threeDSecureInfo: null,
          type: 'sale',
          updatedAt: '2018-03-01T15:28:04Z',
          visaCheckoutCard: {},
          voiceReferralNumber: null,
        },
      ],
      trialDuration: null,
      trialDurationUnit: null,
      trialPeriod: false,
      updatedAt: '2018-03-01T15:38:51Z',
    },
    success: true,
  };
}

function subscriptionCreate(obj) {
  var id = String(uuid.v4()).replace(/-.*/, '-mock');
  if (obj.id) {
    id = obj.id;
  }
  var r = {
    subscription: {
      addOns: [],
      balance: '0.00',
      billingDayOfMonth: 1,
      billingPeriodEndDate: '2018-03-31',
      billingPeriodStartDate: '2018-03-01',
      createdAt: '2018-03-01T15:28:04Z',
      currentBillingCycle: 1,
      daysPastDue: null,
      description: null,
      descriptor: {
        name: null,
        phone: null,
        url: null,
      },
      discounts: [],
      failureCount: 0,
      firstBillingDate: '2018-03-01',
      id: id,
      merchantAccountId: 'xyzzy',
      neverExpires: false,
      nextBillAmount: obj.price,
      nextBillingDate: '2018-04-01',
      nextBillingPeriodAmount: obj.price,
      numberOfBillingCycles: 3,
      paidThroughDate: '2018-03-31',
      paymentMethodToken: '8yrn3s',
      planId: obj.planId,
      price: obj.amount,
      status: 'Active',
      statusHistory: [
        {
          balance: '0.00',
          currencyIsoCode: 'USD',
          planId: obj.planId,
          price: obj.amount,
          status: 'Active',
          subscriptionSource: 'api',
          timestamp: '2018-03-01T15:28:04Z',
          user: 'foo@bar.com',
        },
      ],
      transactions: [
        {
          addOns: [],
          additionalProcessorResponse: null,
          amount: obj.price,
          androidPayCard: {},
          applePayCard: {},
          authorizationAdjustments: [],
          authorizedTransactionId: null,
          avsErrorResponseCode: null,
          avsPostalCodeResponseCode: 'M',
          avsStreetAddressResponseCode: 'I',
          billing: {
            company: null,
            countryCodeAlpha2: null,
            countryCodeAlpha3: null,
            countryCodeNumeric: null,
            countryName: null,
            extendedAddress: null,
            firstName: null,
            id: 's2',
            lastName: null,
            locality: null,
            postalCode: '94107',
            region: null,
            streetAddress: null,
          },
          channel: null,
          coinbaseAccount: {},
          createdAt: '2018-03-01T15:28:04Z',
          creditCard: {
            bin: '401288',
            cardType: 'Visa',
            cardholderName: null,
            commercial: 'Unknown',
            countryOfIssuance: '',
            customerLocation: 'US',
            debit: 'Unknown',
            durbinRegulated: 'Unknown',
            expirationDate: '12/2019',
            expirationMonth: '12',
            expirationYear: '2019',
            healthcare: 'Unknown',
            imageUrl: 'https://assets.braintreegateway.com/payment_method_logo/visa.png?environment=sandbox',
            issuingBank: 'Unknown',
            last4: '1881',
            maskedNumber: '401288******1881',
            payroll: 'Unknown',
            prepaid: 'No',
            productId: 'Unknown',
            token: '8yrn3s',
            uniqueNumberIdentifier: '5c8ed688bf608503c86be012e62a73ad',
            venmoSdk: false,
          },
          currencyIsoCode: 'USD',
          customFields: '',
          customer: {
            company: null,
            email: 'foo+user@bar.com',
            fax: null,
            firstName: 'Test',
            id: '556410396',
            lastName: 'User',
            phone: null,
            website: null,
          },
          cvvResponseCode: 'I',
          descriptor: {
            name: null,
            phone: null,
            url: null,
          },
          disbursementDetails: {
            disbursementDate: null,
            fundsHeld: null,
            settlementAmount: null,
            settlementCurrencyExchangeRate: null,
            settlementCurrencyIsoCode: null,
            success: null,
          },
          discountAmount: null,
          discounts: [],
          disputes: [],
          escrowStatus: null,
          gatewayRejectionReason: null,
          id: String(uuid.v4()).replace(/-.*/, '-mock'),
          masterMerchantAccountId: null,
          masterpassCard: {},
          merchantAccountId: 'xyzzy',
          orderId: null,
          partialSettlementTransactionIds: [],
          paymentInstrumentType: 'credit_card',
          paypalAccount: {},
          planId: obj.planId,
          processorAuthorizationCode: '134X9C',
          processorResponseCode: '1000',
          processorResponseText: 'Approved',
          processorSettlementResponseCode: '',
          processorSettlementResponseText: '',
          purchaseOrderNumber: null,
          recurring: true,
          refundId: null,
          refundIds: [],
          refundedTransactionId: null,
          serviceFeeAmount: null,
          settlementBatchId: null,
          shipping: {
            company: null,
            countryCodeAlpha2: null,
            countryCodeAlpha3: null,
            countryCodeNumeric: null,
            countryName: null,
            extendedAddress: null,
            firstName: null,
            id: null,
            lastName: null,
            locality: null,
            postalCode: null,
            region: null,
            streetAddress: null,
          },
          shippingAmount: null,
          shipsFromPostalCode: null,
          status: 'submitted_for_settlement',
          statusHistory: [
            {
              amount: obj.amount,
              status: 'authorized',
              timestamp: '2018-03-01T15:28:04Z',
              transactionSource: 'recurring',
              user: 'foo@bar.com',
            },
            {
              amount: obj.amount,
              status: 'submitted_for_settlement',
              timestamp: '2018-03-01T15:28:04Z',
              transactionSource: 'recurring',
              user: 'foo@bar.com',
            },
          ],
          subMerchantAccountId: null,
          subscription: {
            billingPeriodEndDate: '2018-03-31',
            billingPeriodStartDate: '2018-03-01',
          },
          subscriptionId: id,
          taxAmount: null,
          taxExempt: false,
          threeDSecureInfo: null,
          type: 'sale',
          updatedAt: '2018-03-01T15:28:04Z',
          visaCheckoutCard: {},
          voiceReferralNumber: null,
        },
      ],
      trialDuration: null,
      trialDurationUnit: null,
      trialPeriod: false,
      updatedAt: '2018-03-01T15:28:04Z',
    },
    success: true,
  };
  if (obj.firstBillingDate) {
    delete r.subscription.transactions;
  }

  return r;
}
function paymentMethodCreate(obj) {
  var brand = 'Visa';
  switch (obj.paymentMethodNonce) {
    case 'fake-valid-nonce':
      brand = 'Visa';
      break;
    case 'fake-paypal-billing-agreement-nonce':
      brand = 'paypal';
      break;
    case 'fake-valid-visa-nonce':
      brand = 'Visa';
      break;
    case 'fake-valid-amex-nonce':
      brand = 'Amex';
      break;
  }
  var token = String(uuid.v4()).replace(/-.*/, '-mock');
  var r = {
    creditCard: {
      billingAddress: {
        company: null,
        countryCodeAlpha2: null,
        countryCodeAlpha3: null,
        countryCodeNumeric: null,
        countryName: null,
        createdAt: '2018-03-01T15:23:06Z',
        customerId: '556410396',
        extendedAddress: null,
        firstName: null,
        id: 'gp',
        lastName: null,
        locality: null,
        postalCode: '94107',
        region: null,
        streetAddress: null,
        updatedAt: '2018-03-01T15:23:06Z',
      },
      bin: '401288',
      cardType: brand,
      cardholderName: null,
      commercial: 'Unknown',
      countryOfIssuance: '',
      createdAt: '2018-03-01T15:23:06Z',
      customerId: '556410396',
      customerLocation: 'US',
      debit: 'Unknown',
      default: false,
      durbinRegulated: 'Unknown',
      expirationDate: '12/2019',
      expirationMonth: '12',
      expirationYear: '2019',
      expired: false,
      healthcare: 'Unknown',
      //      imageUrl: 'https://assets.braintreegateway.com/payment_method_logo/visa.png?environment=sandbox',
      issuingBank: 'Unknown',
      last4: '1881',
      maskedNumber: '401288******1881',
      payroll: 'Unknown',
      prepaid: 'No',
      productId: 'Unknown',
      subscriptions: [],
      token: token,
      uniqueNumberIdentifier: '5c8ed688bf608503c86be012e62a73ad',
      updatedAt: '2018-03-01T15:23:06Z',
      venmoSdk: false,
      verifications: [],
    },
    paymentMethod: {
      billingAddress: {
        company: null,
        countryCodeAlpha2: null,
        countryCodeAlpha3: null,
        countryCodeNumeric: null,
        countryName: null,
        createdAt: '2018-03-01T15:23:06Z',
        customerId: '556410396',
        extendedAddress: null,
        firstName: null,
        id: 'gp',
        lastName: null,
        locality: null,
        postalCode: '94107',
        region: null,
        streetAddress: null,
        updatedAt: '2018-03-01T15:23:06Z',
      },
      bin: '401288',
      cardType: brand,
      cardholderName: null,
      commercial: 'Unknown',
      countryOfIssuance: '',
      createdAt: '2018-03-01T15:23:06Z',
      customerId: '556410396',
      customerLocation: 'US',
      debit: 'Unknown',
      default: false,
      durbinRegulated: 'Unknown',
      expirationDate: '12/2019',
      expirationMonth: '12',
      expirationYear: '2019',
      expired: false,
      healthcare: 'Unknown',
      imageUrl: 'https://assets.braintreegateway.com/payment_method_logo/visa.png?environment=sandbox',
      issuingBank: 'Unknown',
      last4: '1881',
      maskedNumber: '401288******1881',
      payroll: 'Unknown',
      prepaid: 'No',
      productId: 'Unknown',
      subscriptions: [],
      token: token,
      uniqueNumberIdentifier: '5c8ed688bf608503c86be012e62a73ad',
      updatedAt: '2018-03-01T15:23:06Z',
      venmoSdk: false,
      verifications: [],
    },
    success: true,
  };
  return new Promise((res, rej) => {
    return res(r);
  });
}

function customerSearch(obj) {
  var r = {
    addresses: [],
    company: 'Braintree',
    createdAt: '2018-03-01T15:05:26Z',
    creditCards: [],
    customFields: '',
    email: obj.email,
    fax: '614.555.5678',
    firstName: 'Joe',
    id: '264120899',
    lastName: 'Doe',
    merchantId: 'vw3pjnkrwdc32v4r',
    paymentMethods: [],
    phone: '312.555.1234',
    updatedAt: '2018-03-01T15:05:26Z',
    website: null,
  };

  return r;
}

function customerCreate(obj) {
  var r = {
    customer: {
      addresses: [],
      company: 'Braintree',
      createdAt: '2018-03-01T15:05:26Z',
      creditCards: [],
      customFields: '',
      email: obj.email,
      fax: '',
      firstName: obj.firstName,
      id: '264120899',
      lastName: obj.lastname,
      merchantId: 'vw3pjnkrwdc32v4r',
      paymentMethods: [],
      phone: '',
      updatedAt: '2018-03-01T15:05:26Z',
      website: null,
    },
    success: true,
  };
  return r;
}

function sale(amount) {
  amount = parseFloat(amount);
  var r = {
    success: true,
    transaction: {
      addOns: [],
      additionalProcessorResponse: null,
      amount: amount,
      androidPayCard: {},
      applePayCard: {},
      authorizationAdjustments: [],
      authorizedTransactionId: null,
      avsErrorResponseCode: null,
      avsPostalCodeResponseCode: 'M',
      avsStreetAddressResponseCode: 'I',
      billing: {
        company: null,
        countryCodeAlpha2: null,
        countryCodeAlpha3: null,
        countryCodeNumeric: null,
        countryName: null,
        extendedAddress: null,
        firstName: null,
        id: 's2',
        lastName: null,
        locality: null,
        postalCode: '12345',
        region: null,
        streetAddress: null,
      },
      channel: null,
      coinbaseAccount: {},
      createdAt: '2018-03-01T14:36:52Z',
      creditCard: {
        bin: '401288',
        cardType: 'Visa',
        cardholderName: null,
        commercial: 'Unknown',
        countryOfIssuance: '',
        customerLocation: 'US',
        debit: 'Unknown',
        durbinRegulated: 'Unknown',
        expirationDate: '12/2019',
        expirationMonth: '12',
        expirationYear: '2019',
        healthcare: 'Unknown',
        imageUrl: 'https://assets.braintreegateway.com/payment_method_logo/visa.png?environment=sandbox',
        issuingBank: 'Unknown',
        last4: '1881',
        maskedNumber: '401288******1881',
        payroll: 'Unknown',
        prepaid: 'No',
        productId: 'Unknown',
        token: '8yrn3s',
        uniqueNumberIdentifier: '5c8ed688bf608503c86be012e62a73ad',
        venmoSdk: false,
      },
      currencyIsoCode: 'USD',
      customFields: '',
      customer: {
        company: null,
        email: 'joe@blah.com',
        fax: null,
        firstName: 'joe',
        id: '556410396',
        lastName: 'blah',
        phone: null,
        website: null,
      },
      cvvResponseCode: 'I',
      descriptor: {
        name: null,
        phone: null,
        url: null,
      },
      disbursementDetails: {
        disbursementDate: null,
        fundsHeld: null,
        settlementAmount: null,
        settlementCurrencyExchangeRate: null,
        settlementCurrencyIsoCode: null,
        success: null,
      },
      discountAmount: null,
      discounts: [],
      disputes: [],
      escrowStatus: null,
      gatewayRejectionReason: null,
      id: String(uuid.v4()).replace(/-.*/, '-mock'),
      masterMerchantAccountId: null,
      masterpassCard: {},
      merchantAccountId: 'xyzzy',
      orderId: null,
      partialSettlementTransactionIds: [],
      paymentInstrumentType: 'credit_card',
      paypalAccount: {},
      planId: null,
      processorAuthorizationCode: 'R08C3X',
      processorResponseCode: '1000',
      processorResponseText: 'Approved',
      processorSettlementResponseCode: '',
      processorSettlementResponseText: '',
      purchaseOrderNumber: null,
      recurring: false,
      refundId: null,
      refundIds: [],
      refundedTransactionId: null,
      serviceFeeAmount: null,
      settlementBatchId: null,
      shipping: {
        company: null,
        countryCodeAlpha2: null,
        countryCodeAlpha3: null,
        countryCodeNumeric: null,
        countryName: null,
        extendedAddress: null,
        firstName: null,
        id: null,
        lastName: null,
        locality: null,
        postalCode: null,
        region: null,
        streetAddress: null,
      },
      shippingAmount: null,
      shipsFromPostalCode: null,
      status: 'submitted_for_settlement',
      statusHistory: [
        {
          amount: '21.23',
          status: 'authorized',
          timestamp: '2018-03-01T14:36:52Z',
          transactionSource: 'api',
          user: 'foo@bar.com',
        },
        {
          amount: '21.23',
          status: 'submitted_for_settlement',
          timestamp: '2018-03-01T14:36:52Z',
          transactionSource: 'api',
          user: 'foo@bar.com',
        },
      ],
      subMerchantAccountId: null,
      subscription: {
        billingPeriodEndDate: null,
        billingPeriodStartDate: null,
      },
      subscriptionId: null,
      taxAmount: null,
      taxExempt: false,
      threeDSecureInfo: null,
      type: 'sale',
      updatedAt: '2018-03-01T14:36:52Z',
      visaCheckoutCard: {},
      voiceReferralNumber: null,
    },
  };
  debug('mock braintree sale amount', amount);
  if (2000.0 <= amount && amount < 3001.0) {
    r.success = false;
    r.transaction.processorResponseCode = parseInt(amount) + '';
    r.transaction.processorResponseText = 'error';
  }
  return r;
}

braintree.connect = function(params) {
  //  debug('mock braintree.connect', JSON.stringify(params));
  return braintree;
};
module.exports = braintree;
