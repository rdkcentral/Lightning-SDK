# Settings

An App created with the SDK can be configured with various options. These can either be _App_ or _Platform_ specific settings.

During development you can configure your own settings in `settings.json` to simulate different environments:

```json
{
    "appSettings": {
        "stage": {
            "clearColor": "0x00000000",
            "useImageWorker": true
        },
        "debug": true
    },
    "platformSettings": {
        "path": "./static",
        "log": true,
        "showVersion": true
    }
}
```

Be aware that when your App is deployed to the App Store the settings are configured in the Store dashboard and can vary per operator and platform.

## Usage

Most settings are automatically handled by the SDK.But sometimes you may want to access settings in your App code directly. In those cases you can import the _Settings plugin_ from the Lightning SDK.

The SDK automatically creates the `app` or `platform` types from the Launch params.

Optionally you might want to specify _user defined_ settings at runtime, that can be accessed anywhere in your App. For these cases the `user` type is used.

```js
import { Settings } from '@lightningjs/sdk'
```

## Available methods

### Get

Returns a settings value.

```js
Settings.get(type, key, [fallback])
```

Type can be either `app`, `platform` or `user`. Key can be any of the existing settings.
Optionally you can specify a `fallback`-value for when the setting is not defined.

### Set

Sets a key, value on `user` type for _user defined settings_

```js
Settings.set(key, value)
```

### Has

Returns `true` or `false`, depending on whether a setting is defined or not.

```js
Settings.has(type, key)
```

### Subscribe

Adds a callback to be notified when the value of a `user` key is changed. Multiple callbacks can be added for the same key.

```js
Settings.subscribe(key, callback)
```

The callback receives the setting's `value` as an argument.

### Unsubscribe

Removes callback(s) from the notification stack for a specific `user` key.

```js
Settings.unsubscribe(key, [callback])
```

When a reference to a previously subscribed callback is passed it will remove only that callback.
If the optional callback param is omitted it will pop all callbacks for the given key.

### clearSubscribers

Clears _all_ subscribers listening for `user` key changes. This method is automatically called when the App is closed for to prevent _memory leaks_.

```js
Settings.clearSubscribers()
```

## Available configuration options

### Platform

| Key | Type | Description | Default value |
| --- | ---- | ------------ | ------------- |
| inspector | Boolean | Whether or not initialize the Lightning Inspector (whch will render out a HTML structure inside the DOM to mimic the canvas) | false |
| path | String | Path to the folder with the assets of the app. Utils.asset() will use this folder to lookup assets | ./static |
| log | Boolean | Whether or not to show logs in the console (those that use the Log plugin) | false |
| showVersion | Boolean | Whether or not to show the App's version in any. Uses the version specified in `metadata.json` | false |
| showFps | Boolean / Object | Whether or not to show an FPS (frames per second) counter in an overlay | false |
| textureMode | Boolean | Whether or not to render video as a texture on the active drawing canvas. Can also be set by adding a queryparam `?texture`. | false |
| esEnv | String | The target ECMAscript environment for the App. Supported values: es6 and es5. | es6 |
| imageServerUrl | Url | Endpoint to an image server for resizing and / or preprocessing images | null |
| proxyUrl | Url | Endpoint to an proxy server for caching and / or proxying API calls | null |

### App

| Key | Type | Description | Default value |
| --- | ---- | ------------ | ------------- |
| stage | Object | Object with any of the stage configuration options specified in [Lightning Documentation](https://rdkcentral.github.io/Lightning/docs/gettingStarted/stage-configuration) | { w: 1920, h: 1080, clearColor: 0x00000000, canvas2d: false } |
| debug | Boolean | Whether or not to run Lightning in debug mode | false |
