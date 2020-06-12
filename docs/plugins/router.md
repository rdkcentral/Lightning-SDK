
# router

The routhor provides an easy api that helps you create an url driven (routed) app.
By default the loading goes via the hash since we don’t want to encounter a page refresh when a navigation to a route starts. This default behaviour is overridable per platform.

The router can work with 2 types of data,
a child of the Lightning.Component class or a function, the router accepts one Component and multiple function per route. One of the key features is configurable lazy creation and destroy support (runtime) this serves as a big help on low-end devices with less memory and gpu memory

### Features:
- [Add routes](#routes)
- [navigation helper](#navigation-helper)
- [route driven data providing](#data-providing)
- [Dynamic hash value groups](#dynamic-hash-groups)
- [deeplinking](#deeplinking)
- [backtracking](#backtracking)
- [history management](#history-management)
- [route driving function calls](#routed-function-calls)
- [configurable lazy creation](#lazy-creation)
- [configurable lazy destroy](#lazy-destroy)
- [configurable garbage collect]()
- [widget communication support]()
- [page transitions]()

## Installation:

There are 2 ways you can use the router, 
##### 1: import in an existing app 
`import {Router} from 'wpe-lightning-sdk'`

##### 2: create new routed app via cli
`lng create —routed` (work in progress)


## Routes
to create a new route we first import the router from the SDK; import {router} from

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

####modifiers
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

So, lets say we have an search page with route: "search/:query/:limit" and we navigate to: /search/vikings/50 the router will set the query and limit properties on the page instance:
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

## History management

The router maintains it’s own history and does not rely on a browser api, all the routes we have navigated to can end up in history. We don’t keep route duplicates in history, so /home/player/145 will only be in history once (even if the user navigated to it multiple times) but same route blueprints with different values can live in history, home/player/178 and home/player/91737 or browse/genre/action/50 and browse/genre/popular/50

Remote control backpress will check if there are routes in history, pop the last off navigate to that route (invoking the page loading process as discussed before)

## Routed function calls

You can bind multiple function calls to a route (but only one page component)
```js
Router.route("settings/hotspots/delete/:hotspotId", ({page, hotspotId})=>{
  // do something
})
```
The function will be called when we navigate to i.e settings/hotposts/delete/3

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