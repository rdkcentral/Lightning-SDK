# Registry

The Registry plugin can be used to globally register and unregister _event listeners_, _timeouts_ and _intervals_.

The plugin primarily serves as a proxy for the standard HTML5 Web APIs for setting and clearing listeners, intervals and timeouts
(i.e. `window.setTimeout()` and `element.addEventListener()`).

The added benefit of using the _Registry_ plugin is that any running timers, intervals and event listeners will be
automatically cleaned up when closing the App.

It is recommended to _always_ use the Registry plugin instead of the HTML5 Web APIs, since not properly cleaning up these
listeners and intervals, is a common cause for memory leaks.

## Usage

Whenever you need to register a _timeout_, _interval_ or _event listener_, import the Registry plugin from the Lightning SDK

```js
import { Registry } from '@lightningjs/sdk'
```

## Available methods

### setTimeout

Call a function after a specified number of milliseconds.

```js
Registry.setTimeout(() => {
  console.log('Hello!!')
}, 2000)
```

Following the signature of `window.setTimeout()`, you can specify extra parameters that will be passed into the callback function.

```js
Registry.setTimeout((param1, param2) => {
  console.log(param1)
  console.log(param2)
}, 20000, 'Hello', 'Goodbye')
```

The `setTimeout` method returns the `id` of the timeout, that can be used to cancel the timer with `Registry.clearTimeout()`.


### clearTimeout

Cancel a running timeout and prevent it from being executed.

```js
// long running timeout (30 minutes)
const timeoutId = Registry.setTimeout(() => {}, 30 * 60 * 1000)

Registry.clearTimeout(timeoutId)
```

### clearTimeouts

Cancel _all_ running timeouts and prevent them from being executed.

```js
Registry.clearTimeouts()
```


### setInterval

Call a function at a specified interval in milliseconds.

```js
Registry.setInterval(() => {
  console.log('Hello!!')
}, 1000)
```

Following the signature of `window.setInterval()`, you can specify extra parameters that will be passed into the callback function.

The `setInterval` method returns the `id` of the interval, that can be used to cancel the interval with `Registry.clearInterval()`.


### clearInterval

Cancel a running interval and prevent it from being executed.

```js
const intervalId = Registry.setInterval(() => {}, 1500)

Registry.clearInterval(intervalId)
```

### clearIntervals

Cancel _all_ running intervals and prevent them from being executed.

```js
Registry.clearIntervals()
```

### addEventListener

Attach an event handler to the specified target.

```js
const target = document.body
const event = 'click'
const handler = () => {
  console.log('Clicked!)
}
Registry.addEventListener(target, event, handler)
```

### removeEventListener

Remove a previously attached event handler from a specific target.

```js
const target = document.body
const event = 'click'
const handler = () => {}
Registry.addEventListener(target, event, cb)

Registery.removeEventListener(target, event, cb)
```

Note that it is required to pass a reference to the original _handler_ function.

### removeEventListeners

Remove _multiple_ registered event listeners at once.

The `removeEventListeners` method accepts 2 optional arguments (`target` and `event`):

- When no arguments are passed, _all_ previously registered listeners will be removed
- When passed only a `target` argument, all event listeners for the specified _target_ will be unregistered
- When passed a `target` and an `event` argument, all listeners for that specific _event_ on that _target_ will be removed

```js
// Remove all event listeners
Registry.removeEventListeners()

// Remove all event listeners on document.body
Registry.removeEventListeners(document.body)

// Remove all click event listeners on document.body
Registry.removeEventListeners(document.body, 'click')
```

### Clear

Cleans up all registered timeouts, intervals and event listeners.

Effectively a combination of `Registry.clearIntervals()`  `Registry.clearTimeouts()` and `Registry.removeEventListeners()` into one.

```js
Registry.clear()
```

Note that `Registry.clear()` is called _automatically_ for you by the SDK when closing the App, in order to enable a full App clean up
and prevent potential memory leaks.
