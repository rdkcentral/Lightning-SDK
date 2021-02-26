# Utils

The Lightning SDK provides a number of useful *helper* functions  (or *utilities*) that you can use when building your App.

## Usage

If you want to use one or more of these helper functions, import the Utils plugin from the Lightning SDK:

```js
import { Utils } from '@lighntingjs/sdk'
```

## Available Methods

### asset

Generates a full URL to local App assets (such as images), based on the `path` that is configured in [Platform Settings](settings.md#platform-settings).

```js
Utils.asset('images/logo.png')
```

> It's important that you *always* use the asset helper instead of relative paths (for example). This ensures that your assets will load properly during local development and that the assets, once in production, are hosted on a CDN (Content Delivery Network).

### proxyUrl

Generates a proxy URL. This is useful if you are using remote APIs that do not have CORS (Cross-Origin Resource Sharing) configured correctly.

```js
Utils.proxyUrl(url, options)
```

> During *development* you must specify a `proxyUrl` as a [Platform Setting](settings.md#platform-settings) in **settings.json**.
During *production*, the proxyUrl is automatically set.
