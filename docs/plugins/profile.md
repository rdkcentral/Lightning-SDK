# Profile

Sometimes your App might require profile information about the current user. This information generally comes from the platform or operator.

Since each operator / platform may have a different implementation, the Lightning SDK offers a Profile plugin with a generic interface to the developer.

The Profile plugin also offers the ability to update profile information.

## Usage

Whenever you need Profile information, import the Profile plugin from the Lightning SDK

```js
import { Profile } from 'wpe-lightning-sdk'
```

## Available methods

When you call a method without params it will _return_ the Profile information in the form of a promise.
If you pass params, it will _update_ the Profile information.

### ageRating

Gets the ageRating. Returns `adult` by default during _local development_.

```js
Profile.ageRating()
```

### City

Gets the city. `New York` by default during _local development_.

```js
Profile.city()
```

### CountryCode

Gets the countryCode. Returns `US` by default during _local development_.

```js
Profile.countryCode()
```

### Ip

Gets the ip. Returns `127.0.0.1` by default during _local development_.

```js
Profile.ip()
```

### HouseHold

Gets the houseHold-id. Returns `b2244e9d4c04826ccd5a7b2c2a50e7d4` by default during _local development_.

```js
Profile.houseHold()
```

### Language

Gets the language. Returns `en` by default during _local development_.

```js
Profile.language()
```

### LatLon

Gets the LatLon. Returns `[40.7128, 74.006]` by default during _local development_.

```js
Profile.latLon()
```

### Locale

Get the locale. Returns `en-US` by default during _local development_.

```js
Profile.locale()
```

### Mac

Get the Mac. Returns `00:00:00:00:00:00` by default during _local development_.

```js
Profile.mac()
```

### Operator

Gets the operator. Returns `Metrological` by default during _local development_.

```js
Profile.operator()
```

### Platform

Gets the platform. Returns `Metrological` by default during _local development_.

```js
Profile.platform()
```

### Packages

Gets the packages. Returns `[]` by default during _local development_.

```js
Profile.packages()
```

### Uid

Gets the uid. Returns `ee6723b8-7ab3-462c-8d93-dbf61227998e` by default during _local development_.

```js
Profile.uid()
```

### StbType

Gets the stbType. Returns `Metrological` by default during _local development_.

```js
Profile.stbType()
```

## Overwriting default values

During development you might want to test your App with different profile values (i.e. a different language or age rating).
When you want to overwrite the default values, you can do so by editing the `settings.json` file.
Add a `profile` key in `platformSettings` and only add the values you wish to change here.

```json
{
  "platformSettings": {
      "profile": {
         "ageRating": "adult",
         "city": "New York",
         "countryCode": "US",
         "ip": "127.0.0.1",
         "household": "b2244e9d4c04826ccd5a7b2c2a50e7d4",
         "language": "en",
         "latlon": [40.7128, 74.006],
         "locale": "en-US",
         "mac": "00:00:00:00:00:00",
         "operator": "Metrological",
         "platform": "Metrological",
         "packages": [],
         "uid": "ee6723b8-7ab3-462c-8d93-dbf61227998e",
         "stbType": "Metrological"
      }
   }
}
 ```
