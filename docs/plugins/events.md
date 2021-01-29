# Events

_work in progres_

Events plugin is used to listen to events emitted from:

- various SDK plugins (i.e. VideoPlayer plugin, Router plugin)
- the transport layer (for realtime changes in the Platform or Lifecycle)
- custom App events broadcasted from the App code

## Usage

In order to use the Events plugin, import it from the Lightning SDK.

```js
import { Events } from '@lightningjs/sdk'
```

## Available methods

### Listen

Listen to events and execute a callback when they occur.

Examples:

1) Listen to a specific event on a specific Plugin

```js
Events.listen('Lifecycle', 'pause', () => {
  console.log('The App is going in a pause state')
})

Events.listen('Platform', 'device.hdcp', val => {
  console.log('The hdcp value changed on the platform!', val)
})
```

2) Listen to all events of a specific Plugin

```js
Events.listen('Lifecycle', (val, plugin, event) => {
  if(event === 'init') {
    // execute init functionality
  }
  if(event === 'close') {
    // execute close functionality
  }
})
```

3) Listen to all events

```js
Events.listen((val, plugin, event) => {
  if(plugin === 'Router' && event === 'pageLoad') {
    // a new page was loaded
  }
  if(plugin === 'VideoPlayer' && event === 'play') {
    // video player started playing
  }
})
```

Note that it's possible to register multiple listeners for the same event

```js
Events.listen('Platform', 'device.hdcp', val => {
  console.log('Listen once!', val)
})

Events.listen('Platform', 'device.hdcp', val => {
  console.log('Listen twice!', val)
})
```

### Clear

Registered events can be cleared

1) By id

```js
const listenerId = Events.listen('Platform', 'device.dhcp', () => {})

Events.clear(listenerId)
```

2) By Plugin

```js
Events.listen('Platform', 'device.dhcp', () => {})
Events.listen('Platform', 'localization.language', () => {})
Events.listen('Lifecycle', 'init', () => {})

Events.clear('Platform') // removes all listeners to the Platform plugin
```

3) By Plugin and Event

```js
Events.listen('Platform', 'device.dhcp', () => {})
Events.listen('Platform', 'localization.language', () => {})
Events.listen('Lifecycle', 'init', () => {})

Events.clear('Platform', 'device.dhcp') // removes only the listeners to Platform.device.dhcp
```

4) All

```js
Events.listen('Platform', 'device.dhcp', () => {})
Events.listen('Platform', 'localization.language', () => {})
Events.listen('Lifecycle', 'init', () => {})

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

