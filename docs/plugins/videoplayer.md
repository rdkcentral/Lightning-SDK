# VideoPlayer

A common feature of TV Apps is to play videos.

The *VideoPlayer* plugin offers a convenient interface
for interacting with the video player of the STB. You can use it to open and play / pause videos. Additionally, it provides APIs that you can use to, for example, control the size of the video player.

The VideoPlayer plugin has a built-in integration with the [Metrics](metrics.md) plugin. It automatically sends statistics for
various [media events](#events) (for example: canplay, play, pause, seeking, seeked).

> Although it is possible to implement a fully custom video playback solution, the use of the VideoPlayer plugin from
the SDK is highly recommended.

## Usage

In the Lightning components that require video playback capabilities (i.e., Player components), you can import the
VideoPlayer plugin from the Lightning SDK:

```
import { VideoPlayer } from '@lightningjs/sdk'
```

The first time that you interact with the VideoPlayer plugin, a `<video>` tag is created automatically.

## Available methods

### consumer()

Defines which Lightning component is consuming media [events](#events) that are emitted by the VideoPlayer plugin.

```
import { Lightning, VideoPlayer } from '@lightningjs/sdk''

class Player extends Lightning.component {
  _firstActive() {
    VideoPlayer.consumer(this)
  }
}
```

In the `_firstActive` (or `_init`) [lifecycle event](../../lightning-core-reference/Components/LifecycleEvents.md), you can pass a reference to the component that should be set as the *consumer*.

> Only *one* component can consume VideoPlayer events at the same time.

### position()

Sets the x and y position of the video player.

The `position` method accepts 2 arguments: `top` and `left`. Both values must be positive or negative absolute numbers. They both default to 0 (zero).

For example:

```
// move VideoPlayer 100 pixels down and 200 pixels to the right
VideoPlayer.position(100, 200)
```

> If you change the position of the video player, it can move (partially) out of view. This depends on the size of the video player.

### size()

Sets the size of the video player.

The `size` method accepts 2 arguments: `width` and `height`. Both values must be positive absolute numbers.
The default value for `width` is 1920, while `height`defaults to 1080.

```
// resize VideoPlayer to half its normal size
VideoPlayer.size(960, 540)
```

### area()

Sets the x and y position *and* the size of the video player at the same time.

The `area` method accepts 4 arguments: `top`, `right`, `bottom` and `left`. The value
of each argument corresponds with the *margin* that is calculated from the edge of the screen to each side
of the video player.

```
const top = 100
const right = 200
const bottom = 100
const left = 200
VideoPlayer.area(top, right, bottom, left)
```

By default, the video player is located in the *top left* corner (i.e., `top = 0` and `left = 0`) and covers the *full*
screen (i.e., `bottom = 1080` and `right = 1920`).

### open()

Opens a video (specified as a URL) and starts playing it as soon as the video player has buffered enough to begin.

For example:

```
const videoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
VideoPlayer.open(videoUrl)
```

### reload()

Stops the video that is currently playing, and restarts it from the beginning.

```
VideoPlayer.open(videoUrl)

// reload video after 5 seconds
setTimeout(() => {
  VideoPlayer.reload()
}, 5000)
```

### close()

Unsets the `source` of the video player and then hides the video player.

```
VideoPlayer.close()
```

### clear

Unsets the `source` of the video player (without hiding it).

```
VideoPlayer.clear()
```

### pause()

Pauses the video that is currently playing.

```
VideoPlayer.open(videoUrl)

// pause the video after 5 seconds
setTimeout(() => {
  VideoPlayer.pause()
}, 5000)
```

### play()

Plays the currently loaded video.

```
VideoPlayer.play(videoUrl)
```

### playPause()

Pauses or plays the video player, depending on its current state.

If a video is currently playing, the method pauses it. And, vice versa, it plays a video that is currently paused.

```
VideoPlayer.playPause()
```

### mute()

Mutes or unmutes the video player, depending on its current state.

The `mute` method accepts a Boolean as its single argument. When passed 'true' (or when omitted), it mutes the video player.
When passed 'false', it sets the video player to unmuted.

```
// mute a video
VideoPlayer.mute()
// unmute a video
VideoPlayer.mute(false)
```

### loop()

Sets the loop state of the video player.

The `loop` method accepts a Boolean as its single argument. When passed 'true' (or when omitted), it
instructs the video player to loop (i.e., to restart the current video when it reaches the end). When
passed 'false', it instructs the video player to *not* loop the video.

```
// loop a video
VideoPlayer.loop()
// unloop a video
VideoPlayer.loop(false)
```

### seek()

Sets the current time of the video player to the specified time in seconds.

The `seek` method accepts the *time in seconds* as its single argument. Negative numbers
are automatically rounded up to 0.

If the value *exceeds* the duration
of the video, it rounds the value down and jumps straight to the end of the video.

```
// seek to 20 seconds
VideoPlayer.seek(20)
// seek to 150 seconds
VideoPlayer.seek(150)
// seek to end of video (assuming the video is shorter than 1000 seconds)
VideoPlayer.seek(1000)
```

### skip()

Jumps a specified number of seconds forward or backward from the video's current time.

The `skip` method accepts the *number of seconds to jump* as its single argument. A positive value will have it jump forwards,
a negative value will have it jump backward.

If a jump backward would result in a value below 0 (for example, jump -20 seconds when the video is only still at 10 seconds),
the `skip` method automatically rounds up to 0.

Similarly, if you jump further than the duration of the video, the `skip` method rounds down the value and goes straight to the end of the video.

```
// skip forward 20 seconds
VideoPlayer.skip(20)

// skip backward 20 seconds
VideoPlayer.skip(-20)
```

### show()

Shows the video player.

```
VideoPlayer.show()
```

### hide()

Hides the video player.

```
VideoPlayer.hide()
```

### duration()

Getter that retrieves the total duration of the current video in seconds.

```
VideoPlayer.duration // e.g. 160.44 (seconds)
```

### currentTime()

Getter that retrieves the video's current time in seconds.

```
VideoPlayer.currentTime // e.g. 20.01 (seconds)
```

### muted()

Getter that retrieves the *mute state* of the video player ('true' or 'false').

```
VideoPlayer.mute()
VideoPlayer.muted // true

VideoPlayer.mute(false)
VideoPlayer.muted // false
```

### looped()

Getter that retrieves the *loop state* of the video player ('true' or 'false').

```
VideoPlayer.loop()
VideoPlayer.looped // true

VideoPlayer.loop(false)
VideoPlayer.looped // false
```

### src()

Getter that retrieves the video player's current source (src).

```
const videoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
VideoPlayer.open(videoUrl)

VideoPlayer.src // http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
```

### playing()

Getter that indicates whether the video player is currently in a *playing* state ('true') or a *paused* state ('false').

```
VideoPlayer.play()
VideoPlayer.playing // true

VideoPlayer.pause()
VideoPlayer.playing // false
```

### top()

Getter that retrieves the *top y* position of the video player.

```
VideoPlayer.position(100, 200)
VideoPlayer.top // 100
```

### left()

Getter that retrieves the *left x* position of the video player.

```
VideoPlayer.position(100, 200)
VideoPlayer.left // 200
```

### bottom()

Getter that retrieves the *bottom y* position of the video player.

```
VideoPlayer.area(100, 200, 100, 200)
VideoPlayer.bottom // 100
```

### right()

Getter that retrieves the *right x* position of the video player.

```
VideoPlayer.area(100, 200, 100, 200)
VideoPlayer.right // 200
```

### width()

Getter that retrieves the width of the video player.

```
VideoPlayer.size(960, 540)
VideoPlayer.width // 960
```

### height()

Getter that retrieves the height of the video player.

```
VideoPlayer.size(960, 540)
VideoPlayer.height // 540
```

### visible()

Getter that retrieves whether the video player is set to visible ('true') or hidden ('false').

```
VideoPlayer.show()
VideoPlayer.visible // true

VideoPlayer.hide()
VideoPlayer.visible // false
```

## Events

The VideoPlayer plugin emits a number of [media events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events) to its
*consumer* (which is specified in the [`VideoPlayer.consumer()`](#consumer) method).

The *consuming* component can hook into these events by specifying methods on the Class in the format: `$videoPlayer{Eventname}`, where
`Eventname` refers to the media event to respond to.

These *event hook methods* will receive an Object containing a reference to the *video element* and the *html5 event* (if available) as the *first* argument.

The `currentTime` of the video is passed as the *second* argument.

### Catch-all Hook

Alternatively, the method `$videoPlayerEvent(eventName)` can be used as a *catch-all* hook. In that case, it receives the `eventName` as its first argument.

The second argument of a catch-all hook is the (already mentioned) Object containing a reference to the *video element* reference and the *html5 event*.

The third argument is the `currentTime` of the video.

For example:

$videoPlayerEvent(eventName, videoElement, currentTime) {
  console.log(eventname, videoElement, currentTime)}### Event Overview

The available events are:

* $videoPlayerAbort
* $videoPlayerCanPlay
* $videoPlayerCanPlayThrough
* $videoPlayerDurationChange
* $videoPlayerEmptied
* $videoPlayerEncrypted
* $videoPlayerEnded
* $videoPlayerError
* $videoPlayerInterruptBegin
* $videoPlayerInterruptEnd
* $videoPlayerLoadedData
* $videoPlayerLoadedMetadata
* $videoPlayerLoadStart
* $videoPlayerPlay
* $videoPlayerPlaying
* $videoPlayerProgress
* $videoPlayerRatechange
* $videoPlayerSeeked
* $videoPlayerSeeking
* $videoPlayerStalled
* $videoPlayerTimeUpdate
* $videoPlayerVolumeChange
* $videoPlayerWaiting
* $videoPlayerClear
