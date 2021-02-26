# Storage

Occasionally, you may want to persist data inside your App. By default, the browser's localStorage is used for that purpose. However, if localStorage is not supported by the platform, it automatically falls back to *Cookies*.

Please note that the Cookie size is limited to 4096 Bytes.

The *Storage* plugin is a convenient way to store data in a platform-independent way.

If an `appId` is configured in the [Settings](settings.md) plugin, the keys for storing data will be *namespaced* to prevent naming collisions with others Apps (which might cause unexpected bugs). (During *local* development, the **settings.json** file is used to pass the data to the Settings plugin, but when the App is in *production*, the **settings.json** file is ignored and the platform takes care of passing the data.)

## Usage

If you need to persist data inside your App, import the Storage plugin from the Lightning SDK:

```js
import { Storage } from '@lightningjs/sdk'
```

## Available methods

### set

Saves a key-value combination in storage.

```js
Storage.set(key, value)
```

The `key` can be of type String (which is usually the case), Object, Boolean or Array.

When saved, the `value` is automatically converted to a JSON object, so you do not have to call `JSON.stringify()` on objects.

### get

Retrieves previously stored data from storage.

```js
Storage.get(key)
```

If you stored an Object, the data is automatically converted back to an Object, soyou do not have to call  `JSON.parse()`.

### remove

Removes a specific key from storage.

```js
Storage.remove(key)
```

### clear

Removes *all* data from localStorage.

```js
Storage.clear()
```

If an `appId` is configured, only keys that match the *namespaced* keys are removed from storage. This ensures that you do not clear any data that is stored for other Apps on the same domain.
