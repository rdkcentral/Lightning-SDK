# Lifecycle

Via the Lifecycle plugin the current lifecycle state can be retrieved. The plugin also allows an App to change inform the platform of state-related situations, such as being ready to present to the user, or requesting the app be closed.

The SDK also informs the App whenever the App lifecycle state changes by emitting events. You can listen to these events by using the `Events` plugin.

## Usage

Whenever you need to change or consult the current Lifecycle state, import the `Lifecycle` plugin from the SDK.

```js
import { Lifecycle } from '@fireboltjs/sdk'
```

## Available states

The following states are available:

| State         | Description                                 |
| ------------- |:-------------------------------------------:|
| initializing  | App is initializing                                                                                     |
| foreground    | App is the focal presentation to the user. Primary state when the user is using the app.                |
| background    | App is running, but is not the primary focus on the screen (may be invisible, obscured, or scaled down) |
| inactive      | App is running, but not visible, cannot receive input, and cannot play media                            |
| suspended     | App is "on ice" to save resources, and may be "revived" at a future point with all state intact         |
| unloading     | App is about to be unloaded and removed from memory, including any state                                |

## State handling

As an application developer it is important to understand the impact of different states and handle state transitions accordingly. Information to consider:

* In _background_ state the application is not in focus, something may be obstructing the screen however application can continue to process data and use media playback.
* In _inactive_ state the application runtime *may* be stopped, however the Application should stop media playback, clear the screen and reduce runtime intervals/timers where possible.
* The _closing_ state is a intermediate state and means the application will be unloaded soon, you should stop all timers/intervals and remove references to data for garbage collection. Any graphics should be cleaned up.
* The _initializing_ state is a intermediate state and means the application is starting up.

## Available methods

### Retrieve the current state

If the Application needs to know the current state, you can call the `state` function at any given time.

```js
Lifecycle.state() // returns init, active etc.
```

### Ready method

Upon launch the App will enter the `initializing` state. As soon as the App is minimally loaded and ready to be displayed / used.
The App should notify the platform that it's _ready_ by calling `Lifecycle.ready()`.

Once in a ready state, the platform can put the App in the `foreground` state, meaning the App is fully up and running, and in focus.
Alternately, the platform may put the App in the `inactive` state, for example if the platform is pre-loading a frequently used app.

```js
Lifecycle.ready()
```

### Closing method
Called if the app wants to be closed. A `reason` is required, and may be one of:

- `USER_EXIT`
- `REMOTE_BUTTON`
- `ERROR`

By providing one of these reasons, the platform can more effectively decide when to simply leave the app in the `inactive` state vs unloading it.

For example, if the app's user selects an explicit "Exit" option from the app's UX, the platform may be more likely to unload the app.

On the other hand, if the user hits the "Back" button on the remote from the app's home screen, the platform may be more likely to keep the app running, incase this was a mistaken remote push.

```js
Lifecycle.close()
```

Note that the App can also be put in the `unloading` state by the platform itself. This will emit the `unloading` event under the `Lifecycle` namespace.

### Listening for events

In order to listen for Lifecycle events, import the `Events` plugin from the SDK

```js
import { Lifecycle } from '@fireboltjs/sdk'
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
Events.listen('Lifecycle', 'unloading', () => {
  // the app is about to unload, send events and do cleanup
  // when ready to be terminated, notify back to the platform
  Lifecycle.finished()
})
```

```js
Events.listen('Lifecycle', (val, plugin, event) => {
  // listen to all 'Lifecycle' events
})
```
