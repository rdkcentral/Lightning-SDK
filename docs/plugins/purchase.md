# Purchase


You can use the Purchase plugin to integrate *in-app purchases* in your App, in combination with the Metrological Billing Server. This way, you can let customers perform transactions in Apps, and the customers can pay for the transactions via the operator’s monthly bill.

## Usage


If you want to integrate purchases in your App, import the Purchase plugin from the Lightning SDK:


```
import { Purchase } from '@lightningjs/sdk'
```

## Available Methods

### buy()


The `buy` method executes all the required steps to do a full purchase of an asset.

> If you use this method, it is required that you have *properly configured* the Purchase plugin via the `setup` method (see [below](#setup)).


In a typical, default setup, buying an asset with the Lightning SDK and the Metrological Billing Server only requires calling `Purchase.buy()`. No other calls should be necessary.


The `buy` method performs the following actions:

* Retrieve a signature for a gives asset
* Fire a payment request to the Metrological Billing Server
* Attempt to register a successful purchase at the CSP backend
* Confirm back to the Metrological Billing Server that the purchase has been registered by the CSP backend


The `buy` method accepts an `assetId `(as defined by the CSP) as its first argument. For example:


```
const assetId = '123abc'
Purchase.buy(assetId).then(() => {
  // asset succesfully bought
}).catch(err => {
  // some error
})
```

### setup()


You use the `setup` method to configure the Purchase plugin for matching with a specific CSP backend setup, which is used for providing available assets and storing purchased asset records.

> The `setup` method should only be called once, before any other Purchase plugin method is called.


The `setup` method accepts a *configuration object* as its only argument. The object can have *2 keys*:

* `cspUrl`: specifies the *base URL* of the backend of the CSP (Content Service Provider).
* `endPoints`: used to customize API endpoints that differ from the default specification (as outlined below). For each *endpoint* that differs from the default, you specify the *URI* (which is appended to the `cspUrl`, unless specified as a fully qualified domain) and the REST *method* to use.


```
{
  assets: {
    uri: '/assets',
    method: 'GET',
  },
  asset: {
    uri: '/assets/:id',
    method: 'GET',
  },
  signature: {
    uri: '/assets/:id/signature',
    method: 'POST',
  },
  subscribe: {
    uri: '/assets/:id/subscribe',
    method: 'POST',
  },
  unsubscribe: {
    uri: '/assets/:id/unsubscribe',
    method: 'POST',
  },
}
```


```
Purchase.setup('http://csp-backend.com/api', {
  assets: {
    uri: '/products',
    method: 'GET',
  },
  unsubscribe: {
    uri: '/subscriptions/:id',
    method: 'DELETE',
  },
})
```

> If the CSP backend does *not* completely follow the expected blueprint, or can not be configured properly via the `setup` method, the steps in the `buy` method can also be implemented *manually*. In that case, you can use the Plugin methods `signature`, `payment`, `subscribe` and `confirm` (see [below](#signature)).

### assets()


The `assets` method returns a *Promise* with the result of the request that is made to the CSP to retrieve available assets for purchase. Typically, it returns an Array of objects containing information about the assets (such as *title*, *description* and *price*).


You can use the `household` option to return information on whether the assets were purchased by the current household or not. It is automatically added as a `query param` in the request.


The `assets` method is an *optional* convenience method provided by the Purchase plugin. Depending on the CSP's API integration, you can implement the functionality to retrieve assets in your App in a fully customized manner.


```
Purchase.assets().then(assets => {
  // do something with assets
})
```

### asset()


The `asset` method returns a Promise with the result of the request to the CSP to retrieve details for a specific asset.


You can use the  `household` option to return information on whether the asset was purchased by the current household or not. It is automatically added as a `query param` in the request.


The `asset` method is an *optional* convenience method provided by the Purchase plugin. Depending on the CSP's API integration, you can implement the functionality to retrieve assets in your App in a fully customized manner.


```
const assetId = '123abc'
Purchase.asset(assetId).then(assets => {
  // do something with assets
})
```

### signature()


To make a payment request to the Metrological Billing Server, the CSP must provide a *signed signature*.


The `signature` method returns a *Promise* with the result of the request made to the CSP to retrieve that signature. It accepts the `id` of the asset to purchase as its argument.


The `household` option is automatically added  as a `query param` in the request.


The `signature` method is an *optional* convenience method provided by the Purchase plugin. Depending on the CSP's API integration, you can implement the functionality to generate a purchase signature in your App in a fully customized manner.


```
const assetId = '123abc'
Purchase.signature(assetId).then(signature => {
  // call Purchase.payment() with signature
})
```

### payment()


The `payment` method calls the Metrological Billing Server to execute a purchase. It accepts a *valid signature* (as retrieved from the CSP) as its argument.


The method returns a *Promise*. If successful, the Promise resolves to a transaction object (that can be stored on the CSP side). If not, it rejects with an error code in case of a failure.


```
const signature = {} // received from Payment.signature()
Purchase.payment(signature).then(() => {
  // call Payment.subscribe()
})
```

### subscribe()


After a successful transaction, the CSP stores the purchase on their system. Especially in the case of recurring subscriptions, where storing the purchase is essential.


The `subscribe` method returns a *Promise* with the result of the request made to the CSP to register the purchase. It accepts the `id` of the purchased asset as its first argument, and the `transaction` object as received from the Metrological Billing Server (via `Purchase.payment()`) as its second argument.


The `subscribe` method is an *optional* convenience method provided by the Purchase plugin. Depending on the CSP's API integration, you can implement the functionality to register a purchase in your App in a fully customized manner.


```
const assetId = '123abc'
const transaction = {} // received from Purchase.payment()
Purchase.subscribe(assetId, transaction).then(() => {
  // call Purchase.confirm()
})
```

### confirm()


The `confirm` method calls the Metrological Billing Server to confirm a purchase. It accepts a `transactionId` (which is available inside the transaction object that is returned by a successful `payment` request) as its argument.


Calling the method notifies the Metrological Billing Server that the CSP has received *and* stored the purchase on the CSP's backend.


The method returns a *Promise* which resolves in case of a successful confirmation. If the `transactionId` is not valid, the Promise is rejected.


```
const transaction = {} // received from Purchase.payment()
Purchase.subscribe(transaction.transactionId).then(() => {
  // full purchase flow done
})
```

### unsubscribe()


Since the CSP is responsible for renewing subscriptions in the context of the Metrological Billing Server, the CSP must be able to handle *cancellations of recurring purchases*.


The `unsubscribe` method returns a *Promise* with the result of the request made to the CSP to unsubscribe from a recurring purchase. It accepts the `id` of the purchased asset as its first argument.


The `unsubscribe` method is an *optional* convenience method provided by the Purchase plugin. Depending on the CSP's API integration, you can implement the functionality to cancel recurring purchases in your App in a fully customized manner.


```
const assetId = '123abc'
Purchase.unsubscribe(assetId).then(() => {
  // unsubscribed
})
```