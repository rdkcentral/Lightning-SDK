# Metrics

It's important to know how people use Apps, and we can do so by keeping track of a range of metrics and send them to a backend.

Different operators might implement the tracking metrics in different ways. That's why the Firebolt SDK offers a Metrics plugin, which is a generic interface for for developers, independent of the operator or platform.

Some standard metrics are automatically implemented by the  SDK. Such as _app launched_, _app loaded_, _app closed_ and various media _player events_.

As a developer you can implement additional metrics in your App. For example when the app is _ready to use_ or specific user interactions, such as _clicking on a button_.

There are 4 categories for sending metrics. _App_, _Page_, _User_ and _Media_.

## Usage

In componenents where you want to track and send events, import the Metrics plugin.

```js
import { Metrics } from '@fireboltjs/sdk'
```

## Available methods

### App metrics

App Metrics are the most generic category of Metrics tracking. Everything that happens on the App level
can be tracked using the `Metrics.app` namespace.

A few App metrics are automatically called for you by the SDK.
#### App Launch

Sends a metric that the App is _launched_ (i.e. the App has been _opened_).

```js
Metrics.app.launch()
```

_This metric is automatcially implemented for you in the lifecycle of the SDK._
#### App Loaded

Sends a metric that the App is _loaded_ and is being _initialized_.

```js
Metrics.app.loaded()
```

_This metric is automatcially implemented for you in the lifecycle of the SDK._

#### App Ready

Sends a metric that the App is fully loaded and ready for user interaction.

```js
Metrics.app.ready()
```

#### App Close

Sends a metric that the App is closed.

```js
Metrics.app.close()
```

_This metric is automatcially implemented for you in the lifecycle of the SDK._

#### App Error

Sends a metric that a generic error has occured on the App level.
The `error`-method takes a message and a code. And an optional `params`-object where more details about
the error can be added.

```js
const message = 'An error has occured'
const code = 'error4329'
const params = {
  type: 'fatal',
  line: 239
}
Metrics.app.error(message, code, params)
```

#### App Event

Sends a custom metric that is happening on the App level. The `event`-method takes a name and an
optional `params`-object where more details about the event can be added.

```js
const name = 'Language changed'
const params = {
  previous: 'en-US',
  new: 'nl-NL'
}
Metrics.app.event(name, params)
```

### Page metrics

The `Metrics.page` namespace is used for tracking everything that happens on the Page level of an App.

#### Page View

Sends a metric that a page is viewed. The `view`-method takes a name and an
optional `params`-object where more details about the view can be added.

```js
const name = 'Homepage'
const params = {
  type: 'category',
  hash: '#homepage,
}
Metrics.page.view(name, params)
```

It is recommended to include a `type` key in the the `params` object to indicate what kind of page is being
viewed. Common values for page types include: `category`, `details` and `search`.

#### Page Leave

Sends a metric that the user has navigated away from a page. The `leave`-method takes a name and an
optional `params`-object where more details about the leave event can be added.

```js
const name = 'Homepage'
const params = {
  type: 'category',
  hash: '#homepage,
}
Metrics.page.leave(name, params)
```

It is recommended to include a `type` key in the the `params` object to indicate what kind of page is being
navigated away from. Common values for page types include: `category`, `details` and `search`.

#### Page Error

Send a metric that an error has occured related to a specific a page. The `error`-method takes an error-`message`
and error-`code`. And an optional `params`-object where more details about the error can be added.

```js
const message = 'Unable to load page'
const code = '404'
const params = {
  type: 'details'
}
Metrics.page.error(message, code, params)
```

It is recommended to include a `type` key in the the `params` object to indicate on what kind of page the error occured. Common values for page types include: `category`, `details` and `search`.

#### Page Event

Send a custom metric related to events that happen on the Page-level. The `event`-method takes a name
and an optional `params`-object where more details about the event can be added.

```js
const name = 'Loading'
const params = {
  category: 'search'
}
Metrics.page.event(name, params)
```

It is recommended to include a `type` key in the the `params` object to indicate on what kind of page the event occured. Common values for page types include: `category`, `details` and `search`.

### User metrics

The `Metrics.user` namespace is used for tracking user interactions with the App.

#### User Click

Sends a metric that a user has clicked an element.

```js
const name = 'Sign up button'
const params = {
  text: 'Join now',
  hash: '#pages/signup'
}
Metrics.user.click(name, params)
```

#### User Input

Send a metric that a user has supplied input.

```js
const name = 'Email field'
const params = {
  hash: '#pages/signup'
}
Metrics.user.input(name, params)
```

#### User Error

Sends a metric that an error has occured related to a user event.

```js
const message = 'Incorrect email'
const code = '1234'
const params = {}
Metrics.user.error(message, code, params)
```

#### User Event

Sends a custom metric related to a User event.

```js
const name = 'Signup'
const params = {
  duration: 10,
  hash: '#pages/signup'
}
Metrics.user.event(name, params)
```

### Media events

The `Metrics.media` namespace is used for tracking media events.

The [VideoPlayer plugin](/plugins/videoplayer) automatically tracks and sends Metrics for the following media related events:

- LoadStart
- Abort
- CanPlay
- Ended
- Pause
- Play
- Progress
- Suspend
- VolumeChange
- Waiting
- Seeking
- Seeked
- Ratechange
- Rendition

For apps that don't use the VideoPlayer plugin, tracking has to be implemented manually. Media metrics are initiated by
calling the method `Metrics.media()` and passing it the uri of the media asset that is being tracked. The uri may be a qualified URL to the CDN, or a unique identifier from a CMS.

```js
const mediaMetrics = Metrics.media(assetUri)
```

Next the following methods will become available on the `mediaMetrics` variable:

#### Load Start
Called when playback is requested, but before the frames are available.

```js
mediaMetrics.loadstart({ currentTime: ... })
```

#### Abort
Playback was aborted, but not due to an error.

```js
mediaMetrics.abort({ currentTime: ... })
```

#### Can play

```js
mediaMetrics.canplay({ currentTime: ... })
```

#### Ended
Playback has stopped because the end of the media was reached.

```js
mediaMetrics.ended({ currentTime: ... })
```

#### Pause
Playback has been paused.

```js
mediaMetrics.pause({ currentTime: ... })
```

#### Play
Playback has started either initially, or after being paused.

```js
mediaMetrics.play({ currentTime: ... })
```

#### Progress
Called at regular intervals to update the current progress of playback.

```js
mediaMetrics.progress({ currentTime: ... })
```

#### Suspend

```js
mediaMetrics.suspend({ currentTime: ... })
```

#### Volume Change
Either the volume or the mute state has changed.

```js
mediaMetrics.volumechange({ currentTime: ... })
```

#### Waiting
Playback has stopped because the next frame is not available, but will continue once it is available.

```js
mediaMetrics.waiting({ currentTime: ... })
```

#### Seeking
Seeking was initiated.

```js
mediaMetrics.seeking({ currentTime: ... })
```

#### Seeked
Seeking has completed.

```js
mediaMetrics.seeked({ currentTime: ... })
```

#### Ratechange
The playback rate has changed.

```js
mediaMetrics.ratechange({ currentTime: ... })
```

#### Rendition
The playback rendition, e.g. bitrate, dimensions, etc., has changed.

```js
mediaMetrics.renditionchange({ currentTime: ..., bitrate: ..., width: ..., height: ... })
```

<!-- ### Generic Error

### Generic Event -->
