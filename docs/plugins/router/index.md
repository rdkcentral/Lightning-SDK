# Router

The *Router* plugin provides an easy-to-use API that helps you create a *URL-driven, routed* Lightning App.

The Router is typically used to navigate between *Page components*, which are effectively *Lightning Components* (that is, class that extends `Lightning.Component`).

Besides taking away a lot of boilerplate code, the Router plugin can be beneficial for *memory management* as well, due to it's configurable [lazy creation](settings.md#lazyCreate) and [lazy destroy](settings.md#lazyDestroy) functionality. This is especially helpful when deploying an App on low-end devices with less memory (RAM / VRAM)

> As this plugin requires a specific *chronological reading order*, each topic concludes with a reference to the next topic.

## Example App

The following link provides an example App that showcases all the features of the Router: [https://github.com/mlapps/Router-example-app](https://github.com/mlapps/router-example-app).

Feel free to use this App as a foundation of your App, or copy parts of it to your existing App.

## Usage

To power your App with Router capabilities, you first need to import the Router plugin from the Lightning SDK
in your **App.js** file:

```js
import { Router } from '@lightningjs/sdk'
```

### App Base Class

The App Base Class constructor function is defined as follows:

```js
class MyApp extends Router.App {

}
```

### Setup

Normally, your App extends the standard `Lightning.Component`.

If you want to make your App *routed*, you extend `Router.App` instead. This provides a default setup for the `template`, `states` and `getters`:

```js
import { Router } from '@lightningjs/sdk'

export default class App extends Router.App {
    _setup() {
        Router.startRouter(routes)
    }
}
```

In the next step, you configure the available *routes* for your App. You do this using the `Router.startRouter` method, a Router configuration object as its first argument. See [Router Configuration](configuration.md) for more information.

> It is recommended to initiate the Router by implementing the `_setup`[lifecycle event](../../../lightning-core-reference/Components/LifecycleEvents.md) of your App in **App.js**.

### Basic Routes

The `routes` key is an Array of route definition items. Each item represents a route path to which the App listens, and specifies which Page component should be displayed when that route is hit.

> See [Router Configuration](configuration.md#routes) for more information.

### Navigating

Consider the Router configuration above. If you point your browser to `localhost:8080#home` (note that the 8080 port serves as an example), it displays the **Home** page, while  `locahost:8080#home/browse/adventure` displays the **Browse** page.

If you want to navigate between pages inside your App, you should *never* set the browser's location hash *directly*.
Use the `navigate` method instead, which is provided by the Router plugin.

If this method is called correctly, it updates the browser hash and handles the entire navigation flow between pages accordingly. For example:

```js
Router.navigate('home')
Router.navigate('home/browse/adventure')
```

> See [Router Navigation](navigation.md) for more information.

## Available Methods

### back

```js
Router.back()
```

> See [Router History](history.md#back) for more information.

### focusPage

```js
Router.focusPage()
```

> See [Router Widgets](widgets.md#handling-focus) for more information.

### focusWidget

```js
Router.focusWidget("Menu")
```

> See [Router Widgets](widgets.md#handling-focus) for more information.

### getActiveHash

```js
Router.getActiveHash()
```

Returns the active `hash`

### getActivePage

```js
Router.getActivePage()
```

Returns the reference of the active `Page` instance.

### getActiveRoute

```js
Router.getActiveRoute()
```

Returns the active route `path` blueprint

### getActiveWidget

```js
Router.getActiveWidget()
```

Returns the instance of the widget that has `focus`.

### getHistory

```js
Router.getHistory()
```

> See [Router History](history.md#gethistory) for more information.

### getHistoryState

```js
Router.getHistoryState()
```

> See [Router History](history.md#gethistorystate) for more information.

### go

```js
Router.go(-3)
```

> See [Router History](history.md#go) for more information.

### isNavigating

```js
Router.isNavigating()
```

> See [Router Navigation](navigation.md#is-navigating) for more information.

### navigate

```js
Router.navigate("path/to/navigate")
```

> See [Router Navigation](navigation.md#router-navigation) for more information.

### replaceHistoryState

```js
Router.replaceHistoryState({a:1, b:2})
```

> See [Router History](history.md#replacehistorystate) for more information.

### resume

```js
Router.resume()
```

> See [Router Configuration](configuration.md#bootcomponent) for more information.

### startRouter

```js
Router.startRouter(routes)
```

> See [Setup](#setup) and [Router Configuration Object](configuration.md#router-configuration) for more information.

#### NEXT:
[Router Configuration](configuration.md)
