# Metadata

If you create an App, you store the App's *metadata* (such as its name, version and icon) in the file **metadata.json**.

The Metadata plugin enables you to use this metadata in your App. (For example, if you want to show the App's version number in an *About* window.)

> If you deploy your App to the Metrological Store, the metadata is 'injected' into the App by the Metrological Store.

## Usage

If you want to access metadata in your App code directly, import the *Metadata* plugin from the Lightning SDK:

```js
import { Metadata } from '@lightningjs/sdk'
```

The SDK automatically creates the `appMetadata`  from the Launch params.

## Available methods

### Get

Returns the key value of the metadata.

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

Returns the *safe ID* of your App. This is actually the `AppId` without dots (and any other special characters) which are are not permitted in JS variables.

```js
Metadata.safeAppId()
```

### AppName

Returns the name of your App.

```js
Metadata.appName()
```

### AppVersion

Returns the version of your App (without the GIT commit hash).

```js
Metadata.appVersion()
```

### AppIcon

Returns the icon of your App.

```js
Metadata.appIcon()
```

### AppFullVersion

Returns the full version of your App.

```js
Metadata.appFullVersion()
```
