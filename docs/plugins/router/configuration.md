# Router

## Router configuration

The Router plugin can be configured by passing in a _configuration_ object to the `Router.startRouter()` method
(typically called in the `_setup` lifecycle event in `App.js`). The configuration object can contain 4 different
keys: `root`, `boot`, `bootComponent`, and `routes`.

It is recommended to specify this configuration in a separate file, i.e. `src/routes.js`.

### Root

The `root` key indicates which _route path_ to use as the _entry point_ of your App, when no location hash
in the url has been specified. The value of `root` should be a _String_ or function that must return a _Promise_ and resolves a _String_.
The value must match a _path_ of one of the defined _routes_.

Typically you would specify either the path to a _Splash_ or the _Home_ page as `root`.

```js
import { Splash } from './pages';

export default {
  root: 'splash',
  routes: [
    {
      path: 'splash',
      component: Splash
    },
  ]
}
```

or function


```js
export default {
  root: () => {
    return new Promise((resolve) => {
        if(authenticated) {
            resolve('browse')
        }else{
            resolve('login')
        }
    })
  }
}
```

In the example above, upon opening your App, the Router plugin will navigate to `localhost:8080#splash` and subsequently display
the _Splash_ page.


### Boot

Boot provides the ability to execute functionality before the Router loads the first page. For example to obtain API tokens.

If your App requires this, you can specify a _function_  in the `boot` key of the configuration object.

The boot function has to return a _Promise_. And only when the promise resolves the Router will
initiate it's navigation process.

The _Boot function_ will be executed when you open the App on the _root_ page, but it will also be invoked when you open
with a [deeplink](plugins/router/deeplinking.md) location in the App.

```js
export default {
    boot: () => {
        return new Promise(resolve => {
            Api.getToken().then(() => {
                resolve()
            })
        })
    },
    routes: [...]
}
```


The `querystring` will be made available as on `Object`.
If you would point the browser to: `localhost:8080#splash?deviceId=1801&partnerId=145`

```js
export default {
    boot: (qs) => {
        // qs => { deviceId: '1801', partnerId: '145' }
        return Promise.resolve()
    }
}
```

### Boot component

If you want to display a _Splash_ or _Loading_ screen while the Router is booting (and before the actual routing process kicks in),
you can specify a Lightning Component in the `bootComponent` key of the configuration object.

This component will be displayed when opening the _root_ of your App, as well as when opening a _deeplinked_ location in your App.

```js
import { Splash } from './pages',

export default {
    boot: () => {
        return new Promise(resolve => {
            Api.getToken().then(() => {
                resolve();
            })
        })
    },
    bootComponent: Splash,
    routes:[...]
}
```

Since your Boot component might show some kind of animation that takes some time to finish, the Router plugin does not hide
the Boot component automatically. Instead you have to explicitely call `Router.resume()` in you Boot component, whenever it's
ready to give back control to the Router plugin.

### Dynamic routes

So far we have only specified static route paths (i.e. `home/browse/adventure`). But the Router plugin also supports _dynamic_ routes.

You can make a route part dynamic by prefixing it with `:`

```js
{
  path: 'player/:assetId/:playlistId',
  component: Player
}
```

This route will now match for example `localhost:8080#player/27/286`. It will also make available the data from the specific route (i.e. the `assetId` and the
`playlistId`). See [accessing data from route components](#accessing-data-from-route-components).

### Accessing data from route components

If you [navigate](#navigation-helper) to: `127.0.0.1:8080/#player/14728/38101`
the router will add the properties `.assetId = 14728` and `.playlistId = 38101` to the instance of the *Player* `Component`

You can also use [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) to execute logic
when the properties are being set.

```js
class Player extends Lightning.Component {
    static _template(){
        return {...}
    }
    set assetId(v){
        // v === 14728
    }
    set playlistId(v){
        // v === 38101
    }
}
```

### Using Regular expressions in routes

The Router plugin has _built-in_ regular expression support so you can add patterns to your route to start matching for certain
combinations of characters. You do this by adding `${PATTERN/MODIFIERS}` after the dynamic name

```js
// this will match #player/1493847
// but will fail on #player/ah26134
{
    path: 'player/:playlistId${/[0-9]{3,8}/i}',
    component: Player
}
```

### Router hooks

Besides specifying what `component` (i.e. page) to load for each route, you can also bind a _function callback_ to a route
via the `hook` property. This hook will be executed when the specific route is hit.

The first argument of the `hook` function will give you a reference to the `Application`. Any _data_ passed via route parts will
be made available as an object in the second argument.

```js
{
  path: 'settings/hotspots/delete/:hotspotId/:actionId',
  hook: (application, {hotspotId, actionId}) => {
   console.log('do something with', application)
   console.log('or param', hotspotId, actionId)
  }
}
```

### Route options

On a per route basis, you can specify an object with `options`, that influences the Router's behavior for that specific route.

```js
{
    path: 'settings/hotspots/delete/:hotspotId/:actionId',
    options: {
      preventStorage: true,
      clearHistory: true,
      reuseInstance: false
    }
}
```

The available options are:

#### store

Whether or not to store this route in history. Possible values: `true` or `false`. Defaults to `true`.

#### clearHistory

Whether it's own history should be reset when visiting this route. Possible values: `true` or `false`. Defaults to `false`.

### reuseInstance 

When the new hash we navigate to shares the same route and the previous:  `settings/hotspot/12` && `settings/hotspot/22` 
share: `settings/hotspot/:id` the Router will by default re-use the current Page instance. If you want to prevent this
you set `resuseInstance: false`. This [setting](navigation.md) is also globally available.

### Special routes

There are 2 _special_ routes that can be configured in the `routes`-array.

#### Url not found

The `*`-path is used to specify which component to display when an unknown `route-path` is hit.

```js
{
    path: '*',
    component: NotFoundPage,
}
```
#### Error page

The `!`-path is used to specify which component to display as a global error page. The Router plugin attempts
to display this route, whenever a page's [dataprovider](dataproviding.md) returns an error.

```js
{
    path: '!',
    component: ErrorPage
}
```

Next:
[Navigation](navigation.md)
