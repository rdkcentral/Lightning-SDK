
# router

The routhor provides an easy api that helps you create an url driven (routed) app.
By default the loading goes via the hash since we don’t want to encounter a page refresh when a navigation to a route starts. This default behaviour is overridable per platform.

The router can work with 2 types of data,
a class that extends `Lightning.Component` or a function, the router accepts one Component and multiple function per route. One of the key features is configurable lazy creation and destroy support (runtime) this serves as a big help on low-end devices with less memory and gpu memory

### Features:
- [Add routes](#routes)
- [Navigation helper](#navigation-helper)
- [Route driven data providing](#data-providing)
- [Dynamic hash value groups](#dynamic-hash-groups)
- [Deeplinking](#deeplinking)
- [Backtracking](#backtracking)
- [Widget communication support](#widget-support)
- [Page transitions](#page-transitions)
- [History management](#history-management)
- [Route driving function calls](#routed-function-calls)
- [Regular Expression support](#regular-expression-support)
- [Configurable lazy creation](#lazy-creation)
- [Configurable lazy destroy](#lazy-destroy)
- [Configurable garbage collect](#configurable-texture-garbage-collect)
- [Settings](#settings)

## Installation:

There are 2 ways you can use the router, 
##### 1: import in an existing app 
`import {Router} from 'wpe-lightning-sdk'`

##### 2: create new routed app via cli
`lng create —routed` (work in progress)


## Routes
to create a new route we first import the router from the SDK; import {router} from 'wpe-lightning-sdk'

next we create a new route, and add a component to it (we will later create an instance by adding it to the lightning render-tree)
```js
Router.route("splash", Splash);
Router.route("home", Home);
```
these are pretty simple one level routes. You can also define deeper nested routes.
```js
Router.route("home/player/", Player)
Router.route("browse/popular", Popular)
```
this translate to the following, if the url is pointing to: 127.0.0.1:8080/#home, the router will load the attached Component or instance (if it’s already created) of Home and 127.0.0.1:8080/#browse/popular to Player.

Besides static routes you can also define dynamic routes:
```js
Router.route("player/:assetId", Player)
Router.route("player/:playlistId/:assetId", Player)
```

127.0.0.1:8080/#player/14728 it wil load and show the instance of Player. The router will invoke the setter assetId on the page instance with the value 14728. This way you can access the dynamic url data in your Lightning Component.

```js
Router.route("*", NotFound)
``` 
will show the NotFound component when the app or an external Ui tries to route to an url thats undefined i.e 127.0.0.1:8080/#non/existing/route

#### modifiers
By providing an object as third argument to the `route()` function you can control the Router behaviour.

```js
// this will prevent this page ending up in router history when the Router unloads that url
Router.route("home/settings", Settings, {preventStorage: true})

```

```js
// this will clear the Router history upon visit
Router.route("home", Home, {clearHistory: true})

```
---
By default the router is not storing the same hash in history twice so when navigating twice to #home/player/143221 the router will only store the hash once (so we won't navigate to it twice when we're stepping back  in history. By setting storeSameHash:true you can override this behaviour and force the same hash to end up in memory multiple times.
```js
Router.route("home/player/:playerId", Settings, {storeSameHash: true})
```

## Navigation helper

Once you’ve set up the correct routes
for your app, you can start navigating from one page (Lightning Component) to another.

first you import {Router } from sdk
```js
Router.navigate(url, args, store)
```
---
When you call
```js
Router.navigate("player/1638")
```
the router will match the blueprint: `Router.route("player/:assetId", Player)` and the the Router will
start the page loading process, and load the Player Component 

---

```js
// pass arguments to the page by providing an Object as second argument
Router.navigate("player/1638", {a:1, b:2, from: this})
```
This will add the `persist` property on the instance of the Page, so you could add a setter
to the Page class and do something with the persisten data:

```js
class Player extends Lightning.Component{
    set persist(args){
        // do something with navigate argument
    }
}
```
---
By default all visited routes will end up in memory so by explicit providing false as a second argument you can prevent the current route to end up in history.
```js
Router.navigate("player/1638", false)
```

or as third argument when your second argument is persistent data
```js
Router.navigate("player/1638", {a:1, b:2}, false)
```


## Data providing

The router offers handlers to do some async api requests to grab data and make them available to the page, the providers provides 3 page loading types, on() before() after()
```js
Router.on(route, cb, expireTime)
```

```js
// page instance and dynamic url data 
// will be available as params to your callback
Router.on("player/:playlistId/:assetId", async ({page, playlistId, assetId}=>{
  const data = api.getPlaylistById(playlistId);
return data.json()
}, 10 * 60)
```
so, when you navigate to: 127.0.0.1:8080/#player/267/173688

the router will hide the current page (and if configured destroy so we can gc textures and memory) show a by the app provided loading Component. Next we wait for the provided request to resolve (cb always needs to return a Promise) and show the new page attached to route
```js
Router.route("player/:playlistId/:assetId", Player)
```
So Player in this case the Player Component (page) will be created and added to the render-tree

We’ve also added an expire time, so if we navigate to the same page again within 10 minutes we would directly load the page, otherwise we would request the data again, wait for it to resolve and show the page. No expire time will always do a new request on load.

Also, we we load the page again but the with a different route: so,127.0.0.1:8080/#player/44/817 instead of 127.0.0.1:8080/#player/267/173688 the router will do the async request / shows loader / cleanup old page and when request resolves show new Component

#### before() / after()
Both work almost the same as on(), but the way the page loads is different. 
```js
Router.before("home/browser/:sectionId", ({page, sectionId})=>{
  return getSection(sectionId)
})
```
will first do the async request and keeps the old page visible. When the promise resolves the router will show the new page and hide the old (and optional destroy for memory and performance) this way you can show an in page loading component when a user selects an item.
```js
Router.after("home/browser/:sectionId", ({page, sectionId})=>{
  return getSection(sectionId)
})
```
will show (or create and show) the new page, after page transition is ready the router will do the request 

So a thing they all share is that they support async request and dynamic url
data will be made available as properties to the page (tip, use setters)

## Dynamic hash groups

There is a lot of usefull data available in the url that will be made available to the page.

So, lets say we have an search page with route: 

```js
Router.route("search/:query/:limit", Search)
````

and we navigate to: 

```js
Router.navigate("/search/vikings/50")
``` 

the router will set the `query` and limit `properties` on the page instance:

```js
class Search extends Lightning.Component{
 set query(v){
   this._query=v;
 }
 set limit(v){
   this._limit = v;
 }
}
```
## Deeplinking

Deeplinking is an important feature for your app since it will alow external source (An operator’s Ui) to deeplink directly to one of your app’s routes. Due to the lazy creation support in the page router we can keep memory usage to a minimum (only load what is needed)

If your app is not loaded and a Ui changes the url to cdn.operator.ext/yourApp/#home/player/13647/0h57m

the router will put Player component on the render-tree and show (and if there is a data providing route first resolve that)

## Backtracking

This features is requested by some content providers, they want to allow deeplinking to a page but still control the path back out of the app.

Lets say a Ui navigates to: cdn.operator.ext/yourApp/#home/browse/12746 that means that (as far as the router is concerned) there is no history, a remote control back press will lead to an exit of the app. By changing platform setting backtracking: true, upon backpress after the deeplinking the router will remove the last part of the hash and tests if he can navigate to that url:
cdn.operator.ext/yourApp/#home/browse

if there is a route defined, it will load that route, otherwise strip of more and test again: cdn.operator.ext/yourApp/#home

this lets you model your way out of a deeplink.

## Widget support

The page router has support for widgets. Widgets are Lightning Component that can live on multiple pages. 

>  Widgets overlay the pages they always have the highest z-index

Widgets need to be placed inside a `Widget` wrapper on the root level of your app: 

```js
static _template(){
    return {
        Pages: {
            // this hosts all the pages
            forceZIndexContext: true
        },
        Widgets:{
            // this hosts all the widgets
            Menu:{
                type: Menu
            },
            Notification:{
                type: Notification
            },
            StatusBar:{
                type: Status
            }
        }
    }
}
```

By default when you run your app all the widgets attached to the render-tree will be hidden `widgetInstance.visible = false`

Let's say we've configured the following routes for our app: 

```js
Router.route("splash", Splash);
Router.route("home", Home);
Router.route("home/player", Player);
Router.route("browse/popular", Popular);
```

and you want to show the you want to show the `Menu` and the `StatusBar` on the `Home` and `Player` page

```js
Router.widget("home", ["Menu", "StatusBar"]);
Router.widget("home/player", ["Menu", "StatusBar"]);
``` 

This will make sure the visibility of `Menu` and `StatusBar` widget will be set to `true` when you do a 
`Router.navigate("home/player")` or `Router.navigate("home")`. Both will be hidden when you do a `Router.navigate("browse/popular")`

#### Handle remote keypresses

After you've configured the visibility of the widgets for your routes you may want to delegate focus to a widget so that
it can start listening to remote control keypresses.

>The focus path is determined by calling the _getFocused() method of the app object. By default, or if undefined is returned, the focus path stops here and the app is the active component (and the focus path only contains the app itself). When _getFocused() returns a child component however, that one is also added to the focus path, and its _getFocused() method is also invoked. This process may repeat recursively until the active component is found. To put it another way: the components may delegate focus to descendants.

Since the `Widgets` are not decendants of `Page` we need to a helper function to hand-over focus to a widget (so it can start listening to the remote control)

So, let's say we're on the `Home` page and upon remote control up we want to delegate focus to our `Menu` widget, we can do:

```js
_handleUp(){
    Router.focusWidget("Menu")
}
```

Now our `Menu` component is listening and consuming the remote control events. 

If we want the page that we got focus from to continue listening to the remote control on `Back press` we can simply restore focus:

```js
_handleBack(){
    Router.restoreFocus();
}
```

or add the following logic to your statemachine (Widget) state if you want auto restore focus for keys who are now being handled
by the widget.

```js

_handleKey(){
    restoreFocus();   
}
```

##### Page widget interaction

References to the widgets are made available to the page via the property `.widget` so inside your method you can access them

```js
this.widgets.menu.doSomething();
this.widgets.statusbar.updateWifiSignal();
```

All references are lowercase:

```js
Widgets:{
    // accessible via: this.widgets.menu
    Menu:{
        type: Menu
    },
    // accessible via: this.widgets.notification
    Notification:{
        type: Notification
    },
    // accessible via: this.widgets.statusbar
    StatusBar:{
        type: Status
    }
}
```




## Page transitions

By default a transition from one page to a new page will be a simple toggle of the visibility:

```js
pageIn.visible = true;
pageOut.visible = false;
```

You can override this behaviour in a couple of ways: 

##### default transitions

The Router has a couple of default transitions that you can add to your page: 

-  `Transitions.left` will put the new page on `x:1920` and will do a transition to `x:0`, the old page with do a transition `x:-1920`
-  `Transitions.right` will put the new page on `x:-1920` and will do a transition to `x:0`, the old page with do a transition `x:1920`
-  `Transitions.up` will put the new page on `y:1080` and will do a transition to `y:0`, the old page with do a transition `y:-1080`
-  `Transitions.down` will put the new page on `y:-1080` and will do a transition to `y:0`, the old page with do a transition `y:1080`
-  `Transitions.fade` will do a transition on the new page from `alpha:0` to `alpha:1`
-  `Transitions.crossFade` will do a transitions on the new page from `alpha:0` to `alpha:1` and a transitions from `alpha:1` to `alpha:0` of the old page

You attach it to a page by adding a `easing()` method to your Page Class and let the
function return on of the Transitions properties: 

```js
class Settings extends Lightning.Component {
    static _template(){
        return {...}
    }
    
    easing(){
        return "left";
    } 
}

class Player extends Lightning.Component {
    static _template(){
        return {...}
    }
    
    easing(){
        return "crossFade";
    } 
}

```

the default transitions will impact both new and the old page (if there is one)

#### custom transitions

It is possible to tweak the smoothing of both pages (old, new) exactly how you want to, this can be controlled by adding a new method to your class:

```js

class Browse extends Lightning.Component {
    static _template(){
        return {...}
    }
    
    smoothInOut(pageIn, pageOut){
        // 
    }
}

```

this gives you full control of the transition and visibility process, so it's your job to toggle visibility of the new page, do some transitions with the arguments
`PageIn` (instance of the new page you've navigated to) and the `PageOut` (instance of old page that stated the navigation cycle). A `SmoothInOut` always needs to resolve a `Promise`
so the `PageRouter` knows the transtion is finished and and it can start cleaning up the old page.


```js
smoothInOut(pageIn, pageOut){
    return new Promise((resolve, reject)=>{
        // set the start position properties 
        pageIn.x = 1920;
        pageIn.rotation = Math.PI;
        
        // toggle visibility
        pageIn.visible = true;
        
        // do some transitions
        pageIn.patch({
            smooth:{x:0, rotation:0}
        });
        
        // resolve promise when transition on x is finished
        pageIn.transition("x").on("finish", ()=>{
            resolve();
        })
    })
}
```

or use `smoothIn()`, this will return a prepared smoothing function (that automatically resolves) and will only
affect the new page. The old page will simply be removed or hidden after it's automatically resolves. the `smooth` is 
wrapper function that performs a transition on one property of the new page, creates a finish listener and auto resolves the Promise.

```js
smoothIn({smooth, pageIn}){
   // set some start property 
   pageIn.x = 1920;
   // return the call with property, value and arguments.
   return smooth("x", 0, {duration:2}); 
}
```

## History management

The router maintains it’s own history and does not rely on a browser api, all the routes we have navigated to can end up in history. We don’t keep route duplicates in history, so /home/player/145 will only be in history once (even if the user navigated to it multiple times) but same route blueprints with different values can live in history, home/player/178 and home/player/91737 or browse/genre/action/50 and browse/genre/popular/50

Remote control backpress will check if there are routes in history, pop the last off navigate to that route (invoking the page loading process as discussed before)

Some of the Router's functions let you control the history management: 

#### route()

If you want to prevent a route from ending up in history, you can add `preventStorage: true` to arguments
when you define the routes for the App.

```js
Router.route("Home/browse/:sectionId", Browse, {preventStorage: true})
```

By default the router will not store a hash that has been visited multiple times, 
so if the user is navigating to, 127.0.0.1:8080#home/search twice, it will only end up in the history once. So upon navigating 
back in history the Router will not load the same page (with same hash) twice. By adding `storeSameHash: true` to the arguments
the router will store multiple in history (the hash, so: "home/search")

```js
Router.route("home/search", Search, {storeSameHash: true})
```

##### Same hash

Let's say we've configured the following route: 

```js
Router.route("Home/browse/:sectionId", Browse)
```

Then the Router doesn't consider `Home/browse/1635454"` and `Home/browse/11928374` to be the same route,
so they both will by default end up in history.


##### navigate()

By default the Router will destroy the old Page when you navigate from page A to B, so a navigate from
a Browse page to Player page via: 

```js
Router.navigate("home/browse/1223/play/1h55s")
```

Will remove the `Browse` page from memory, if you want to prevent this in certain situations, you 
can add a `keepAlive` signal to the navigation arguments object.

```js
Router.navigate("home/browse/1223/play/1h55s", {keepAlive: true})
```


##### destroy on history step

Another posibility is to configure the Router that it only remove a page from memory when it gets unloaded 
via a step back in history. You can do this by adding, `"destroyOnHistoryBack":true` to the
platform settings.


## Routed function calls

You can bind multiple function calls to a route (but only one page component)
```js
Router.route("settings/hotspots/delete/:hotspotId", ({page, hotspotId})=>{
  // do something
})
```
The function will be called when we navigate to i.e settings/hotposts/delete/3

## Regular Expression support

The router has built-in regular expression support so you can add patterns to your route
to start matching for certain combinations of characters.

Adding regular expression to a route works in addition to the [dynamic hash value groups](#dynamic-hash-groups).
by adding `${PATTERN/MODIFIERS}` after the dynamic name 

```js
// this will match #player/1493847
// but will fail on #player/ah26134
Router.route("player/:playlistId${/[0-9]{3,8}/i}", Player)
```

Also, regex patterns are named, and their value will be made available on the Page instance following
the same rules as [dynamic hash value groups](#dynamic-hash-groups)


## Lazy creation 

To keep the memory usage to a minimum (which can really can benefit performance on low end devices) the router had support for lazy creation and destroy. An instance of your page (Lightning Component) will not be created (and appended to the render tree if a user hasn’t visited the corresponding route (thats the reason we attach classes to each route instead of an instance thats already part of the render-tree.

So by setting: lazyCreate: true, no page will be added in memory (and rendertree)
```js
Router.route("home/settings/wifi", WifiControl)
```
so when you navigate to home/settings/wifi, the router will test if the page is already an instance, if it’s not an instance of Lightning Component the router will create an instance and add it to the render-tree.

## Lazy destroy

Next to lazy creation you have the option to configure lazy destroy by setting, lazyDestroy: true. By using the platform settings the platform can override this (for performance reasons on a low end box)

Lazy destroy means, when we navigate to a new route we remove the page from the render-tree to free up memory and invalidate textures so the Lightnigs textures garbage collector can start freeing up memory

## Configurable texture garbage collect

To free up texture memory directly after the old page has been destroyed and not wait for Lightning to start collectionm garbage (texture) you can set the platformsettings flag `gcOnUnload: true`

This will force a texture directly after destroying the page.

## Settings 

The `settings.json` file let's you configure Router behaviour:

```json
{
  "appSettings": {
    "stage": {
      "clearColor": "0x00000000",
    },
    "debug": false,
  },
  "platformSettings": {
    "disableTransitions": false,
    "backtracking": false,
    "lazyCreate": true,
    "lazyDestroy": true,
    "destroyOnHistoryBack": true,
    "gcOnUnload": true,
    "reuseInstance": true
  }
}
```

##### disableTransitions
This will override all custom page transitions and replace them with a simple visibility toggle:

```json
pageIn.visible = true;
pageOut.visibile = false;
```

##### backtracking 

Configure if the Router needs to do [Backtracing](#backtracking) when a Ui is deeplinking to a route

##### gcOnUnload

Force a texture garbage collect directly after removing the page from the render-tree

##### lazyCreate

If set to `true` the Router will not create instances of the configured pages, but will only create them
when you navigate to a Route. Setting it to `false` will create all the pages on boot and append
them to the render-tree

##### lazyDestroy

If set to `true` the Router will remove the page from the render-tree when we navigate away from a Page. 
Setting it to `false` will keep the instance in memory and appended to the render-tree.

##### destroyOnHistoryBack

This let's you configure if you want to remove pages from memory when the unloading and navigation process
is driven by a step back in history and `lazyDestroy:false`










