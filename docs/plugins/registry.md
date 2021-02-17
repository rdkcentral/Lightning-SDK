# Registry

You use the *Registry* plugin to globally register and unregister *event listeners*, *timeouts* and *intervals*.

The plugin primarily serves as a proxy for the standard HTML5 Web APIs for setting and clearing listeners, intervals and timeouts
(for example, `window.setTimeout()` and `element.addEventListener()`).

An additional benefit of the *Registry* plugin is that any running timers, intervals and event listeners are
automatically cleaned up when your App is closed.

> It is recommended to *always* use the Registry plugin (instead of the HTML5 Web APIs) because memory leaks are often caused by listeners and intervals that are not properly cleaned up.

## Usage

If you need to register a timeout, interval or event listener, import the Registry plugin from the Lightning SDK:

```
import { Registry } from '@lightningjs/sdk'
```

## Available Methods

### setTimeout()

Calls a function after a specified number of milliseconds.

```
Registry.setTimeout(() => {
  console.log('Hello!!')
}, 2000)
```

Following the signature of `window.setTimeout()`, you can specify additional  parameters to be passed to the callback function. For example:

```
Registry.setTimeout((param1, param2) => {
  console.log(param1)
  console.log(param2)
}, 20000, 'Hello', 'Goodbye')
```

The `setTimeout` method returns the `id` of the timeout, which can be used to cancel the timer with `Registry.clearTimeout()`.

### clearTimeout()

Cancels a running timeout and prevents it from being executed.

```
// long running timeout (30 minutes)
const timeoutId = Registry.setTimeout(() => {}, 30 * 60 * 1000)

Registry.clearTimeout(timeoutId)
```

### clearTimeouts()

Cancels *all* running timeouts and prevents them from being executed.

```
Registry.clearTimeouts()
```

### setInterval()

Calls a function at a specified interval in milliseconds.

```
Registry.setInterval(() => {
  console.log('Hello!!')
}, 1000)
```

Following the signature of `window.setInterval()`, you can specify additional parameters to be passed to the callback function.

The `setInterval` method returns the `id` of the interval, which can be used to cancel the interval with `Registry.clearInterval()`.

### clearInterval()

Cancels a running interval and prevents it from being executed.

```
const intervalId = Registry.setInterval(() => {}, 1500)

Registry.clearInterval(intervalId)
```

### clearIntervals()

Cancesl *all* running intervals and prevents them from being executed.

```
Registry.clearIntervals()
```

### addEventListener()

Attaches an event handler to the specified target.

```
const target = document.body
const event = 'click'
const handler = () => {
  console.log('Clicked!)
}
Registry.addEventListener(target, event, handler)
```

### removeEventListener()

Removes a previously attached event handler from a specific target.

```
const target = document.body
const event = 'click'
const handler = () => {}
Registry.addEventListener(target, event, cb)

Registery.removeEventListener(target, event, cb)
```

> It is required to pass a reference to the original *handler* function.

### removeEventListeners()

Removes *multiple* registered event listeners all at once.

The `removeEventListeners` method accepts two optional arguments, `target` and `event`. It handles the arguments as follows:

* If *no* arguments are passed, *all* previously registered listeners are removed.

* If *only* a `target` argument is passed, all event listeners for the specified *target* are unregistered.

* If a `target`*and* an `event` argument are passed, all listeners for that specific *event* on that *target* are removed.

Summarizing:

```
// Remove all event listeners
Registry.removeEventListeners()

// Remove all event listeners on document.body
Registry.removeEventListeners(document.body)

// Remove all click event listeners on document.body
Registry.removeEventListeners(document.body, 'click')
```

### clear()

Cleans up all registered timeouts, intervals and event listeners.

```
Registry.clear()
```

The `Registry.clear()` method is a combination of the `Registry.clearIntervals()`, `Registry.clearTimeouts()` and `Registry.removeEventListeners()` methods.

> This method is called *automatically* by the SDK when the App is closed. This is done to enable a full App clean-up
and to prevent potential memory leaks.
