# Log

It's common practice to use `console.log` to quickly debug an App.

While this can be very useful during development and QA, it's not desirable to deploy an app in production with all sorts of logs still enabled.

Instead of using console.log (or debug, error, warn) it is recommended to use the Log plugin. It will only generate (prettier) logs, when the [Platform setting](/plugins/settings) `log` is set to `true`. This way it's possible to keep a (small) number of relevant logs inside your App code, without needing to remove them before pushing to production.

## Usage

In order to use the Log plugin, import if from the Lightning SDK.

```js
import { Log } from 'wpe-lightning-sdk'
```

## Available methods

### Info

Invokes a console.log when the Platform setting log is true.

```js
Log.info(label, argument1, argument2, argument3, ..., argumentx)
```

The info method accepts any number of arguments. If the first argument passed is a `String` it will be displayed as a custom label instead of the default label 'Info'.

### Debug

Invokes a console.debug when the Platform setting log is true.

```js
Log.debug(label, argument1, argument2, argument3, ..., argumentx)
```

The debug method accepts any number of arguments. If the first argument passed is a `String` it will be displayed as a custom label instead of the default label 'Debug'.

### Error

Invokes a console.error when the Platform setting log is true.

```js
Log.error(label, argument1, argument2, argument3, ..., argumentx)
```

The error_method accepts any number of arguments. If the first argument passed is a `String` it will be displayed as a custom label instead of the default label 'Error'.


### Warn

Invokes a console.warm when the Platform setting log is true.

```js
Log.warn(label, argument1, argument2, argument3, ..., argumentx)
```

The warn method accepts any number of arguments. If the first argument passed is a `String` it will be displayed as a custom label instead of the default label 'Warn'.
