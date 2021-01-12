# Lifecycle

The SDK provides Application lifecycle events to control the running state. As an application you can listen for state changes and handle them accordingly.

## Usage

The SDK supports different lifecycle states to be used on the device. The lifecycle plugin makes the states available to the application through events.

```js
import { Lifecycle } from '@lightningjs/sdk'
```

## Available states

The following states are available:

| State         | Description                                 |
| ------------- |:-------------------------------------------:|
| init          | Application is initialising                 |
| active        | Application is running, and in focus        |
| background    | Application is running, not in focus        |
| pause         | Application is paused, not in focus         |
| close         | Application is closing and will be unloaded |

## State handling

As an application developer it is important to understand the impact of different states and handle state transitions accordingly. Information to consider:

* In _background_ state the application is not in focus, something may be obstructing the screen however application can continue to process data and use media playback.
* In _pause_ state the application runtime *may* be stopped, however the Application should stop media playback, clear the screen and reduce runtime intervals/timers where possible.
* The _close_ state is a intermediate state and means the application will be unloaded soon, you should stop all timers/intervals and remove references to data for garbage collection. Any graphics should be cleaned up.
* The _init_ state is a intermediate state and means the application is starting.

## Available methods

### Listening for events

To listen for events you can set a `addEventListener` providing a `state` event and a `callback` function to be called when the state changes

```js
Lifecycle.addEventListener('background', myStateHandler)
```

### Remove event listener

To remove an event listener will prevent it from being subsequently called if the state changes. To remove the event listener please provide the appropriate `state` event and `callback`.

```js
Lifecycle.removeEventListener('background', myCoolFunction)
```

### Current state

If the Application likes to know the current state, you can call the `state` function at any given time.

```js
Lifecycle.state()
```

### Close

If the app wants to close the `close` function can be called. This will call the appropriate SDK functions to start its cleanup routine.

```js
Lifecycle.close()
```
