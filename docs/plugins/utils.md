# Utils

The Lightning SDK exposes a number of useful helper functions, that can come in handy when building your App.

## Usage

Whenever you need such a utility function, import the Utils plugin from the Lightning SDK.

```js
import { Utils } from 'wpe-lightning-sdk'
```

## Available methods

### Asset

Generates a full url to local App assets (such as images), taking into account the `path` configured in Platform [settings](/plugins/settings). It's important _always_ use the asset helper (instead of relative paths for example), to ensure that your assets will load properly as well hosted on a CDN in production.

```js
Utils.asset('images/logo.png')
```

### ProxyUrl

Generates a proxy url. Useful when using remote API's that don't have CORS configured correctly.

```js
Utils.proxyUrl(url, options)
```

Note: during development you need to specify a `proxyUrl` as a platform Setting (in `settings.json`). In production the proxyUrl will be set for you.
