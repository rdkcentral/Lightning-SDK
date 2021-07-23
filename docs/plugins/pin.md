# Pin

The *Pin* plugin adds an abstraction layer to the STB's Pin functionality.

You can use the interface to check the middleware layer for the current state of the STB: *locked* or *unlocked*. You can also use it to submit a Pin code from your App to unlock the device.

Depending on the  state of the STB, you can use the Pin plugin to lock certain content or screens in your App.

## Usage

If you want to use the Pin plugin, import it from the Lightning SDK:

```js
import { Pin } from '@lightningjs/sdk'
```

## Available Methods

### show

Shows a standard, built-in **Pin** dialog where the user can supply a Pin code.

```js
Pin.show()
```

### hide

Hides the visible **Pin** dialog.

```js
Pin.hide()
```

### submit

Sends a Pin code to the middleware layer for verification. If the code is correct, the STB will be unlocked.

The `submit` method accepts `pin` and `context` as an arguments. Context should be either `parental` or `purchase`.

``Note:`` `context` defaults to `purchase`, but recommended that developer should explicitly specify the context

The `submit` method is automatically invoked when you are using the built-in **Pin** dialog. Use this method for sending the Pin code *only* if you are making a fully custom **Pin** dialog in your App.

```js
Pin.submit('0000', context)
  .then(() => console.log('Unlocked!'))
  .catch(e => console.log('Pin error', e))
```

The `submit` method returns a *Promise*. If the supplied Pin code and context is correct, the Promise resolves with `true` and the STB will be unlocked. If the Pin code or context is wrong, the Promise resolves with `false`.

If the middleware is unable to unlock the STB, the Promise is *rejected* (with an optional error message).

During development, the default Pin code is  `0000`. Optionally, you can overwrite the default Pin code during development by editing the **settings.json** file and adding the key `pin` as a Platform Setting with a different valid Pin code.

### unlocked

Checks if the STB is currently *unlocked*.

```js
Pin.unlocked(context)
  .then(
    unlocked => unlocked === true ?
      console.log('STB is unlocked') :
      console.log('STB is locked'))
```

The `unlocked` method returns a *Promise* which resolves with `true` if the device is *unlocked*, or with `false` if the device is *locked*.

If the middleware is unable to retrieve the current state, the Promise is *rejected*.

### locked

Checks if the STB is currently *locked*.

```js
Pin.locked(context)
  .then(
    locked => locked === true ?
      console.log('STB is locked') :
      console.log('STB is unlocked'))
```

The `locked` method is the *exact* counterpart of the `unlocked` method. It returns a *Promise* which resolves to `true` if
the device is *locked* or to `false` if the device is *unlocked*.

If the middleware is unable to retrieve the current state, the Promise is *rejected*.
