# Router

The Router plugin provides an easy to use api that helps you create a _url driven, routed_ Lightning App.

The Router is typically used to navigate between _Pages_, which are effectively _Lightning Components_ (i.e. a class that extends `Lightning.Component`).
Optionally you can also attach one or more _Callback_ `functions` to a route.

Besides taking away a lot of boilerplate code, the Router plugin can be beneficial for _memory management_ as well, due to it's configurable
[lazy creation and destroy](settings?id=lazy-creation) functionality. This is especially helpful when deploying an App on low-end devices with less memory (RAM / VRAM)

## Example app

We've provided an example App that showcases all the features of the Router: https://github.com/mlapps/router-example-app.

Feel free to use this App as the foundation of your App or copy parts of it to your existing App.

## Usage

In order to power your App with router capabilities you first need to import the Router plugin from the Lightning-SDK
in your `App.js`

```js
import { Router } from 'wpe-lightning-sdk'
```

### Setup

Normally your App extends a standard Lightning Component. When you want to make your App _routed_, you can extend `Router.App` instead,
which comes with a default setup for the `template`, `states` and `getters`.

```js
import { Router } from 'wpe-lightning-sdk'

export default class App extends Router.App {
    _setup() {
        Router.startRouter(routes)
    }
}
```

The next step is to configure the available routes that exist for your App, using the `Router.startRouter` method, which accepts an object with [router configuration](configuration) as it's first argument. A good place to initiate the router is in your App's `_setup` lifecycle event.

### Basic routes

The Router's _configuration object_ should contain a `routes` key, which is an `array` of route definitions.

Each item represents a _route-path_ that the App should listen for and specifies which _component_ (i.e. page) should be displayed when that route is hit.

You can define your routes object directly inside your `App.js`, but it's recommended to specify your routes in a separate `routes.js` file.

```js
// file: src/routes.js
import { Home, Browse } from './pages';

export default {
  routes: [
    {
      path: 'home',
      component: Home
    },
    {
      path: 'home/browse/adventure',
      component: Browse
    }
  ]
}
```

### Navigating

Considering the router configuration above, whenever you point your browser to `localhost:8080#home` it will display the `Home` page component and
`locahost:8080#home/browse/adventure` will display the `Browse` page.

When you want to navigate between pages inside your App, you should never set the browser's location hash directly.
Instead you can use the `navigate` method exported by the Router plugin.

```js
Router.navigate('home')
Router.navigate('home/browse/adventure')
```

Calling these methods will update the browser hash properly for you and handle the entire navigation flow between Pages.

Next:
[Router configuration](configuration.md)
