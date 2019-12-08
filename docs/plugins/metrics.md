# Metrics

It's important to know how people use Apps, and we can do so by keeping track of a range of metrics and send them to a backend.

Different operators might implement the tracking metrics in different ways. That's why the Lightning SDK offers a Metrics plugin, which is a generic interface for for developers, independent of the operator or platform.

Some standard metrics are automatically implemented by the  SDK. Such as _app launched_, _app loaded_, _app closed_ and various media _player events_.

As a developer you can implement additional metrics in your App. For example when the app is _ready to use_ or specific user interactions, such as _clicking on a button_.

There are 4 categories for sending metrics. App, Page, User and Media.

## Usage

In componenents where you want to track and send events, import the Metrics plugin.

```js
import { Metrics } from 'wpe-lightning-sdk'
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
Metrics.app.close(message, code, params)
```

### App Event

Send a custom metric related to an App event.

```js
Metrics.app.event(name, params)
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

The Lightning SDK's [MediaPlayer plugin](/plugins/mediaplayer) automatically tracks and sends Media related metrics. Each metric receives the current video Url and the current video's progress.

#### Media Abort

#### Media CanPlay

#### Media Ended

#### Media Pause

#### Media Play

#### Media Suspend

#### Media VOlumeChange

#### Media  Waiting

#### Media Seeking

#### Media Seeked

### Generic Error

### Generic Event
