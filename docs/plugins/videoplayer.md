# VideoPlayer plugin

A common feature of TV apps is to play videos. The VideoPlayer plugin offers a convenient interface
to interact with the video player of the STB. You can use it to open and play / pause videos.
But it also offers APIs to control the size of the video player, for example.

The VideoPlayer plugin has a built-in integration with the Metrics plugin. It automatically sends statistics for
various media events (for example: canplay, play, pause, seeking, seeked).

Although it's possible to implement a fully custom video playback solution, the use of the VideoPlayer plugin from
the SDK is highly recommended.

## Usage

In the Lightning components that require video playback capabilities (i.e., a Player component), you can import the
VideoPlayer plugin from the Lightning SDK.

```js
import { VideoPlayer } from '@lightningjs/sdk''
```

The first time that you interact with the VideoPlayer plugin, a `<video>`-tag is automatically created.

## Available methods

### consumer

Defines which Lightning component is consuming media events that are emitted by the VideoPlayer plugin (see [Events](#events) for more information).

```js
import { Lightning, VideoPlayer } from '@lightningjs/sdk''

class Player extends Lightning.Component {
  _firstActive() {
    VideoPlayer.consumer(this)
  }
}
```

In the `_firstActive` (or `_init`) lifecycle event, you can pass the reference to the component that should be set as the _consumer_.

Note that only one component at the same time can consume VideoPlayer events.

### position

Sets the x and y position of the video player.

The `position` method accepts 2 arguments (`top` and `left`). Both values should be absolute numbers (either positive or negative).
The default values for `top` and `left` are `0`.

```js
// move VideoPlayer 100 pixels down and 200 pixels to the right
VideoPlayer.position(100, 200)
```

Note that depending on the size of the video player, changing it's position, can move it (partially) out of view.

### size

Sets the size of the video player.

The `size` method accepts 2 arguments (`width` and `height`). Both values should be absolute numbers (positive).
The default `width` is set to `1920` and the default `height` is set to `1080`.

```js
// resize VideoPlayer to half its normal size
VideoPlayer.size(960, 540)
```

### area

Sets the x and y position and the size of the video player at the same time.

The `area` method accepts 4 arguments (`top`, `right`, `bottom` and `left`). The value
of each argument corresponds with the _margin_ that is calculated from the edge of the screen to each side
of the video player.

By default, the video player is located in the top left corner (i.e., `top = 0` and `left = 0`) and covers the full
screen (i.e., `bottom = 1080` and `right = 1920`).

```js
const top = 100
const right = 200
const bottom = 100
const left = 200
VideoPlayer.area(top, right, bottom, left)
```

### open

Opens a video (specified as a url) and starts playing it as soon as the video player has buffered enough to begin.

```js
const videoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
VideoPlayer.open(videoUrl)
```

### reload

Stops the current playing video and restarts it from the beginning.

```js
VideoPlayer.open(videoUrl)

// reload video after 5 seconds
setTimeout(() => {
  VideoPlayer.reload()
}, 5000)

```

### close

Unsets the `source` of the video player and then hides the video player.

```js
VideoPlayer.close()
```

### clear

Unsets the `source` of the video player (without hiding it).

```js
VideoPlayer.clear()
```

### pause

Pauses the video that is currently being played.

```js
VideoPlayer.open(videoUrl)

// pause the video after 5 seconds
setTimeout(() => {
  VideoPlayer.pause()
}, 5000)
```

### play

Plays the currently loaded video.

```js
VideoPlayer.play(videoUrl)
```

### playPause

Toggles the playing state of the video player.

If a video is currently playing, it pauses it. And, vice versa, it plays a video that is currently paused.

```js
VideoPlayer.playPause()
```

### mute

Mutes or unmutes the video player.

The `mute` method accepts a Boolean as its single argument. When passed `true` (or when omitted), it mutes the video player.
When passed `false`, it sets the video player to unmuted.

```js
// mute a video
VideoPlayer.mute()
// unmute a video
VideoPlayer.mute(false)
```

### loop

Sets the `loop` state of the video player.

The `loop` method accepts a Boolean as its single argument. When passed `true` (or when omitted), it
instructs the video player to loop (i.e., to restart the current video when it reaches the end). When
passed `false`, it instructs the video player _not_ to loop the video.

```js
// loop a video
VideoPlayer.loop()
// unloop a video
VideoPlayer.loop(false)
```

### seek

Sets the current time of the video player to the specified time in seconds.

The `seek` method accepts the time in seconds as its single argument. Negative numbers
are automatically rounded up to `0`. When the value in seconds exceeds the duration
of the video, it rounds down the value and jumps straight to the end of the video.

```js
// seek to 20 seconds
VideoPlayer.seek(20)
// seek to 150 seconds
VideoPlayer.seek(150)
// seek to end of video (assuming the video is shorter than 1000 seconds)
VideoPlayer.seek(1000)
```

### skip

Jumps a specified number of seconds forward or backward from the video's current time.

The `skip` method accepts the number of seconds to jump as its single argument. A positive value will jump forwards,
while a negative value will jump backward.

If a jump backward would result in a value below `0` (for example, jump `-20` seconds when the video is only at `10` seconds),
the `skip` method automatically rounds up to `0`. Similarly if you skip further than the duration of the video,
the `skip` method rounds down the value and goes straight to the end of the video.


```js
// skip forward 20 seconds
VideoPlayer.skip(20)

// skip backward 20 seconds
VideoPlayer.skip(-20)
```

### show

Shows the video player.

```js
VideoPlayer.show()
```

### hide

Hides the video player.

```js
VideoPlayer.hide()
```

### duration

Getter that retrieves the total duration of the current video in seconds.

```js
VideoPlayer.duration // e.g. 160.44 (seconds)
```

### currentTime

Getter that retrieves the video's current time in seconds.

```js
VideoPlayer.currentTime // e.g. 20.01 (seconds)
```

### muted

Getter that retrieves the mute state of the video player (`true` or `false`).

```js
VideoPlayer.mute()
VideoPlayer.muted // true

VideoPlayer.mute(false)
VideoPlayer.muted // false
```

### looped

Getter that retrieves the loop state of the video player (`true` or `false`).

```js
VideoPlayer.loop()
VideoPlayer.looped // true

VideoPlayer.loop(false)
VideoPlayer.looped // false
```

### src

Getter that retrieves the video player's current source (`src`).

```js
const videoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
VideoPlayer.open(videoUrl)

VideoPlayer.src // http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
```

### playing

Getter that retrieves if the video player is currently in a `playing` state (`true`) or a `paused` state (`false`).

```js
VideoPlayer.play()
VideoPlayer.playing // true

VideoPlayer.pause()
VideoPlayer.playing // false
```

<!-- ### get playingAds() {
leaving this undocumented for now -->

<!-- ### get canInteract() {
leaving this undocumented for now -->


### top

Getter that retrieves the `top y` position of the video player.

```js
VideoPlayer.position(100, 200)
VideoPlayer.top // 100
```

### left

Getter that retrieves the `left x` position of the video player.

```js
VideoPlayer.position(100, 200)
VideoPlayer.left // 200
```

### bottom

Getter that retrieves the `bottom y` position of the video player.

```js
VideoPlayer.area(100, 200, 100, 200)
VideoPlayer.bottom // 100
```

### right

Getter that retrieves the `right x` position of the video player.

```js
VideoPlayer.area(100, 200, 100, 200)
VideoPlayer.right // 200
```

### width

Getter that retrieves the width of the video player.

```js
VideoPlayer.size(960, 540)
VideoPlayer.width // 960
```

### height

Getter that retrieves the height of the video player.

```js
VideoPlayer.size(960, 540)
VideoPlayer.height // 540
```

### visible

Getter that retrieves whether the video player is set to visible (`true`) or hidden (`false`).

```js
VideoPlayer.show()
VideoPlayer.visible // true

VideoPlayer.hide()
VideoPlayer.visible // false
```

## Events

The VideoPlayer plugin emits a number of [media events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events) to its
consumer (as specified in [`VideoPlayer.consumer()`](#consumer)).

The _consuming_ component can hook into these events by specifying methods on the Class in the following format: `$videoPlayer{Eventname}`, where
_Eventname_ refers to the media event to respond to.

The event hook methods will receive an `Object` with a reference to the _video-element_ and the _html5 event_ (if available) as their first argument. The `currentTime` of the video will be passed as a second argument.

Alternatively `$videoPlayerEvent(eventName)` can be used as a _catch-all_, which receives the _eventName_ as it's first argument.
For the catch-all hook, the second argument is be the beforementioned `Object` with _video-element_ reference and _html5 event_. The third argument is
the `currentTime` of the video.

The available events are:

- $videoPlayerAbort
- $videoPlayerCanPlay
- $videoPlayerCanPlayThrough
- $videoPlayerDurationChange
- $videoPlayerEmptied
- $videoPlayerEncrypted
- $videoPlayerEnded
- $videoPlayerError
- $videoPlayerInterruptBegin
- $videoPlayerInterruptEnd
- $videoPlayerLoadedData
- $videoPlayerLoadedMetadata
- $videoPlayerLoadStart
- $videoPlayerPlay
- $videoPlayerPlaying
- $videoPlayerProgress
- $videoPlayerRatechange
- $videoPlayerSeeked
- $videoPlayerSeeking
- $videoPlayerStalled
- $videoPlayerTimeUpdate
- $videoPlayerVolumeChange
- $videoPlayerWaiting
- $videoPlayerClear
