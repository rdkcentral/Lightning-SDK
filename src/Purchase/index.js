import Profile from '../Profile'
import Settings from '../Settings'

let doPurchase = paymentObj => {
  let obj
  const debugMapping = Settings.get('app', 'purchaseErrorMapping')
  const debugCodes = [
    {
      code: 4000,
      message: 'Missing Parameters', // One or more parameters where missing from the request.
    },
    {
      code: 4001,
      message: 'Currency Unknown', // An unknown currency was used.
    },
    {
      code: 4002,
      message: 'Household Non-existent', // The household ID cannot be found in the system.
    },
    {
      code: 4003,
      message: 'Operator Non-existent', // The operator cannot be found in the system.
    },
    {
      code: 4004,
      message: 'Invalid Signature', // The signature used is not valid.
    },
    {
      code: 4005,
      message: 'App Already Owned', // The user already owns this app.
    },
    {
      code: 4010,
      message: 'Price Not Accepted', // The price was not accepted.
    },
    {
      code: 4011,
      message: 'Credit Limit Reached', // The user has no more credit to complete the transaction.
    },
    {
      code: 5000,
      message: 'Unexpected Error', // Something has gone wrong at Metrological.
    },
    {
      code: 5001,
      message: 'Unexpected Error', // Something has gone wrong at the operator.
    },
  ]
  if (debugMapping && debugMapping[paymentObj.id])
    throw new Error(debugCodes.find(x => x.code === debugMapping[paymentObj.id]))

  return Promise.all([
    Profile.household(),
    Profile.countryCode(),
    Profile.operator(),
    Profile.mac(),
  ])
    .then(([household, country, operator, mac]) => {
      obj = JSON.stringify({
        purchase: paymentObj || {},
        identifier: Settings.get('app', 'id'),
        name: Settings.get('app', 'id'),
        household: household,
        country: country,
        operator: operator,
        mac: mac,
        type: 'in-app',
      })
      return Promise.resolve(obj)
    })
    .then(obj => {
      return fetch('https://payment-sdk.metrological.com/', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: obj,
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response.code) throw response
      return response.json()
    })
}
let doConfirm = transactionId => {
  return fetch('https://payment-sdk.metrological.com/confirm', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ transactionId: transactionId }),
  }).then(response => {
    console.log(response)
    if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`)
    return response.json()
  })
}

export const initPurchase = config => {
  doPurchase = config.doPurchase
  doConfirm = config.doConfirm
}

// public API
export default {
  buy(params) {
    return doPurchase(params)
  },
  confirm(params) {
    return doConfirm(params)
  },
}
