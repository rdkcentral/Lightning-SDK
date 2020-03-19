# Media Player

A common feature of TV apps is to play videos. But since not all apps require a video player, the Media Player plugin is not added to an App by default. Instead you can import the Media Player module only when your Apps needs it.

The Media Player plugin is intended as a drop-in plugin, but behaviour can be added or modified, by extending the MediaPlayer class.

Opionally you can also implement a fully custom Media Player. Just be aware that media [metrics](/plugins/metrics) (i.e. media canplay, media start, media pauze, etc.) will not be sent automatically anymore if you don't use the stock Media Player. So you will have to implement them yourself.

## Usage

For Apps that require a Media Player, import the MediaPlayer plugin from the Lightning SDK inside a component used for displaying Media (i.e. Player). Then add the Media Plyer in the component's template. This will generate a new instance of the MediaPlayer upon render.

```js
import { Lightning, MediaPlayer } from 'wpe-lightning-sdk'

export default class Player extends Lightning.Component {

  static _template() {
    return {
      Controls: {
        x: 99,
        y: 890,
        type: PlayerControls, // some custom class for Player Controls
      },
      Progress: {
        x: 99,
        y: 970,
        type: PlayerProgress, // some custom class for Player Progress bar
      },
      MediaPlayer: {
        type: MediaPlayer,
      },
    }
  }
}

```

## Available methods

You can interact with the Media Player instance, by using the Lightning selector `this.tag('MediaPlayer')` (assuming you used the reference MediaPlayer).

### Update Settings

After the MediaPlayer class is initialized, we need to define that the current component is the `consumer` of the MediaPlayer. This can be set with `updateSettings`

```js
this.tag('MediaPlayer').updateSettings({consumer: this})
```

### Open

Opens and plays a video in de MediaPlayer

```js
this.tag('MediaPlayer').open(videoUrl)
```

### Close

Closes the MediaPlayer and reset the video source.

```js
this.tag('MediaPlayer').close()
```

### Play Pause

Toggles the video to play / pause

```js
this.tag('MediaPlayer').playPause()
```

### Reload

Reloads the video

```js
this.tag('MediaPlayer').reload()
```

### Seek

Scrubs the video forward or backward with an increment in seconds

```js
this.tag('MediaPlayer').seek(seconds)
```

You can use negative values to scrub backwards.


## Events

The MediaPlayer plugin emits the following events:

- Timeupdate
- Error
- Ended
- Loadeddata
- Canplay
- Play
- Playing
- Pause
- Loadstart
- Seeking
- Seeked
- Encrypted

You can listen to these events in the component that implements the MediaPlayer plugin by adding `$mediaplayer{Event}`-methods (i.e. `$mediaplayerPause()`).
