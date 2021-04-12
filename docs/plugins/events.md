# Events

_work in progres_

Events plugin is used to listen to events emitted from:

- various SDK plugins (i.e. VideoPlayer plugin, Router plugin)
- the transport layer (for realtime changes in the Platform or Lifecycle)
- custom App events broadcasted from the App code

## Usage

In order to use the Events plugin, import it from the Firebolt SDK.

```js
import { Events } from '@fireboltjs/sdk'
```

## Available methods

### Listen

Listen to events and execute a callback when they occur.

Examples:

1) Listen to a specific event on a specific Plugin.

```js
Events.listen('Lifecycle', 'pausing', () => {
  console.log('The App is going in a pausing state')
})

Events.listen('Platform', 'device.hdcp', value => {
  console.log('Device HDCP version changed to ' + value)
})
```

When listening for a specific event (on a specific Plugin), the callback function is passed a `value` as its first and only argument.

2) Listen to all events of a specific Plugin

```js
Events.listen('Lifecycle', (event, value) => {
  if(event === 'init') {
    // execute init functionality
  }
  if(event === 'closing') {
    // execute close functionality
  }
})
```

When listening for all events on a specific Plugin, the callback function is passed, the `event` as its first argument and a `value` as its second argument.

3) Listen to all events

```js
Events.listen((plugin, event, value) => {
  if(plugin === 'Router' && event === 'pageLoad') {
    // a new page was loaded
  }
  if(plugin === 'VideoPlayer' && event === 'play') {
    // video player started playing
  }
})
```

When listening for all events of all Plugins, the callback function is passed, the `plugin` as its first argument, followed by the `event` and finally a `value` argument.


Note that it's possible to register multiple listeners for the same event

```js
Events.listen('Platform', 'device.hdcp', () => {
  console.log('Listen once!')
})

Events.listen('Platform', 'device.hdcp', () => {
  console.log('Listen twice!')
})
```

### Clear

Registered events can be cleared

1) By id

```js
const listenerId = Events.listen('Platform', 'device.hdcp', (value) => {
  console.log('Device HDCP version changed to + ' value)
})

Events.clear(listenerId)
```

2) By Plugin

```js
Events.listen('Platform', 'device.hdcp', (value) => {
  console.log('Device HDCP version changed to + ' value)
})
Events.listen('Platform', 'localization.language', (language) => {
  console.log('Device language changed to', language)
})
Events.listen('Lifecycle', 'init', () => {
  console.log('App is initializing')
})

Events.clear('Platform') // removes all listeners to the Platform plugin
```

3) By Plugin and Event

```js
Events.listen('Platform', 'device.hdcp', (value) => {
  console.log('Device HDCP version changed to + ' value)
})
Events.listen('Platform', 'localization.language', () => {
  console.log('Device language changed to', language)
})
Events.listen('Lifecycle', 'init', () => {
  console.log('App is initializing')
})

Events.clear('Platform', 'device.hdcp') // removes only the listener to Platform.device.hdcp
```

4) All

```js
Events.listen('Platform', 'device.hdcp', (value) => {
  console.log('Device HDCP version changed to + ' value)
})
Events.listen('Platform', 'localization.language', () => {
  console.log('Device language changed to', language)
})
Events.listen('Lifecycle', 'init', () => {
  console.log('App is initializing')
})

Events.clear() // removes all listeners
```

### Broadcast

As an App developer you can broadcast your own custom events to other parts of your App. These events
will automatically be placed under the 'App' namespace.


```js
// Listen to custom events ('App' namespace)
Events.listen('App', 'user', (user) => {
  console.log('Hello ' + user.name)
})

// No need to specify the 'App' namespace in the broadcast
Events.broadcast('user', {
  id: 1,
  username: 'jsmith',
  name: 'John Smith'
})
```

