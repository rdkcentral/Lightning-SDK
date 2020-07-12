# Router

The Router plugin provides an easy to use api that helps you create a _url driven, routed_ Lightning App.

The Router is typically used to navigate between _Pages_, which are effectively _Lightning Components_ (i.e. a class that extends `Lightning.Component`).
Optionally you can also attach one or more _Callback_ `functions` to a route.

Besides taking away a lot of boilerplate code, the Router plugin can be beneficial for _memory management_ as well, due to it's configurable
[lazy creation and destroy](#memory) functionality. This is especially helpful when deploying an App on low-end devices with less memory (RAM / VRAM)

## Example app

We've provided an example App that showcases all the features of the Router:
https://github.com/mlapps/router-example-app.

Feel free to use this App as the foundation of your App or copy parts of it to your existing App.

- [Router configuration](router/configuration.md)
- [Navigation](router/navigation.md)
- [Data providing](router/dataproviding.md)
- [Router events](router/events.md)
- [Page transitions](router/pagetransitions.md)
- [Widgets](router/widgets.md)
- [Settings](router/settings.md)
- [Deeplinking & History](router/deeplinking.md)

## Usage

In order to power your App with router capabilities you first need to import the Router plugin from the Lightning-SDK
in your `App.js`

```js
import { Router } from 'wpe-lightning-sdk'
```

### Setup

Normally your App extends a standard Lightning Component. When you want to make your App routed, you can extend `Router.App`,
which comes with a defualt setup for the `template`, `states` and `getters`:

```js
import { Router } from 'wpe-lightning-sdk'

export default class App extends Router.App {

}
```

Next step is to configure the available routes that exist for your App, using the `Router.startRouter` method, which accepts an object
as it's first argument with [routes configuration](#basic-routes). A good place to initiate the router is in your App's `_setup` lifecycle event.

### Basic routes

The router configuration object should contain a `routes` key, with an array of the routes your App should listen to, and which
Component (page) it should display when each route is hit. You can define your routes object directly inside your `App.js`, but
it's recommended to specify your routes in a separate `routes.js`.

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
      path:'home/browse/adventure',
      component: Browse
    }
  ]
}
```

### Navigating

With the router configuration above, whenever you point your browser to `localhost:8080#home` it will display the `Home`-page and
`locahost:8080#home/browse/adventure` will display the `Browse`-page

When you want to navigate between pages inside your App, you should never set the browser's location hash directly.
Instead you can use the _navigate_ method exported by the Router plugin"

```js
Router.navigate('home')
Router.navigate('home/browse/adventure')
```

Calling these methods will update the browser hash properly for you and handle the entire navigation flow between Pages.

Next:
[Router configuration](configuration.md)