# Purchase

The Purchase plugin helps you build In App Purchases into your App, in combination with the Metrological Billing.

## Usage

Whenever you want to integrate purchases in your App, you can import the Purchase plugin from the Lightning SDK.

```js
import { Purchase } from '@lightningjs/sdk'
```

## Available methods

### Buy

The `buy` method is a method that will execute all the necesarry steps to do a full purchase of an asset. In a typical, default setup buying an asset with the SDK and the Metrological Billing Server should be as easy as calling `Purchase.buy()`, and no other calls should be necessary.

Sequentially it

- _retrieves a signature_ for a gives asset
- fires a _payment request_ to the Metrological Billing server
- attempt to _register a successful purchase_ at the CSP backend
- _confirms_ back to the Metrological Billing that the purchase has been registered by the CSP backend

Using this method requires that the Purchase plugin is properly _configured_ via the `Purchase.setup()` method.

The `buy`-method accepts an assetId (as defined by the CSP) as it's first argument.

```js
const assetId = '123abc'
Purchase.buy(assetId).then(() => {
  // asset succesfully bought
}).catch(err => {
  // some error
})
```

In case the CSP back-end does _not_ completely follow the expected blueprint or can not be configured properly via `setup`, the steps in the `buy` method can also be implemented manually, via the other methods exposed by the Purchase plugin (`signature`, `payment`, `subscribe` and `confirm`).


### Setup

The `setup`-method is used to configure the Purchase plugin to match with a pecific CSP backend setup used for providing available assets and storing purchased asset records.

The `setup`-method should be called once, before any other method on the Purchase plugin is called.

The method accepts a config `object` as its only argument. This object can have 2 keys: `cspUrl` and `endPoints`.

`cspUrl` specifies the _base Url_ of the backend of the CSP.

`endPoints` can be used to customize those API endpoints that differ from the default specification (as outlined below). For each _endpoint_ that deviates from the default, specify the _uri_ (which will be appended to the `cspUrl`, unless specified as a fully qualified domain) and the REST _method_ to use.

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
    uri: '/assets/:id/subscribe',
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
})
```

### Assets

The `assets` method returns a Promise with the result of the request to the CSP to retrieve assets available for purchase. In most cases it would return an `Array` of objects with information about the assets (i.e. _title_, _description_ and _price_).

The `household` is automatically sent as a `query param` in the request, allowing to optionally return information on whether the asset has been _purchased_ by the current household.

The `assets` method is an _optional_ convenience method exposed by the Purchase plugin. Depending on the CSPs API integration, the functionality to retrieve assets can be implemented fully custom in an App.


```js
Purchase.assets().then(assets => {
  // do something with assets
})
```

### Asset

The `asset` method returns a Promise with the result of the request to the CSP to retrieve details for a specific asset.

The `household` is automatically sent as a `query param` in the request, allowing to return information on whether the asset has been _purchased_ by the current household.

The `asset` method is an _optional_ convenience method exposed by the Purchase plugin. Depending on the CSPs API integration, the functionality to retrieve assets can be implemented fully custom in an App.

```js
const assetId = '123abc'
Purchase.asset(assetId).then(assets => {
  // do something with assets
})
```

### Signature

In order to make a payment request to the Metrological Billing server, the CSP needs to provide a signed signature.

The `signature` method returns a Promise with the result of the request to the CSP to retrieve that signature. The `signature`-method accepts the `id` of the asset to purchase as it's argument. The `household` will be automatically be added  as a `query param` in the request.

The `asset` method is an _optional_ convenience method exposed by the Purchase plugin. Depending on the CSPs API integration, the functionality to generate a purchase signature can also be implemented fully custom in an App.

```js
const assetId = '123abc'
Purchase.signature(assetId).then(signature => {
  // call Purchase.payment() with signature
})
```

### Payment

The `payment`-method calls the Metrological Billing server to execute a purchase. It accepts a _valid signature_ (retrieved from the CSP) as it's argument.

The method returns a Promise, which in the case of a success, resolves a transaction object (wich can be stored on the CSP side), or rejects with an error code in case of a failure.

```js
const signature = {} // received from Payment.signature()
Purchase.payment(signature).then(() => {
  // call Payment.subscribe()
})
```
### Subscribe

After a successful transaction, the CSP should store the purchase on their system. Especially in the case of recurring subscriptions.

The `subscribe` method returns a Promise with the result of the request to the CSP to register the purchase. The `subscribe` method accepts the `id` of the purchased asset as it's first argument, and the `transaction` object as received from the Metrological Billing server (via `Purchase.payment()`) as a second argument.

The `subscribe` method is an _optional_ convenience method exposed by the Purchase plugin. Depending on the CSPs API integration, the functionality to register a purchase can be implemented fully custom in an App.

```js
const assetId = '123abc'
const transaction = {} // received from Purchase.payment()
Purchase.subscribe(assetId, transaction).then(() => {
  // call Purchase.confirm()
})
```
### Confirm

The `confirm`-method calls the Metrological Billing server to confirm a purchase. It accepts a `transactionId` (which is available inside the transaction object returned by a successful `payment`-request) as it's argument.

Calling the method signals to the Billing server that the CSP has received and stored the purchase on their end.

The method returns a Promise which resolves in case of a successful confirmation. In case the transactionId is not valid, the Promise will be rejected.

```js
const transaction = {} // received from Purchase.payment()
Purchase.subscribe(transaction.transactionId).then(() => {
  // full purchase flow done
})
```

### Unsubscribe

Since the CSP is responsible for renewing subscriptions in the context of the Metrological Billing server. The CSP should also be able to handle cancelations of recurring purchases.

The `unsubscribe` method returns a Promise with the result of the request to the CSP to unsubscribe from a recurring purchase. The `unsubscribe` method accepts the `id` of the purchased asset as it's first argument.

The `unsubscribe` method is an _optional_ convenience method exposed by the Purchase plugin. Depending on the CSPs API integration, the functionality to cancel recurring purchases can be implemented fully custom in an App.


```js
const assetId = '123abc'
Purchase.unsubscribe(assetId).then(() => {
  // unsubscribed
})
```
