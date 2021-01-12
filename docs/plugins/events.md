# Events

Generic Events emitter / listener interface which can be used for _any_ type of event. For Lifecycle events please see [Lifeycle](/plugins/lifecycle.md)

## Usage

The SDK comes with a generic Eventing mechanism which can be, optionally, used within the application. To start:

```js
import { Events } from '@lightningjs/sdk'
```

## Available methods

### Listening for events

To listen for events you can set a `addEventListener` providing a `event` and a `callback` function to be called when the event happens

```js
Events.addEventListener('mycoolevent', myCoolFunction)
```

### Remove event listener

To remove an event listener will prevent it from being subsequently called if the event happens. To remove the event listener please provide the appropriate `event` and `callback`.

```js
Events.removeEventListener('mycoolevent', myCoolFunction)
```

### Emit events

If there is a need to emit an event you can do so with the `emit` function and using the `event` name that will be triggered with optionally provided `arguments`. When triggering an event all registered listeners will be called.

```js
Events.emit('mycoolevent')
```

You can optionally provide arguments to the event:

```js
Events.emit('mycoolevent', superCoolArgs)
```

The provided `arguments` will be passed on to each event listener.
