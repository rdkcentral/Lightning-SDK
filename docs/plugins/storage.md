# Storage

Often you will want to persist data inside your App. The Storage plugin is a convenient way to store data in a platform independent way.

By default the browser's _LocalStorage_ will be used, but will automatically fall back to _Cookies_ when LocalStorage is not supported by the platform. Please note that Cookie size is limited (4096 Bytes).

When an `appId` is configured in [Settings](/plugins/settings), the keys for storing data will be _namespaced_ to prevent naming collissions with others apps (which might cause unexpected bugs).



## Usage

Whenever you need to persist data inside your App, you can import the Storage plugin from the Lightning SDK

```js
import { Storage } from 'wpe-lightning-sdk'
```

## Available methods

### Set

Saves a key-value combination in storage.

```js
Storage.set(key, value)
```

The key is expected to be a `String`. The value can be a `String`, `Object`, `Boolean` or `Array`. The value is automatically converted to a JSON object when saving, so there's not need to call `JSON.stringify()` on objects yourself.

### Get

Retrieves previously stored data from storage.

```js
Storage.get(key)
```

In case you stored an `Object`, the data is automatically converted back to an object, so there is no need to call `JSON.parse()` yourself.

### Remove

Removes a specific key from storage

```js
Storage.remove(key)
```

### Clear

Removes all data from LocalStorage

```js
Storage.clear()
```

In case an `appId` is configured, only keys matching the namespaced will be removed from Storage. This way you can be sure you don't clear data stored for other Apps on the same domain.
