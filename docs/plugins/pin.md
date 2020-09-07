# Pin

The Pin plugin serves as an abstraction layer to the Pin functionality of a STB. The interface allows you to
check with the middleware layer whether the STB is currently _locked_ or _unlocked_. It also allows you to submit
a Pincode from your App in order to unlock the device.

With the Pin plugin you can lock certain content or screens in your App depending on the _locked_ state of the STB.

## Usage

In order to use the Pin plugin, import it from the Lightning SDK.

```js
import { Pin } from 'wpe-lightning-sdk'
```

## Available methods

### Show

Shows a standard, built-in Pin dialog where the user can supply a Pincode.

```js
Pin.show()
```

### Hide

Hides the visible Pin dialog.

```js
Pin.hide()
```

### Submit

Sends a Pincode to the middleware layer, where it will be verified. In case of a correct code the STB will be unlocked. The `submit`-method will be
automatically invoked when using the builtin Pin dialog. Only if you want to make a fully custom Pin dialog in your App, you should
use this method to send the Pincode.

```js
Pin.submit('0000').then(() => console.log('Unlocked!')).catch(e => console.log('Pin error', e))
```

The `submit`-method returns a _promise_ which _resolves_ `true` when the supplied Pincode is correct and the STB is successfully unlocked.
When the Pincode is wrong, the _promise_ will resolve `false`. In case the middleware is unable to unlock the STB, the promise will be
_rejected_ (with an optional error message).

During development the default Pincode will be `0000`. Optionally you can overwrite the default Pincode during development by editing the
`settings.json` file and adding the key `pin` as a `platformSetting` with a different valid Pincode.

### Unlocked

Checks if the STB is currently _unlocked_.

```js
Pin.unlocked()
  .then(unlocked => unlocked === true ? console.log('STB is unlocked') : console.log('STB is unlocked'))
```

The `unlocked`-method returns a _promise_ which _resolves_ `true` when the device is _unlocked_ and `false` when the device is _locked_.
The promise is _rejected_ when the middleware is unable to retrieve the current state.

### Locked

Checks if the STB is currently _locked_.

```js
Pin.locked()
  .then(locked => locked === true ? console.log('STB is locked') : console.log('STB is locked'))
```

The `locked`-method is the exact counter part of the `unlocked`-method. It returns a _promise_ which _resolves_ `true` when
the device is _locked_ and `false` when the device is _unlocked_.
The promise is _rejected_ when the middleware is unable to retrieve the current state.
