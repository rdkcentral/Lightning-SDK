# Settings

An App created with the SDK can be configured with various options. These can either be _App_ or _Platform_ specific settings.

During development you can configure your own settings in `index.html` to simulate different environments.

But be aware that when your App is deployed to the App Store the settings are configured in the Store dashboard and can vary per operator and platform.

## Usage

Most settings are automatically handled by the SDK. But sometimes you may want to access settings in your App code directly. In those cases you can import the _Settings plugin_ from the Lightning SDK.

```js
import { Settings } from 'wpe-lightning-sdk'
```

## Available methods

### Get

Returns a settings value.

```js
Settings.get(type, key)
```

Type can be either `app` or `platform`. Key can be any of the existing settings.

### Has

Returns `true` or `false`, depending on wether a settings is defined or not.

```js
Settings.has(type, key)
```

Type can be either `app` or `platform`. Key can be any of the existing settings.


## Available configuration options

### Platform

Todo

### App

Todo
