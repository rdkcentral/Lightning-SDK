# Metrics

It's important to know how people use Apps, and we can do so by keeping track of a range of metrics and send them to a backend.

Different operators might implement the tracking metrics in different ways. That's why the Lightning SDK offers a Metrics plugin, which is a generic interface for for developers, independent of the operator or platform.

Some standard metrics are automatically implemented by the  SDK. Such as _app launched_, _app loaded_, _app closed_ and various media _player events_.

As a developer you can implement additional metrics in your App. For example when the app is _ready to use_ or specific user interactions, such as _clicking on a button_.

There are 4 categories for sending metrics. App, Page, User and Media.

## Usage

In componenents where you want to track and send events, import the Metrics plugin.

```js
import { Metrics } from '@lightningjs/sdk'
```

## Available methods

### App Launch

Send a metric that the App is launched (implemented automatcially by the SDK)

```js
Metrics.app.launch()
```

### App Loaded

Send a metric that the App is loaded (implemented automatcially by the SDK)

```js
Metrics.app.loaded()
```

### App Ready

Send a metric that the App is ready to be used.

```js
Metrics.app.ready()
```

### App Close

Send a metric that the App is closed (implemented automatcially by the SDK)

```js
Metrics.app.close()
```

### App Error

Send a metric that an error has occured in the App.

```js
Metrics.app.error(message, code, params)
```

### App Event

Send a custom metric related to an App event.

```js
Metrics.app.event(name, params)
```

### Category View

Send a metric that a category page has been viewed.

```js
Metrics.category.view(name, params)
```

### Category Leave

Send a metric that a category page has been left.

```js
Metrics.category.leave(name, params)
```

### Category Error

Send a metric that an error has occured accessing a category page.

```js
Metrics.category.error(message, code, params)
```

### Category Event

Send a custom metric related to a category page event.

```js
Metrics.category.event(name, params)
```

### Search View

Send a metric that a search results page has been viewed.

```js
Metrics.search.view(name, params)
```

### Search Leave

Send a metric that a search results page has been left.

```js
Metrics.search.leave(name, params)
```

### Search Error

Send a metric that an error has occured accessing a search results page.

```js
Metrics.search.error(message, code, params)
```

### Search Event

Send a custom metric related to a search results page event.

```js
Metrics.search.event(name, params)
```

### Details View

Send a metric that a details page has been viewed.

```js
Metrics.details.view(name, params)
```

### Details Leave

Send a metric that a details page has been left.

```js
Metrics.details.leave(name, params)
```

### Details Error

Send a metric that an error has occured accessing a details page.

```js
Metrics.details.error(message, code, params)
```

### Details Event

Send a custom metric related to a details page event.

```js
Metrics.details.event(name, params)
```

### Page View

Send a metric that a page has been viewed.

```js
Metrics.page.view(name, params)
```

### Page Leave

Send a metric that a page has been left.

```js
Metrics.page.leave(name, params)
```

### Page Error

Send a metric that an error has occured accessing a page.

```js
Metrics.page.error(message, code, params)
```

### Page Event

Send a custom metric related to a Page event.

```js
Metrics.page.event(name, params)
```

### User Click

Send a metric that a user has clicked an element.

```js
Metrics.user.click(name, params)
```

### User Input

Send a metric that a user has supplied input.

```js
Metrics.user.input(name, params)
```

### User Error

Send a metric that an error has occured related to a user event.

```js
Metrics.user.error(message, code, params)
```

### User Event

Send a custom metric related to a User event.

```js
Metrics.user.event(name, params)
```

### Media

The Lightning SDK's [VideoPlayer plugin](/plugins/videoplayer) automatically tracks and sends Video related metrics. Each metric receives the current video Url and the current video's progress.

- Media Abort
- Media CanPlay
- Media Ended
- Media Pause
- Media Play
- Media Suspend
- Media VOlumeChange
- Media  Waiting
- Media Seeking
- Media Seeked

<!-- ### Generic Error

### Generic Event -->

### Playback
QoS metrics for use with any player framework.

#### Playback Initiated
Track when playback has been initiated, i.e. requested (but not necessary started):
```js
Metrics.playback.initiated(contentId, startTime) {
```

#### Playback Started
Track when playback has been started, i.e. frames are moving:
```js
Metrics.playback.started(contentId, startTime) {
```

#### Progress
```js
Metrics.playback.progressAsPercent(contentId, progress, completed = false)
```
```js
Metrics.playback.progressAsSeconds(contentId, progress, duration, completed = false) {
```

#### Rendition Changed
Track when the playback rendition, e.g. bitrate or dimensions, has changed:
```js
Metrics.playback.renditionChanged(contentId, progress, bitrate, width, height) {
```

#### Buffer Interruption
Track when natural playback is unexpected paused due to network constraints. Should only be called when frames stop moving w/out any user intervention (e.g. buffering due to a seek should not result in calling this method):

```js
Metrics.playback.bufferInterruptionStarted(contentId, progress) {
```

#### Buffer Interruption Completed
Track when playback has recovered after a prevoius `bufferInterruptionStarted`:
```js
Metrics.playback.bufferInterruptionCompleted(contentId, progress) {
```
