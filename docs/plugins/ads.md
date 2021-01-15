# Ads
TBD

## Usage

Whenever you need to interact with Ads, import the Ads plugin from the Lightning SDK

```js
import { Ads } from '@lightningjs/sdk'
```

## Available methods

### Advertising Id
Gets the anonymized Identifier for Advertising.

```js
Ads.advertisingId()
```

### Reset Advertising Id
Resets the anonymized Identifier for Advertising.

```js
Ads.resetAdvertisingId()
```

### Policy
Gets ad playback policies for this device, e.g. skippability.

```js
Ads.policy()
```

Returns
```js
{
  adSkipTier: 'NOSKIP_NORMAL_SPEED',
  adSkipGracePeriodSeconds: 60
}
```

by default during _local developement_.

### Get Ads
Calls the platforms underlying ad server and starts playing ads.

```js
Ads.get(params)
```

Parameters are dependent on the ad server being used on the platform.

### Cancel Ads
TBD

### Stop Ads
TBD