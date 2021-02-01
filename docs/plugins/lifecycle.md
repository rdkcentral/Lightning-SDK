# Lifecycle

Via the Lifecycle plugin the current lifecycle state can be etrieved. The plugin also allows an App to change the state of the application (limited to 'close' and 'ready').

The SDK also informs the App whenever the App lifecycle state changes by emitting events. You can listen to these events by using
the `Events` plugin.

## Usage

Whenever you need to change or consult the current Lifecycle state, import the `Lifecycle` plugin from the SDK.

```js
import { Lifecycle } from '@lightningjs/sdk'
```

## Available states

The following states are available:

| State         | Description                                 |
| ------------- |:-------------------------------------------:|
| init          | Application is initialising                 |
| ready         | Application is ready for user interaction   |
| active        | Application is running, and in focus        |
| background    | Application is running, not in focus        |
| pause         | Application is pausing, not in focus        |
| close         | Application is closing and will be unloaded |

## State handling

As an application developer it is important to understand the impact of different states and handle state transitions accordingly. Information to consider:

* In _background_ state the application is not in focus, something may be obstructing the screen however application can continue to process data and use media playback.
* In _pause_ state the application runtime *may* be stopped, however the Application should stop media playback, clear the screen and reduce runtime intervals/timers where possible.
* The _close_ state is a intermediate state and means the application will be unloaded soon, you should stop all timers/intervals and remove references to data for garbage collection. Any graphics should be cleaned up.
* The _init_ state is a intermediate state and means the application is starting.

## Available methods

### Retrieve the current state

If the Application needs to know the current state, you can call the `state` function at any given time.

```js
Lifecycle.state() // returns init, active etc.
```

### Change current state to ready

The Lifecycle state can be set to ready

```js
Lifecycle.ready()
```

### Change current state to close

If the app wants to close the `close` function can be called. This will call the appropriate SDK functions to start its cleanup routine.

```js
Lifecycle.close()
```
### Listening for events

In order to listen for Lifecycle events, import the `Events` plugin from the SDK

```js
import { Lifecycle } from '@lightningjs/sdk'
```

The _Lifecycle_ plugin will emit any change in state via the `Events` plugin under the _Lifecycle_ plugin namespace.
You'll be able to execute a callback upon any event. For more info please refer to the [Events](#plugins/events) plugin.

Some examples:

```js
Events.listen('Lifecycle', 'background', () => {
  // the app is going into the background
})
```

```js
Events.listen('Lifecycle', 'close', () => {
  // the app is about to close, send events and do cleanup
})
```

```js
Events.listen('Lifecycle', (val, plugin, event) => {
  // listen to all 'Lifecycle' events
})
```
