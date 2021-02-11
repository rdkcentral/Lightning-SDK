# Advertising

The _Advertising_ plugin helps to enable (video) advertisements in an App.

The plugin can be used as a drop-in solution that takes care of the entire Ad playback flow (in combination with the VideoPlayer plugin),
as well as the integration with different advertisment distributors depending on the specific platform deployment.

However if your App requires a custom Advertisement setup with it's own Ad playback logic and integration with an Ad provider, the Advertising
plugin can be used to retrieve important configuration and settings related to advertisements.


## Usage

Whenever you want to enable ads in your App, import the Advertising plugin from the Lightning SDK

```js
import { Advertising } from '@lightningjs/sdk'
```

## Drop-in Advertising solution

The drop-in usecase allows you to setup advertisements for your App with minimal code and configuration.

### Setup

In order to enable ads, both the _VideoPlayer_ and _Advertising_ plugin need to be imported. Next the _Advertising_ plugin
needs to be _injected_ as a _dependency_ into the _VideoPlayer_ plugin using the `VideoPlayer.ads()` method.

```js
import { Lightning, VideoPlayer, Advertising } from '@lightningjs/sdk'

export default class PlayerPage extends Lightning.Component {
  _init() {
    // Inject the Advertising plugin into the VideoPlayer
    VideoPlayer.ads(Advertising)
  }

  _handleEnter() {
    VideoPlayer.open('http://...')
  }
}
```

With the Advertising plugin in place, the VideoPlayer plugin will take care of retrieving and playing Advertisements
for video assets that are opened via the `VideoPlayer.open()`-method.

### Events

When Advertisements are enabled, the VideoPlayer plugin will emit several Ad-related events to its consumer (as specified in [`VideoPlayer.consumer()`](/plugins/videoplayer?id=consumer)).

The _consuming_ component can hook into these events by specifying methods on the Class in the following format: `$ad{Eventname}`, where
_Eventname_ refers to the event to respond to.

There is a `$adEvent(eventName)` method that can be used as a _catch-all_, which receives the _eventName_ as it's first argument.

The available events are:

- $adPlay
- $adFirstQuartile
- $adMidPoint
- $AdThirdQuartile
- $AdEnded
- $AdStalled
- $adError

Additionally the _VideoPlayer_ will also emit 2 extra `$videoPlayer` events, to indicate when an Ad break starts and ends:

- $videoPlayerAdStart
- $videoPlayerAdEnd


### Customize Ad retrieval

In some cases you might want to leverage the built in Ad playback logic, but you might require some customizations to the way that ads are retrieved from the ad distributor.

For this usecase you can overwrite the `getAds` method in the Advertising plugin and supply it with your own. The `getAds` function should return a `Promise`
that resolves an object with advertisements.

```js
Advertising.getAds = function() {
  return Promise.resolve({
    preroll: {
      ads: [
        {
          url: 'http://...'
        }
      ]
    },
  })
}
```

## Custom solution

For a custom solution the _Advertising_ plugin has a number of helpful methods available

### Config

Retrieves advertising configuration from the _Platform transport layer_ and returns a `Promise`, that resolves an `Object`.

```js
Advertising.config()
```

During _local development_ return an `Object` with dummy configuration.

```
{
  "advertisingId": "oxPUKaCAtlyfy5ieomFw",
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
Advertising.advertisingId(true) // regenerate the id
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
