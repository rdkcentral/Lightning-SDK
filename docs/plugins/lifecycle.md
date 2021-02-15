# Lifecycle

Via the Lifecycle plugin the current lifecycle state can be etrieved. The plugin also allows an App to change the state of the application (limited to `close` and `ready`).

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
| ready         | Application is ready to be displayed        |
| active        | Application is running, and in focus        |
| background    | Application is running, not in focus        |
| pausing       | Application is _pausing_, not in focus      |
| paused        | Application is paused                       |
| closing       | Application is closing                      |
| closed        | Application is closed and will be unloaded  |

## State handling

As an application developer it is important to understand the impact of different states and handle state transitions accordingly. Information to consider:

* In _background_ state the application is not in focus, something may be obstructing the screen however application can continue to process data and use media playback.
* In _pausing_ state the application runtime *may* be stopped, however the Application should stop media playback, clear the screen and reduce runtime intervals/timers where possible.
* The _closing_ state is a intermediate state and means the application will be unloaded soon, you should stop all timers/intervals and remove references to data for garbage collection. Any graphics should be cleaned up.
* The _init_ state is a intermediate state and means the application is starting.

## Available methods

### Retrieve the current state

If the Application needs to know the current state, you can call the `state` function at any given time.

```js
Lifecycle.state() // returns init, active etc.
```

### Ready state

Upon launch the App will enter the `init` state. As soon as the App is minimally loaded and ready to be displayed / used.
The App should notify the platform that it's _ready_ by calling `Lifecycle.ready()`.

Once in a ready state, the platform can put the App in an `active` state, meaning the App is fully up and running, and in focus.

```js
Lifecycle.ready()
```

### Closing state

If the App wants to close, the `Lifecycle.close()` method can be called. This put the App in a `closing` state and will trigger the appropriate SDK and platform functions to start the cleanup routine.

```js
Lifecycle.close()
```

The App can also be put in a `closing` state by the platform itself. This will emit the `closing` event under the `Lifecycle` namespace.

In the callback of this closing listener, the App can execute some logic, such as saving state, sending out analytics calls etc.
When completed, the App should call the `Lifecycle.closed()` method, indicating that the App can be fully terminated.

Note that the platform can decide to terminate the App _before_ the `closed()`-method is called, in case the App's closing logic is taking too long.

### Pausing state

The App can be put in a `pausing` state by the platform. This will emit the `pausing` event under the `Lifecycle` namespace.

In the callback of this pausing listener, the App can execute some logic, such as saving state, sending out analytics calls etc.
When completed, the App should call the `Lifecycle.paused()` method, indicating that the App is ready to be put in a _paused_ state

Note that the platform can decide to completely pause the App _before_ the `paused()`-method is called, in case the App's pausing logic is taking too long.

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
Events.listen('Lifecycle', 'closing', () => {
  // the app is about to close, send events and do cleanup
  // when ready to be terminated, notify back to the platform
  Lifecycle.closed()
})
```

```js
Events.listen('Lifecycle', (val, plugin, event) => {
  // listen to all 'Lifecycle' events
})
```
