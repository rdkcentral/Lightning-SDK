# Profile

Sometimes your App might require profile information about the current user. This information generally comes from the platform or operator.

Since each operator / platform may have a different implementation, the Lightning SDK offers a Profile plugin with generic interface to the developer.

The Profile plugin also offers the ability to update profile information.

## Usage

Whenever you need to Profile information, import the Profile plugin from the Lightning SDK

```js
import { Profile } from 'wpe-lightning-sdk'
```

## Available methods

When you call a method without params it will _return_ the Profile information. If you pass params, it will _update_ the Profile information.

### ageRating

Gets the ageRating.

```js
Profile.ageRating()
```

### City

Gets the city.

```js
Profile.city()
```

### CountryCode

Gets the countryCode.

```js
Profile.countryCode()
```

### Ip

Gets the ip.

```js
Profile.ip()
```

### HouseHold

Gets the houseHold

```js
Profile.houseHold()
```

### Language

Gets the language.

```js
Profile.language()
```

### LatLon

Gets the LatLon.

```js
Profile.latLon()
```

### Locale

Get the locale.

```js
Profile.locale()
```

### Mac

Get the Mac.

```js
Profile.mac()
```

### Operator

Gets the operator.

```js
Profile.operator()
```

### Platform

Gets the platform.

```js
Profile.platform()
```

### Packages

Gets the packages.

```js
Profile.packages()
```

### Uid

Gets the uid.

```js
Profile.uid()
```

### StbType

Gets the stbType.

```js
Profile.stbType()
```
