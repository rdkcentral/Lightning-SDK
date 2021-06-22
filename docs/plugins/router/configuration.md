# Router Configuration

The Router plugin can be configured by passing a *configuration object* to the `Router.startRouter()` method. This method is typically called in the `_setup`[lifecycle event](../../../lightning-core-reference/Components/LifecycleEvents.md)  in **App.js**.

The configuration object can contain six different *keys*, each of which is described below:

* [root](#root)
* [boot](#boot)
* [bootComponent](#bootcomponent)
* [beforeEachRoute](#beforeeachroute)
* [afterEachRoute](#aftereachroute)
* [routes](#routes)

> It is recommended to specify the Router configuration in a separate file: **src/routes.js**.

##  Keys

### root

The `root` key indicates which route path must be used as *entry point* of your App if *no* location hash is specified
in the URL.

The value of `root` should be a *String*, or a *function* that returns a *Promise* that resolves to a String.
The value must match the *path* of one of the defined routes.

Typically, you either specify the path to a **Splash** or **Home** page as `root`:

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

or you specify a function:

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

In the examples above, if you open your App, the Router plugin navigates to  `localhost:8080#splash` (where the port '8080' serves as an example) and subsequently displays the **Splash** page.

### boot

The `boot` key provides the ability to execute functionality *before* the Router loads the first page. For example, this key can be applied to obtain API tokens.

If so required, you can specify a *function*  in the `boot` key of the configuration object. This function must return a *Promise*. If the Promise resolves, the Router initiates the navigation process.

The `boot` function is not only executed when you open the root of your App, but is also invoked when you open
a [deeplinked](deeplinking.md) location in the App.

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

The `querystring` (`qs`) is passed as an *object*.
For example, if you point the browser to: `localhost:8080#splash?deviceId=1801&amp;partnerId=145`, the corresponding code looks like this:

```js
export default {
    boot: (qs) => {
        // qs => { deviceId: '1801', partnerId: '145' }
        return Promise.resolve()
    }
}
```

### bootComponent

If you want to display a **Splash** or **Loading** screen while the Router is booting (and *before* the actual routing process kicks in), you can specify a Lightning Component in the `bootComponent` key of the configuration object.

The component is not only displayed when you open the root of your App, but also when you open a [deeplinked](deeplinking.md) location in the App.

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

> Since the `boot` component might show an animation that takes some time to finish, the Router plugin does not hide
the `boot` component automatically. Instead, you have to *explicitly* call `Router.resume()` in your `boot` component to give control back to the Router plugin.

### beforeEachRoute

The `beforeEachRoute` key is a global hook that is invoked right after starting a `navigate` to a route.

Based on the `from` and `to` parameters that are passed by the Router to the hook, you can decide to *continue*, *stop* or *redirect* the `navigate`.

The hook must resolve to a *Promise*. If it resolves to `true`, the Router continues the process. If it resolves to `false`, the process is aborted.

```js
{
    ...
    routes:[...],
    beforeEachRoute: (from, to)=>{
        return new Promise((resolve)=>{
             if(to === "home/account" && auth){
                 resolve(true)
             }
        })
    }
}
```

You can also redirect the `navigate` by returning a *String*. The Router will then try to navigate to the provided hash.

```js
{
    ...
    routes:[...],
    beforeEachRoute:  async (from, to)=>{
        if(to === "play/live/123" && !auth){
            return "account/create";
        }
    }
}
```

If you want to pass parameters, the hook must return an *object*:

```js
{
    ...
    routes:[...],
    beforeEachRoute:  async (from, to)=>{
        if(to === "play/live/123" && !auth){
            return {
                path:"account/create",
                params:{
                    msg: "Not authenticated",
                    pageFrom: from
                }
            }
        }
    }
}
```

> See [Navigation](navigation.md) for more information about the parameters that are passed to the page.

## afterEachRoute

Is a global hook that will be called after every succesfull `navigate()` request. The parameter is the resolved
request object.

```js
{   
    ...
    routes:[...],
    afterEachRoute:  (request)=>{
        updateAnalytics("loaded", request.hash)
    }   
}
```

### routes

The `routes` key is an Array of route definition items. Each item represents a route path that the App should listen to. It specifies which Page component should be displayed when that route is hit.

Although you can define your `routes` object directly inside your **App.js**, it is recommended to specify your routes in a separate **routes.js** file. For example:

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

## Dynamic Routes

So far, we have only specified *static* route paths (for example, `home/browse/adventure`). But the Router plugin also supports *dynamic* routes.

You can make a route part dynamic by prefixing it with `:` as shown in the following example:

```js
{
  path: 'player/:assetId/:playlistId',
  component: Player
}
```

For example, this route now matches  `localhost:8080#player/27/286`. It also provides the data from the specific route (i.e., `assetId` and
`playlistId`).

## Accessing Data From Route Components

If you [navigate](#navigation-helper) to: `127.0.0.1:8080/#player/14728/38101`

the router will add the properties `.assetId = 14728` and `.playlistId = 38101` to the params property of the instance of the *Player* `Component`.

You can also use [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) to execute logic when the properties are being set.

```js
class Player extends Lightning.Component {
    static _template(){
        return {...}
    }
    set params(args){
        // args.assetId === 14728 && args.playlistId === 38101
    }
}
```

## Using Regular Expressions in Routes

The Router plugin has built-in *regular expression support*, so you can add patterns to your route to have it matched with certain combinations of characters.

You do this by adding `${PATTERN/MODIFIERS}` after the dynamic name. For example:

```js
// this will match #player/1493847
// but will fail on #player/ah26134
{
    path: 'player/:playlistId${/[0-9]{3,8}/i}',
    component: Player
}
```

## Component Property

The `component` property can be a *Lightning Component* (i.e., a class that extends the `Lightning.Component`) or a *function* that returns a [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports). For example:

```js
// component
{
    path: 'home/browse/adventure',
    component: Browse
}
```

```js
// dynamic import
{
    path: 'home/browse/adventure',
    component: ()=>{
        return import("../pages/browse.js")
    }
}
```

## Router Hooks

Besides specifying which component (for example, a page component) must be loaded for each route, you can also bind a *callback function* to a route via the `hook` function. This function is executed when the specific route is hit.

The *first* argument of the `hook` function is a reference to the `application`.

Any data that are provided via route parts, are passed in an object in the *second* argument. For example:

```js
{
  path: 'settings/hotspots/delete/:hotspotId/:actionId',
  hook: (application, {hotspotId, actionId}) => {
   console.log('do something with', application)
   console.log('or param', hotspotId, actionId)
  }
}
```

## Route Options

For specific routes, you can specify an object that contains `options` to influence the Router's behavior for those routes. These are:

* [preventStorage](#preventstorage)
* [clearHistory](#clearhistory)
* [reuseInstance](#reuseinstance)
* [beforeNavigate](#beforenavigate)

For example:

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

### preventStorage

Indicates whether or not to prevent a route from storage in history. Possible values: `true` or `false` (default).

### clearHistory

Indicates whether or not to reset the history of a route when that route is visited. Possible values: `true` or `false` (default).

### reuseInstance

Indicates whether or not to reuse the current Page instance. Possible values: `true` (default) or `false`.

When the new hash that you navigate to, shares the same route and the previous:

`settings/hotspot/12` &amp;&amp; `settings/hotspot/22`
share: `settings/hotspot/:id`,

the Router reuses the current Page instance by default.

If you want to prevent this, you set `reuseInstance: false`. This [setting](settings.md#reuseinstance) is also globally available.

### beforeNavigate

This is a local hook that you can specify for a specific route, and is invoked right before the Router navigates to that route.
It follows the same rules as the [global ](#beforeeachroute) hook `beforeEachRoute`. For example:

```js
{
    path: 'player/:playlistId${/[0-9]{3,8}/i}',
    component: Player,
    beforeNavigate:(from)=>{
        return new Promise((resolve)=>{
             if(from === "home/browse/adventure"){
                 resolve(true)
             }
        })
    }
}
```

## Special Routes

There are two *special* routes that can be configured in the `routes` Array, and are *not* added to the history stack. These special routes are:

* [NotFoundPage](#notfoundpage)
* [ErrorPage](#errorpage)

### NotFoundPage

The `*` path indicates which Page component must be displayed when an *unknown* route path is hit (i.e., URL not found):

```js
{
    path: '*',
    component: NotFoundPage,
}
```

### ErrorPage

The `!` path indicates which Page component must be displayed as a *global error page*.

The Router displays this route when the [data provider](dataproviding.md) of a page returns an error. For example:

```js
{
    path: '!',
    component: ErrorPage
}
```

#### NEXT:
[Navigation](navigation.md)
