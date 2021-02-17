# Metrics

It is important to know how people use Apps. We can acquire this information by keeping track of a range of *metrics* and send these to a backend.

Because each operator might implement these tracking metrics in a different way, the Lightning SDK provides the *Metrics* plugin. This plugin is a *generic* interface for developers, independent of any operator or platform.

Some *standard* metrics are automatically implemented by the  SDK, such as  App Launch, App Loaded, App Close and various video-related [media](#media) events.

You can implement additional metrics in your App. For example, when the App is 'Ready to use', or specific user interactions like 'Clicking on a button'.

There are four event-related categories for sending metrics:

* App
* Page
* User
* Media

## Usage

Import the Metrics plugin in components where you want to track and send events:

```
import { Metrics } from '@lightningjs/sdk'
```

## Available Methods

### App.launch()

Sends a metric that the App is launched (implemented automatically by the SDK).

```
Metrics.App.launch()
```

### App.loaded()

Sends a metric that the App is loaded (implemented automatically by the SDK).

```
Metrics.App.loaded()
```

### App.ready()

Sends a metric that the App is ready to be used.

```
Metrics.App.ready()
```

### App.close()

Sends a metric that the App is closed (implemented automatically by the SDK).

```
Metrics.App.close()
```

### App.error()

Sends a metric that an error has occurred in the App.

```
Metrics.App.error(message, code, params)
```

### App.event()

Sends a custom metric that is related to an App event.

```
Metrics.App.event(name, params)
```

### Page.view()

Sends a metric that a page has been viewed.

```
Metrics.page.view(name, params)
```

### Page.leave()

Sends a metric that a page has been left.

```
Metrics.page.leave(name, params)
```

### Page.error()

Sends a metric that an error has occurred when accessing a page.

```
Metrics.page.error(message, code, params)
```

### Page.event()

Sends a custom metric that is related to a Page event.

```
Metrics.page.event(name, params)
```

### User.click()

Sends a metric that a user has clicked on an element.

```
Metrics.user.click(name, params)
```

### User.input()

Sends a metric that a user has supplied input.

```
Metrics.user.input(name, params)
```

### User.error()

Sends a metric that an error has occurred that is related to a User event.

```
Metrics.user.error(message, code, params)
```

### User.event()

Sends a custom metric that is related to a User event.

```
Metrics.user.event(name, params)
```

### Media

The [VideoPlayer](videoplayer.md) plugin automatically tracks and sends video-related metrics. Each metric receives the URL and progress of the current video. The Media events that are sent as metrics are:

* Media Abort
* Media CanPlay
* Media Ended
* Media Pause
* Media Play
* Media Suspend
* Media VolumeChange
* Media  Waiting
* Media Seeking
* Media Seeked
