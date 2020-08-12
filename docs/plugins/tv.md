# TV

The TV plugin serves as an abstraction layer to the _live TV_ functionality of a STB. The interface gives you access to the current channel
and program information, and allows you to change the TV channel from inside an App.

With the TV plugin you can adapt your App _contextually_ to what the user is currently watching on TV.

## Usage

In order to use the TV plugin, import it from the Lightning SDK.

```js
import { TV } from 'wpe-lightning-sdk'
```

## Available methods

### Channel

Retrieves information about the TV channel that is _currently_ being watched.

```js
TV.channel().then(channel => console.log(channel))
```

The `channel`-method returns a _promise_ which returns the channel information as an object.

During _development_ the `channel`-method returns a random mocked channel. Optionally you can [overwrite](#overwriting-default-values) the default values.

```js
{
  number: 1,
  name: 'Metro News 1',
  description: 'New York Cable News Channel',
  entitled: true,
}
```

### Program

Retrieves the information about the TV program that is currently being watched.

```js
TV.program().then(program => console.log(program))
```

The `program`-method returns a _promise_ which returns program information as an object.

During _development_ the `program`-method returns a mocked program, linked to a random mocked channel. Optionally you can [overwrite](#overwriting-default-values) the default values.

```js
{
  title: 'The Tonight Show Starring Jimmy Fallon',
  description: 'Late-night talk show hosted by Jimmy Fallon on NBC',
  startTime: 'Wed, 12 Aug 2020 23:00:00 GMT', // UTC date string
  duration: 3600, // in seconds
  ageRating: 10,
}
```

### Entitled

Retrieves if the user is entitled to watch the current TV channel.

```js
TV.entitled().then(entitled => console.log(entitled))
```

The `entitled`-method returns a _promise_ which returns `true` when the user is entitled and `false` when not.

During _development_ the `entitled`-method returns the entitlement value of the random mocked channel. Optionally you can [overwrite](#overwriting-default-values) the default values.

### ChangeChannel

Changes the current channel on the TV.

```js
TV.changeChannel(number).then(newChannel => console.log(newChannel))
```

The `changeChannel`-method returns a promise which returns the new channel (when the channel change was succesful).

During _development_ you can pass either `1`, `2`, or `3` as a channel `number`, to select one of the default mocked channels.

### AddEventListener

The `addEventListener`-method allows you to listen for TV events, and execute a callback when they happen.

```js
const event = 'channelChange'
const callback = (channel) => { console.log(channel) }

TV.addEventListener(event, callback)
```

Currently only 1 event is supported (`channelChange`). It will pass an object with the new `channel` information as an argument to the callback function.
It's possible to register multiple callbacks for the same event.

### RemoveEventListener

The `removeEventListener`-method allows you to remove previously registerd callbacks for TV events (via the `addEventListener`-method).

```js
const event = 'channelChange'
const callback = (channel) => { console.log(channel) }

TV.removeEventListener(event, callback)
```

When the `callback` argument is ommitted, all previously registered callbacks for that event will be removed.


## Overwriting default values

During development you might want to test your App with different TV channels and / or programs.
When you want to overwrite the default values, you can do so by editing the `settings.json` file.
Add a `tv` key in `platformSettings` and supply it with an `Array` of channels in the following format:

```json
{
  "platformSettings": {
    "tv": [
      {
        "number": 1,
        "name": "Metro News 1",
        "description": "New York Cable News Channel",
        "entitled": true,
        "program": {
          "title": "The Morning Show",
          "description": "New York's best morning show",
          "startTime":  "Wed, 12 Aug 2020 23:00:00 GMT",
          "duration": 180,
          "ageRating": 0
        }
      },
      ...
    ]
   }
}
 ```
