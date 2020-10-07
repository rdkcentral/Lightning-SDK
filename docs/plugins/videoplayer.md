# Video Player plugin

.....

## Usage

Import the VideoPlayer plugin from the Lightning SDK

```js
import { VideoPlayer } from '@lightningjs/sdk''
```

The first time that you interact with the VideoPlayer, a video-tag will be created.

## Available methods

### Consumer

- defines the Lightning component will be consuming media events emitted by the VideoPlayer plugin (see Events)

```js
class Player extends Lightning.Component {
  _firstActive() {
    VideoPlayer.consumer(this) /
  }
}
```

Note that only 1 Lightning component can comsume the VideoPlayer at the same time

### position

- sets x, y position of the video player
- signature / defaults: position(top = 0, left = 0)

```js
// move video player 100 pixels down and 200 pixels to the right
VideoPlayer.position(100, 200)
```

### size

- sets the size of the video player
- signature / defaults: size(width = 1920, height = 1080)

```js
// resize video player to half the normal size
VideoPlayer.size(960, 540)
```

### area

- sets the position and the size of the video player
- signature / defaults: area(top = 0, right = 1920, bottom = 1080, left = 0)

```js
const top = 100
const right = 200
const botom = 100
const left = 200
VideoPlayer.area(top, right, bottom, left)
```

### open

- opens (and plays) a video
- signature open(url)

```js
const videoUlr = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
VideoPlayer.open(videoUrl)
```

### reload

- reloads the current playing video (close and open again)

```js
VideoPlayer.open(videoUrl)

// reload video after 5 seconds
setTimeout(() => {
  VideoPlayer.reload()
}, 5000)

```

### close

- clear and hide the video player

```js
VideoPlayer.close()
```

### clear

- unsets the src of the video player (doesn't hide)

```js
VideoPlayer.clear()
```


### pause

- pauses the video

```js
VideoPlayer.open(videoUrl)

// pause the video after 5 seconds
setTimeout(() => {
  VideoPlayer.pause()
}, 5000)
```

### play

- plays a paused video

```js
VideoPlayer.play(videoUrl)
```

### playPause

- plays when the video is currently paused
- pauses when the video is currently playing

```js
VideoPlayer.play(videoUrl)
```

### mute

- mutes / unmutes the video player
- signature / defaults mute(muted = true)

```js
// mute a video
VideoPlayer.mute()
// unmute a video
VideoPlayer.mute(false)
```

### loop

- set the video player to loop (or unloop)
- signature / defaults loop(looped = true)

```js
// loop a video
VideoPlayer.loop()
// loop a video
VideoPlayer.loop(false)
```

### seek

- set the video player to a time in seconds
- signature: seek(time)
- time between 0 and duration of video, automatically caps at total video duration and 0

```js
// seek to 20 seconds
VideoPlayer.seek(20)
// seek to 150
VideoPlayer.seek(150)
// seek to end of video (assuming video is shorter than 1000 seconds)
VideoPlayer.seek(1000)
```

### skip

- jumps x seconds (current time + x seconds)
- signature: skip(seconds)
- automatically caps at total video duration and 0

```js
// skip forward 20 seconds
VideoPlayer.skip(20)

// skip backward 20 seconds
VideoPlayer.skip(-20)
```

### show

- shows the video player

```js
VideoPlayer.show()
```

### hide

- hides the video player

```js
VideoPlayer.show()
```

<!-- ### enableAds(enabled = true)

- leaving this feature undocumented for now -->

### duration

- getter for duration of the video

```js
VideoPlayer.duration // e.g. 160.44 (seconds)
```

### currentTime

- getter for the current time of the video

```js
VideoPlayer.currentTime // e.g. 20.01 (seconds)
```

### muted

- getter for muted state of the video player

```js
VideoPlayer.mute()
VideoPlayer.muted // true

VideoPlayer.mute(false)
VideoPlayer.muted // false
```

### looped

- getter for the looped status of the video

```js
VideoPlayer.loop()
VideoPlayer.looped // true

VideoPlayer.loop(false)
VideoPlayer.looped // false
```

### src

- getter for the current src of the video

```js
const videoUlr = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
VideoPlayer.open(videoUrl)

VideoPlayer.src // http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
```

### playing

- getter for the current playing status of the video

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

- getter for the top y position of the video player

```js
VideoPlayer.position(100, 200)
VideoPlayer.top // 100
```

### left

- getter for left x position of the video player

```js
VideoPlayer.position(100, 200)
VideoPlayer.left // 200
```

### bottom

- getter for bottom y position of the video player (i.e. top + height)

```js
VideoPlayer.area(100, 200, 100, 200)
VideoPlayer.bottom // 100
```

### right

- getter for right x position of the video player (i.e left + width)

```js
VideoPlayer.area(100, 200, 100, 200)
VideoPlayer.right // 200
```

### width

- getter for the width of the video player

```js
VideoPlayer.size(960, 540)
VideoPlayer.width // 960
```

### height

- getter for the height of the video player

```js
VideoPlayer.size(960, 540)
VideoPlayer.height // 540
```

### visible

- getter for whether the video player is visible or not

```js
VideoPlayer.show()
VideoPlayer.visible // true

VideoPlayer.hide()
VideoPlayer.visible // false
```

<!-- ### adsEnabled

- leaving this undocumented for now -->


## Events

The VideoPlayer emits a number of Media events (as specified: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events) to
it's _consumer_ (as specified in `VideoPlayer.consumer()`)

In the consuming Component you can hook into these events by defining a method on the Class in the format `$videoPlayer{Eventname}` for each specific event.
Or you can use `$videoPlayerEvent(eventName)` as a catch all.

The available events:

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
- $videoPlayerPause
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

