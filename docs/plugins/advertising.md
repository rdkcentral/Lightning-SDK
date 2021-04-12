# Advertising

The _Advertising_ plugin enables app integration with the platform's advertising framework.

## Usage

To use the Advertising module, simply import the plugin from the SDK:

```js
import { Advertising } from '@fireboltjs/sdk'
```

## Passing ad platform configuration to a custom player

For a custom solution the _Advertising_ plugin has a number of helpful methods available

### Config

Retrieves advertising configuration from the _Platform transport layer_ and returns a `Promise`, that resolves an `Object`.

```js
Advertising.config()
```

During _local development_ return an `Object` with dummy configuration.

```
{
  "siteSection": "96746720",
  "profile": '47883199'
}
```

### Policy

Retrieves information from the _Platform transport layer_ about the Advertising policy to follow. Returns a `Promise`, that resolves an `Object`.

```js
Advertising.policy()
```

During _local development_ return an `Object` with dummy configuration.

```
{
  "adSkipTier": "NOSKIP_NORMAL_SPEED",
  "adSkipGracePeriodSeconds": 60
}
```

### AdvertisingId

Retrieves the Advertising Id from the _Platform transport layer_. Returns a `Promise`, that resolves an `String` with the id.
When the method is passed `true` as an argument a new Advertisement Id will be generated.


```js
Advertising.advertisingId()
```

During _local development_ the advertisingId will be randomly generated.

### Device Attributes

Retrieves the Device attributes from the _Platform transport layer_. Returns a `Promise`, that resolves an `Object`.

```js
Advertising.deviceAttributes()
```

Returns `??` during local development.


### App Store Id

Retrieves the id of the App in the store from the _Platform transport layer_. Returns a `Promise`, that resolves an `String` with the app identifier.

```js
Advertising.appStoreId()
```

Return the _app identifier_ as specified in the `metadata.json` _during local development_.
