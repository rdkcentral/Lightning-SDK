# Settings


An App that is created with the Lightning SDK, can be configured with various options. These options can be grouped into [App settings](#app-settings) and [Platform settings](#platform-settings).


During development, you can configure your own settings in **settings.json**  to simulate different environments. For example:


```
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

> If your App is deployed to the operator's App Store, the settings are configured in the Store dashboard and can vary per operator and platform.

## Usage


Most settings are automatically handled by the Lightning SDK. Sometimes, you may want to access settings in your App code *directly*. For that purpose, you can import the *Settings* plugin from the Lightning SDK:


```
import { Settings } from '@lightningjs/sdk'
```


The SDK automatically creates the App or Platform types from the Launch parameters.


Optionally, you can specify *user-defined* settings at runtime, which can be accessed anywhere in your App. You can use the `user` type for that purpose.

## Available Methods

### get()


Returns a settings value.


```
Settings.get(type, key, [fallback])
```

* `Type` can be either `app`, `platform` or `user`.
* `Key` can be any of the existing settings.
* You can specify an optional `fallback` value if the setting is not defined.

### set()


Sets a key for *a user-defined setting* where  `value` is of type `user`.


```
Settings.set(key, value)
```

### has()


Returns 'true' or 'false', depending on whether a setting is defined or not.


```
Settings.has(type, key)
```

### subscribe()


Adds a callback to the notification stack. The callback is notified when the value of a `user` key has changed. You can add multiple callbacks for the same key.


```
Settings.subscribe(key, callback)
```


The callback receives the setting's `value` as an argument.

### unsubscribe()


Removes one or more callback(s) from the notification stack for a specific `user` key.


```
Settings.unsubscribe(key, [callback])
```


When a reference to a previously subscribed callback is passed, the `unsubscribe` method removes *only* the referenced callback.


If the optional `callback` parameter is omitted, the method pops *all* callbacks from the notification stack for the given key.

### clearSubscribers()


Clears *all* subscribers that are listening for `user` key changes.


`Settings.clearSubscribers()
`


This method is automatically called when the App is closed, to prevent *memory leaks*.

## Available Configuration Options

### App Settings

| Key | Type | Default | Description |
|---|---|---|---|
| `stage` | Object | { w: 1920, h: 1080, clearColor: 0x00000000, Canvas2D: false } | Object with stage configuration options that are specified in [Runtime Configuration.](../../lightning-core-reference/RuntimeConfig/index.md#stage-configuration-options) |
| `debug` | Boolean | false | Indicates whether or not to run Lightning in debug mode. |


### Platform Settings

| Key | Type | Default | Description |
|---|---|---|---|
| `inspector` | Boolean | false | Indicates whether or not to initialize the Lightning Inspector (which renders out a HTML structure inside the DOM to mimic the canvas). |
| `path` | String | ./static | Path to the folder where the assets of the App are located. The path is used by  `Utils.asset()` to look up assets. |
| `log` | Boolean | false | Indicates whether or not to show logs  (that use the **Log** plugin) in the console. |
| `showVersion` | Boolean | false | Indicates whether or not to show the App's version as specified in **metadata.json**. |
| `showFps` | Boolean / Object | false | Indicates whether or not to show an FPS (Frames Per Second) counter in an overlay. |
| `textureMode` | Boolean | false | Indicates whether or not to render video as a texture on the active drawing canvas. Can also be set by adding a queryparam `?texture`. |
| `esEnv` | String | es6 | The target ECMAscript environment for the App. Supported values: 'es5', 'es6'. |
| `imageServerUrl` | Url | null | Endpoint to an image server for resizing and / or preprocessing images. |
| `proxyUrl` | Url | null | Endpoint to a proxy server for caching and / or proxying API calls. |
