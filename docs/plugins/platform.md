# Platform

Sometimes your App might need to interact with the Platform it's running on. For example to retrieve information about the current profile, localization, the capabilities of the device or global accessibility settings.

Getting access to this information requires to connect to lower level APIs made available by the platform. Since implementations differ between operators and platforms, the Lightning-SDK offers a Platform plugin, that exposes a generic, agnostic interface to the developer.

Under the hood, an underlaying transport layer will then take care of calling the right APIs for the actual platform implementation that your App is running on.

The Platform plugin is most often used to _retrieve_ information from the Platform. In some cases it can also be used to _pass_ information back to the Platform. This might differ per platform.

The Platform plugin is divided into 4 different sections: Localization, Profile, Device, Accessibility.

## Usage

Whenever you need to interact with the Platform, import the Platform plugin from the Lightning SDK

```js
import { Platform } from '@lightningjs/sdk'
```

All methods on the Platform plugin can act as a getter and a setter (when permitted by the platform).
Whenever a method is called without params it will _return_ data (in the form of a `Promise`).
When parameters are passed to the method, it will _send_ those on to the lower level platform APIs
(attempting to update a value). When the platform does not allow a certain property to be set,
it will `reject` the promise.

## Available methods

### Localization

#### City

Gets the city. `New York` by default during _local development_.

```js
Platform.Localization.city()
```


#### ZipCode

Gets the zipCode. Returns `27505` by default during _local development_.

```js
Platform.Localization.zipCode()
```

#### CountryCode

Gets the countryCode. Returns `US` by default during _local development_.

```js
Platform.Localization.countryCode()
```

#### LatLon

Gets the LatLon. During _local development_ will try to return your actual latitude and longitude from a remote API service. If unsuccessful, will default to `[40.7128, 74.006]`.
If during _local development_ you want to force to use the browser's built in _geolocation_ for retrieving the latitude and longitude, add the key `forceBrowserGeolocation` with the value `true` as a _platform setting_ in `settings.json`.

```js
Platform.Localization.latLon()
```

#### Locale

Get the locale. During _local development_ will attempt to return the browser's locale, with a fallback to to `en-US`.

```js
Platform.Localization.locale()
```

#### Language

Gets the language. During _local development_ will attempt to return the browser's language, with a default to `en`.

```js
Platform.Localization.language()
```

### Profile

#### ageRating

Gets the ageRating for the current Profile. Returns `adult` by default during _local development_.

```js
Platform.Profile.ageRating()
```

### Device

#### Ip

Gets the ip. Returns `127.0.0.1` by default during _local development_.

```js
Platform.Device.ip()
```

#### Household

Gets the houseHold-id. Returns `b2244e9d4c04826ccd5a7b2c2a50e7d4` by default during _local development_.

```js
Platform.Device.household()
```

#### Mac

Get the Mac. Returns `00:00:00:00:00:00` by default during _local development_.

```js
Platform.Device.mac()
```

#### Operator

Gets the operator. Returns `Metrological` by default during _local development_.

```js
Platform.Device.operator()
```

#### Platform

Gets the platform name. Returns `Metrological` by default during _local development_.

```js
Platform.Device.platform()
```

#### Packages

Gets the packages. Returns `[]` by default during _local development_.

```js
Platform.Device.packages()
```

#### Uid

Gets the uid. Returns `ee6723b8-7ab3-462c-8d93-dbf61227998e` by default during _local development_.

```js
Platform.Device.uid()
```

#### Type

Gets the type of device (STB or TV) running the App. Returns `STB` by default during _local development_.

```js
Platform.Device.type()
```

#### Model

Gets the model of the device running the App. Returns `Metrological` by default during _local development_.

```js
Platform.Device.type()
```

#### Hdcp

Gets the supported HDCP profiles. Returns `{enabled: true, negotiatedVersion: 'HDCP2.2', maxVersion: 'HDCP2.3` }` by default during _local development_.

```js
Platform.Device.hdcp()
```

#### Hdr

Gets the supported HDR profiles.

```js
Platform.Device.hdr()
```

Returns:
```json
{
  "hdr10": true,
  "hdr10plus": false,
  "dolbyVision": true,
  "hlg": true
}
```
by default during _local development_.

#### Audio

Gets the supported audio profiles.

```js
Platform.Device.audio()
```

Returns:
```json
{
  "stereo": true,
  "dolbyDigital": true,
  "dolbyDigitalPlus": true,
  "dolbyAtmos": true
}
```
by default during _local development_.


#### Resolution

Gets the screen resolution as an Array width the `width` and the `height`.
Returns `[1920, 1080]` by default during _local development_.

```js
Platform.Device.resolution()
```

#### Name

Gets the friendly name of the STB. Returns `Living Room` by default during _local development_.

```js
Platform.Device.name()
```

#### Network

Gets the network information as an `Object`. Returns `{state: 'Connected', type: 'WIFI'}` by default during _local development_.

```js
Platform.Device.network()
```

### Accessibility

#### Closed Captions

Gets the closed captions configuration as an `Object`. Returns the following object by default during _local development_.

```js
`{
  enabled: true,
  styles: {
    fontFamily: 'Monospace sans-serif',
    fontSize: 1,
    fontColor: '#ffffff',
    fontEdge: 'none',
    fontEdgeColor: '#7F7F7F',
    fontOpacity: 100,
    backgroundColor: '#000000',
    backgroundOpacity: 100,
    textAlign: 'center',
    textAlignVertical: 'middle',
  }
}`
```

```js
Platform.Accessibility.closedCaptions()
```

#### Voice Guidance

Gets the voice guidance configuration as an `Object`. Returns `{enabled: true, speed: 5}` by default during _local development_.

```js
Platform.Accessibility.voiceGuidance()
```

### Profile

#### Advertising

##### Config

Gets configuration settings for integrating with the platform's advertising eco-system. Returns `{advertisingId: '26ccd5a7b2c2a50e7d4b2244e9d4c048', siteSection: '123', profile: '123'}` by default during _local development_.

##### policy

Gets ad playback policies for this device, e.g. skippability. Returns `{adSkipTier: 'NOSKIP_NORMAL_SPEED', adSkipGracePeriodSeconds: 60}` by default during _local developement_.

##### privacy

Gets ad privacy settings for this device, e.g. user tracking opt outs. Returns `{limitTracking: false}` by default during _local development_

##### ClearAdvertisingId

Resets the anonymous advertising Id on this device.

#### Personalization

##### Entitlements

Gets or sets the users entitlements for this app to enable platform home screen awareness. Takes/returns an Array of entitlements, by default, during _local develompent_:

```json
[
  {
    "entitlementId": "http://entitlements/some/canonical/id",
    "startTime": "2021-01-01T18:25:43.511Z",
    "endTime": "2021-12-31T12:59:59.911Z"
  },
  {
    "entitlementId": "http://entitlements/some/canonical/id2",
    "startTime": "2021-04-23T18:25:43.511Z",
    "endTime": "2022-04-23T18:25:43.511Z"
  }
]
```

##### Watched
Adds a content the user's watch history to enable platform home screen awareness. Takes an array of watched items:

```json
[
  {
    "contentId": "http://content/some/canonical/id",
    "watchedOn": "2022-04-23T18:25:43.511Z"
  }
]
```

Returns a boolean, indicating success/failure to persist items.

##### LaunchPadTile
Adds a potential tile the user's launch pad enabling closer platform home screen integration. Takes a `name` (string), `imageUrl` (string) , and `linkUrl` (string) of the tile, and returns a boolean indicating success/failure to persist item.

### Authentication

Gets authentication details for this device.

```js
Platform.authentication()
```

Returns

```js
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```
by default during _local development_

### Get

First class citizen properties have their own namespaced methods. But all platform values can also be retrieved via a
generic `Platform.get()` methdod. This method accepts a `string` consisting of the _namespace_ and the _key_ of the
value to be retrieved, using so called _dot-notation_.


```js
Platform.get('Device.name')
```

The generic getter may also come in handy when you want to retrieve _multiple_ platform values. Instead of calling each method separately,
you can pass an _Array_ with `strings` of _namespace_ and _key_ (using _dot-notation_), which will return an object with the retrieved
values all at once.

```js
Platform.get(['Device.name', 'Device.resolution'])
// { 'Device.name': 'Living Room', 'Device.resolution': [1920, 1080] }
```

The generic `get`-method can also be used for retrieving _non-standard_, platform specific properties.
### Set

When params are passed to any of the standard platform methods, instead of retrieving a value, an attempt wil be made to
_update_ or _set_ the value. Whether specific properties can be _set_ depends on the platform the App is running on. Whenever
the set function is not permitted the `Promise` will be rejected.

Additionally the Platform plugin has a generic `set`-method, that can be used to update _any_  platform property. Either standard
first citizen properties, or platform specific, custom properties.

The method accepts the _namespaced key_ (using _dot-notation_) as a first argument and the _value_ to update to as a second argument.

```js
Platform.set('Device.name', 'Bedroom')

Platform.set('Accessibility.voiceGuidance', {
  enabled: true,
  speed: 5,
})

```

### Has

In order to find out if a certain property _exists at all_ on the Platform that the App is running on, the `has`-method can be used.

This method accepts the _namespaced key_ (using _dot-notation_) as its single argument. It returns a `Promise` that resolves with `true`
if the property exists and `false` if the property is not available.

```js
Platform.has('Device.name') // resolves true
Platform.has('Device.bla') // resolves false
```

Note that the resolved value only indicates if the property is "known" and can be "consulted" on the platform. It doesn't
give any information about the actual value, and for example whether a certain _capability_ is enabled.
For that the property has to be retrieved explicitely.

## Overwriting default values

During development you might want to test your App with different platform values (i.e. a different language, age rating or device IP).
When you want to overwrite the default values, you can do so by editing the `settings.json` file.
Add a `platform` key in `platformSettings` and only add the values you wish to change here.

```json
{
  "platformSettings": {
      "platform": {
          "localization": {
            "city": "New York",
            "zipCode": "27505",
            "countryCode": "US",
            "language": "en",
            "latlon": [40.7128, 74.006],
            "locale": "en-US"
          },
          "profile": {
            "ageRating": "adult"
          },
          "device": {
            "ip": "127.0.0.1",
            "household": "b2244e9d4c04826ccd5a7b2c2a50e7d4",
            "mac": "00:00:00:00:00:00",
            "operator": "Metrological",
            "platform": "Metrological",
            "packages": [],
            "uid": "ee6723b8-7ab3-462c-8d93-dbf61227998e",
            "stbType": "Metrological",
            "hdcp": "HDR10",
            "resolution": [1920, 1080],
            "name": "Living Room",
            "network": {
              "state": "Connected",
              "type": "WIFI"
            }
          },
          "accessibility": {
            "closedCaptions": {"enabled": false},
            "voiceGuidance": {"enabled": true, "speed": 5}
          }
      }
   }
}
 ```
