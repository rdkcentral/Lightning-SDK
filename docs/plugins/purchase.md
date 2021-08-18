# Purchase

You can use the Purchase plugin to integrate *in-app purchases* in your App, in combination with the Metrological Billing Server. This way, you can let customers perform transactions in Apps, and the customers can pay for the transactions via the operator’s monthly bill.

## Usage

If you want to integrate purchases in your App, import the Purchase plugin from the Lightning SDK:

```js
import { Purchase } from '@lightningjs/sdk'
```

## Available Methods

### buy

The `buy` method executes all the required steps to do a full purchase of an asset.

> If you use this method, it is required that you have *properly configured* the Purchase plugin via the `setup` method (see [below](#setup)).

In a typical, default setup, buying an asset with the Lightning SDK and the Metrological Billing Server only requires calling `Purchase.buy()`. No other calls should be necessary.

The `buy` method performs the following actions:

* Retrieve a signature for a given asset
* Fire a payment request to the Metrological Billing Server
* Attempt to register a successful purchase at the CSP backend
* Confirm back to the Metrological Billing Server that the purchase has been registered by the CSP backend

The `buy` method accepts an `assetId `(as defined by the CSP) as its first argument. For example:

```js
const assetId = '123abc'
Purchase.buy(assetId).then(() => {
  // asset succesfully bought
}).catch(err => {
  // some error
})
```

> If the CSP backend does *not* completely follow the expected blueprint, or can not be configured properly via the `setup` method, the steps in the `buy` method can also be implemented *manually*. In that case, you can use the Purchase plugin methods `signature`, `payment`, `subscribe` and `confirm` (see [below](#signature)).

### setup

You use the `setup` method to configure the Purchase plugin for matching with a specific CSP backend setup, which is used for providing available assets and storing purchased asset records.

> The `setup` method should only be called *once*, before any other Purchase plugin method is called.

The `setup` method accepts a *configuration object* as its only argument. The object can have *2 keys*:

* `cspUrl`: specifies the *base URL* of the backend of the CSP (Content Service Provider).
* `endPoints`: can be used to customize those API endpoints that differ from the default specification (as outlined below). For each *endpoint* that differs from the default, you specify the *URI* (which will be appended to the `cspUrl`, unless specified as a fully qualified domain) and the REST *method* to use.

If needed, you can also specify an object with custom `headers` that will be merged with the default headers (`{ Accept: 'application/json', 'Content-Type': 'application/json' }`).

```js
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

```js
Purchase.setup('http://csp-backend.com/api', {
  assets: {
    uri: '/products',
    method: 'GET',
  },
  unsubscribe: {
    uri: '/subscriptions/:id',
    method: 'DELETE',
  },
  signature: {
    uri: '/assets/:id/signature',
    method: 'POST',
    headers: {
      'x-auth-token': 'abcd123xyz'
      'cache-control': 'no-cache'
    }
  },
})
```

In some cases, the setup of the CSP backend differs too much from the default specification and it becomes too difficult to configure the enpoint URIs. In those cases, you can specify a *callback* instead, and handle the request to the CSP backend entirely yourself.

The callback function will receive 2 arguments: `params` and `data`. It should always return a Promise which resolves with the result (or rejects with an error in case of a failure).

> When a callback is specified, all other keys in the endpoint configuration are ignored.

```js
Purchase.setup('http://csp-backend.com/api', {
  asset: {
    callback(params, data) {
      return Promise((resolve, reject) => {
        Api.getAssetDetails(params.id)
          .then(resolve)
          .catch(reject)
      }
    }
  },
  signature: {
    callback(params, data) {
      return fetch('http://csp-backend.com/api/' + data.household + '?productId=' + params.id, {
        headers: {
          'Accept': 'application/json',
				  'Content-Type': 'application/json'
        }),
        method: 'POST',
      })
    }
  },
})
```

### assets

The `assets` method returns a *Promise* with the result of the request that is made to the CSP to retrieve available assets for purchase. Typically, it returns an Array of objects containing information about the assets (such as *title*, *description* and *price*).

The `household` is automatically sent as a `query param` in the request. This allows to return information on whether the assets were purchased by the current household or not.

The `assets` method is an *optional* convenience method provided by the Purchase plugin. Depending on the CSP's API integration, the functionality to retrieve assets can be fully custom-implemented in your App.

```js
Purchase.assets().then(assets => {
  // do something with assets
})
```

### asset

The `asset` method returns a Promise with the result of the request to the CSP to retrieve details for a specific asset.

The `household` is automatically sent as a `query param` in the request. This allows to return information on whether the asset was purchased by the current household or not.

The `asset` method is an *optional* convenience method provided by the Purchase plugin. Depending on the CSP's API integration, the functionality to retrieve an asset can be fully custom-implemented in your App.

```js
const assetId = '123abc'
Purchase.asset(assetId).then(assets => {
  // do something with assets
})
```

### signature

To make a payment request to the Metrological Billing Server, the CSP must provide a *signed signature*.

The `signature` method returns a *Promise* with the result of the request made to the CSP to retrieve that signature. It accepts the `id` of the asset to purchase as its argument.

The `household` value is automatically added as a `query param` in the request.

The `signature` method is an *optional* convenience method provided by the Purchase plugin. Depending on the CSP's API integration, the functionality to generate a purchase signature can be fully custom-implemented in your App.

```js
const assetId = '123abc'
Purchase.signature(assetId).then(signature => {
  // call Purchase.payment() with signature
})
```

### payment

The `payment` method calls the Metrological Billing Server to execute a purchase. It accepts a *valid signature* (as retrieved from the CSP) as its argument.

The method returns a *Promise*. If successful, the Promise resolves to a transaction object (that can be stored on the CSP side). If not, it rejects with an error code in case of a failure.

```js
const signature = {} // received from Payment.signature()
Purchase.payment(signature).then(() => {
  // call Payment.subscribe()
})
```

### subscribe

After a successful transaction, the CSP stores the purchase on their system. Especially in the case of recurring subscriptions, where storing the purchase is essential.

The `subscribe` method returns a *Promise* with the result of the request made to the CSP to register the purchase. It accepts the `id` of the purchased asset as its first argument, and the `transaction` object as received from the Metrological Billing Server (via `Purchase.payment()`) as its second argument.

The `subscribe` method is an *optional* convenience method provided by the Purchase plugin. Depending on the CSP's API integration, the functionality to register a purchase can be fully custom-implemented in your App.

```js
const assetId = '123abc'
const transaction = {} // received from Purchase.payment()
Purchase.subscribe(assetId, transaction).then(() => {
  // call Purchase.confirm()
})
```

### confirm

The `confirm` method calls the Metrological Billing Server to confirm a purchase. It accepts a `transactionId` (which is available inside the transaction object that is returned by a successful `payment` request) as its argument.

Calling the method notifies the Metrological Billing Server that the CSP has received *and* stored the purchase on the CSP's backend.

The method returns a *Promise* which resolves in case of a successful confirmation. If the `transactionId` is not valid, the Promise is rejected.

```js
const transaction = {} // received from Purchase.payment()
Purchase.subscribe(transaction.transactionId).then(() => {
  // full purchase flow done
})
```

### unsubscribe

Since the CSP is responsible for renewing subscriptions in the context of the Metrological Billing Server, the CSP must be able to handle *cancellations of recurring purchases*.

The `unsubscribe` method returns a *Promise* with the result of the request made to the CSP to unsubscribe from a recurring purchase. It accepts the `id` of the purchased asset as its first argument.

The `unsubscribe` method is an *optional* convenience method provided by the Purchase plugin. Depending on the CSP's API integration, the functionality to cancel recurring purchases can be fully custom-implemented in your App.

```js
const assetId = '123abc'
Purchase.unsubscribe(assetId).then(() => {
  // unsubscribed
})
```
