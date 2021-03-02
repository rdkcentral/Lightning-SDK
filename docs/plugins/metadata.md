# Metadata

An App created with the SDK has a Metadata in it.

Be aware that when your App is deployed to the App Store the Metadata is configured in the Store dashboard.

## Usage

Sometimes you may want to access Metadata in your App code directly. In those cases you can import the _Metadata plugin_ from the Lightning SDK.

The SDK automatically creates the `appMetadata`  from the Launch params.

```js
import { Metadata } from '@lightningjs/sdk'
```

## Available methods

### Get

Returns a Metadata value.

```js
Metadata.get(key, [fallback])
```
Key can be either `icon`, `id`, `safeId`, `version`, `name`, `description`, `type`, `url` or `artwork` .
Optionally you can specify a `fallback`-value for when the Metadata is not defined.

### AppId

Gets Application id from Metadata

```js
Metadata.appId()
```

### SafeAppId

Gets safeAppId from the Metadata.

```js
Metadata.safeAppId()
```

### AppName

Gets Application name from the Metadata

```js
Metadata.appName()
```

### AppVersion

Gets Application Version from the Metadata (without commit hash)

```js
Metadata.appVersion()
```

### AppIcon

Gets Application icon from the Metadata

```js
Metadata.appIcon()
```

### AppFullVersion

Gets Application full version from the Metadata.

```js
Metadata.appFullVersion()
```
