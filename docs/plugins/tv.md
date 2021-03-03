# TV

The *TV* plugin serves as an abstraction layer to the *live TV* functionality of an STB. The interface gives access to the current channel
and program information, and allows you to change the TV channel from *inside* an App (if your App is *whitelisted* for that purpose).

You can use the TV plugin to adapt your App contextually to what the user is currently watching on TV.

## Usage

If you want to use the TV plugin, import it from the Lightning SDK:

```js
import { TV } from '@lightningjs/sdk'
```

## Available methods

### channel

Either *[retrieves](#retrieve-current-channel)* information about the TV channel that is currently being watched, or *[changes](#change-current-channel)* the current TV channel.

#### Retrieve Current Channel

```js
TV.channel().then(channel => console.log(channel))
```

The `channel` method returns a *Promise* that returns the channel information as an object.

During *development*, the `channel` method returns a *random mocked channel*. Optionally, you can [overwrite](#overwriting-default-values) the default values by editing the **settings.json** file. For example:

```json
{
  number: 1,
  name: 'Metro News 1',
  description: 'New York Cable News Channel',
  entitled: true,
}
```

#### Change Current Channel

```js
const channelNumber = 2
TV.channel(channelNumber).then(channel => console.log(channel))
```

If a `channelNumber` is passed as an argument, the `channel` method attempts to change the TV channel.
It returns a *Promise* that returns the channel information as an object.

During *development*, you can pass either 1, 2 or 3 as the `channelNumber`, so that one of the default mocked channels can be selected.

> In a *production* setting, most Apps are *not* able to change the currently live TV channel. The functionality is only
made available to certain *whitelisted* Apps.

### program

Retrieves information about the TV program that is currently being watched.

```js
TV.program().then(program => console.log(program))
```

The `program` method returns a *Promise* that returns the program information as an object.

During *development*, the `program` method returns a mocked program that is linked to a random mocked channel. Optionally, you can [overwrite](#overwriting-default-values) the default values by editing the **settings.json** file. For example:

```json
{
  title: 'The Tonight Show Starring Jimmy Fallon',
  description: 'Late-night talk show hosted by Jimmy Fallon on NBC',
  startTime: 'Wed, 12 Aug 2020 23:00:00 GMT', // UTC date string
  duration: 3600, // in seconds
  ageRating: 10,
}
```

### entitled

Indicates whether the user is entitled to watch the current TV channel or not.

```js
TV.entitled().then(entitled => console.log(entitled))
```

The `entitled` method returns a *Promise* that returns `true` if the user is entitled and `false` if not.

During *development*, the `entitled` method returns the entitlement value of the random mocked channel. Optionally, you can [overwrite](#overwriting-default-values) the default values by editing the **settings.json** file.

### addEventListener

Allows you to listen for TV events and executes a callback if these events occur.

```js
const event = 'channelChange'
const callback = (channel) => { console.log(channel) }

TV.addEventListener(event, callback)
```

Currently, *only one* event is supported: `channelChange`. This passes an object with the new `channel` information as an argument to the callback function.

You can register *multiple* callbacks for the same event.

### removeEventListener

Allows you to remove previously registered callbacks  (via the `addEventListener` method) for TV events.

```js
const event = 'channelChange'
const callback = (channel) => { console.log(channel) }

TV.removeEventListener(event, callback)
```

If the `callback` argument is omitted, *all* previously registered callbacks for that event are removed.

## Overwriting Default Values

During development, you might want to test your App with different TV channels and / or programs.
You can *overwrite* the default values by editing the **settings.json** file.
Just add a `tv` key in `platformSettings` and supply it with an `Array` of channels in the following format:

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
