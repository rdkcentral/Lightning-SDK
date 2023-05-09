# @lightningjs/emitter

This library provides one or more event emitters used to communicate between different parts of code anywhere in your project.

## Usage

### Basic
Below you see an example how to use the EventEmitter on `global` level;

```js
import EventEmitter from '@lightningjs/emitter'

//say hello everytime event is emitted
EventEmitter.on('say-hello', () => {
  console.log('hello')
})

//say hello once and remove listerner after its fired
EventEmitter.once('say-hello', () => {
  console.log('hello... once')
})

EventEmitter.emit('say-hello')
```

### Defining Emitters
Below you see an example how to define emitters, this can help to fire events under a specific namespace;

```js
import {defineEmitter} from '@lightningjs/eventemitter'

//creates a new Emitter with this id
const emitter = defineEmitter('MyEmitter');

emitter.on('say-hello', () => {
  console.log('hello')
});

emitter.emit('say-hello');
```

```js
import {getEmitter} from '@lightningjs/eventemitter'

//returns MyEmitter if it exists
const emitter = getEmitter('MyEmitter');
```

## EventEmitter Functions

### emit
```js
emit(eventName, arg1, arg2, arg3)
```
Emits an event with an eventName with up to 3 extra parameters.

### on
```js
on(eventName, callback)
```
Fires callback every time when an event with of eventName.

### once
```js
once(eventName, callback)
```
Fires callback once when an event with of eventName. After callback has been fired this listener will be removed.

### has
```js
has(eventName, callback)
```
Checks if theres a listener with the same callback & eventName in emitter.


### off
```js
off(eventName, callback)
```
Removes a listener with the same callback & eventName from emitter.

### clear
```js
clear(eventName)
```
Removes all listeners on a specific eventName from the emitter.

### clearAll
```js
clearAll()
```
Removes all listeners from the emitter.

## EventEmitter Management

### defineEmitter
```js
defineEmitter(name)
```
Creates a new emitter with name.

### removeEmitter
```js
removeEmitter(name)
```
Removes emitter with name from memory.

### getEmitter
```js
getEmitter(name)
```
Returns emitter with name.

### hasEmitter
```js
hasEmitter(name)
```
Returns if an emitter with name exists.
