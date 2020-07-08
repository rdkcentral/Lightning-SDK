
# Router

The routhor provides an easy api that helps you create a url driven routed Lightning app.

#### Component types #### 

The router can work with 2 types of data:

- A class that extends `Lightning.Component`

```js
export default class Home extends Lightning.Component {..}
``` 

- A `function` callback

the router accepts *one* `Component` and *multiple* functions per route. 

###### Memory management ######

One of the key features is configurable [lazy creation and destroy](#memory) support (runtime).
this serves as a big help on low-end devices with less memory (RAM / VRAM).

####  Features: #### 
- [Setup](#setup)
- [Add routes](#routes)
- [Navigation helper](#navigation-helper)
- [Route driven data providing](#data-providing)
- [Events](#events)
- [Deeplinking](#deeplinking)
- [Backtracking](#backtracking)
- [Widget communication support](#widget-support)
- [Page transitions](#page-transitions)
- [History management](#history-management)
- [Configurable lazy creation](#lazy-creation)
- [Configurable lazy destroy](#lazy-destroy)
- [Configurable garbage collect](#configurable-texture-garbage-collect)

## Setup:

###### example app ######
We've provided an example app that showcases all the features of the Router:\
https://github.com/mlapps/router-example-app.

You can clone or download this app and use it as the foundation of your app or copy parts of it to your existing app.

#### Use the router ####
import it from the SDK.
```js
import {Router} from 'wpe-lightning-sdk'
```

After the import you can start the router and provide a config object:
###### App.js
```js
Router.add(routes)
```
###### routes.js
```js
import {Home, Browse} from './pages';
export const routes = {
    boot: async (){
        return api.getToken();
    },
    root: 'home',
    routes:[
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

##### We have defined 2 routes #####

The Router provides a function to [`navigate`](#navigation-helper) to a route:

```js
Router.navigate("home")
Router.navigate("home/browse/adventure")
```

1. On navigate to: `127.0.0.1:8080/#home` the Router will show `Home` (a [Lightning Component](#memory))
2. On navigate to: `127.0.0.1:8080/#home/browse/adventure` the Router will show `Browse`

#### boot

`boot()` request will always fire (on deeplink or direct launch) you can use this to obtain tokens for instance.
It must(!) resolve a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

#### root

This is the url where the browser will point to when the app launches (and is not being [deplinked](#deeplinking))

## Routes

You provide an object for each route: 

#### static url's

```js
{
    // this is a static url 
    path: 'some/url/to/component',
    // this is the Component that the router will load
    component: MyComponent 
}
```

#### dynamic urls

Add a `:` before a part of the route to make it dynamic.

```js
{
    path: 'player/:assetId/:playlistId',
    component: Player 
}
```

If you [navigate](#navigation-helper) to: `127.0.0.1:8080/#player/14728/38101`
the router will add the properties `.assetId = 14728` and `.playlistId = 38101` to the instance of the *Player* `Component`

###### setters ######

Or use [setters](#https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) to execute logic
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

#### Regular expressions

The router has built-in regular expression support so you can add patterns to your route
to start matching for certain combinations of characters. You do this by adding `${PATTERN/MODIFIERS}` after the dynamic name 

```js
// this will match #player/1493847
// but will fail on #player/ah26134
{
    path: 'player/:playlistId${/[0-9]{3,8}/i}',
    component: Player 
}
```

Regex patterns work as explained in: [dynamic urls](#dynamic-urls) and their value will be made available on the Page.


#### Routed function calls

You can bind a function call to a route via the `hook` property. Url parameters will be made available in the function.
```js
{
path: 'settings/hotspots/delete/:hotspotId/:actionId',
hook: ({application, hotspotId, actionId})=>{
   console.log("do something with: ", application);
   console.log("or param: ", hotspotId, actionId);
}
```


#### Options

You can configure how the Router should handle this route:

```js
{
    path: 'settings/hotspots/delete/:hotspotId/:actionId',
    options: {preventStorage: true, clearHistory: true}
}
```

###### preventStorage ######

Make sure this route never ends up in history

###### clearHistory ######

Upon visit the Router will clear it's own history.

#### Url not found

Define which `Component` the router must show for unknown url's
```js
{
    path: '*',
    component: NotFound,
}
```
#### Error page
Define one global error page that the router will show on [Data provided error](#data-provider)

```js
{
    path: '!',
    component: Error
}
```

## Navigation helper

Once you’ve set up the correct routes for your app, you can start navigating from one Page (Lightning Component) to another.

#### navigate ####

```js
Router.navigate(url, args, store)
```

- When you call
```js
Router.navigate("player/1638/17421")
```
- the router will match the blueprint: 
```js
{
    path: 'player/:assetId/:playlistId',
    component: Player 
}
```
 
and the the Router will start loading the `Player` Component 

#### arguments
pass arguments to the page by providing an Object as second argument
```js
Router.navigate("player/1638", {a:1, b:2, from: this})
```
This will add the `persist` property on the instance of the Page:

```js
class Player extends Lightning.Component{
    set persist(args){
        // do something with navigate argument
    }
}
```

#### prevent in history ####

By default all visited routes will end up in memory so by explicit providing false as a second argument 
you can prevent the `current` route to end up in history.

```js
Router.navigate("player/1638", false)
```
or as third argument when your second argument is persistent data
```js
Router.navigate("player/1638", {a:1, b:2}, false)
```

## keep alive
By adding `keepAlive` to the arguments you can prevent the current page is [lazyDestroy](#Lazy destroy) is configured.
This way you can maintain the state of the Page.

```js
Router.navigate("player/1638", {keepAlive: true, a:1, b:2}, false)
```

## Data providing

The router offers an interface to do async api requests to grab data and make them available to the page, 
the providers provides 3 page loading types, `on()`, `before()` and `after()`

They must(!) resolve a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

```js
{
    path: 'player/:playlistId/:assetId',
    // page instance and dynamic url data 
    // will be available as params to your callback
    on: ({page, playlistId, assetId})=>{
        return new Promise((resolve, reject)=>{
            // do a request
            doRequest.then((lists)=>{
                // set property on the page
                page.lists = list
                resolve()
            }).catch((e)=>{
                reject(e)
            })
        })
    },
    // time in seconds
    cache: 60 * 10
}
```

so, when you navigate to: `127.0.0.1:8080/#player/267/173688` via `Router.navigate('player/267/173688');`

*the Router will* 
1. hide the current page (and if configured destroy so we can gc textures and memory) 
2. Show the App `Loading` Component. 
3. Wait for the request to resolve.
4. Show the new page attached to route

##### cache

Amount of seconds before page expires. If expired router will do the request, else we load the page. Expect when
we [destroy pages](#memory) for [memory optimizations](#memory)

##### before() / after()
Both work almost the same as `on()`, but the way the page loads is different. 


###### before
```js
{
    path: 'settings/wifi/:hotspotId/connect',
    before: ({page, hotspotId})=>{
       return connect(hotspotId)
    },
    cache: 60
}

```
*the Router will*
1. Do the the request.
2. Keep current page visible
3. Wait for the request to resolve.
4. Show the new page (destory old if configured)

###### after

```js
{
    path: 'home/assets/popular',
    after: ({page})=>{
       return getPopular();
    },
    cache: 0
}
```

*the Router will*
1. Show (and first create if needed) the new page
2. Hide the old page
3. Do the request


By adding `_onDataProvided() {..}` to you Lightning Component you can listen when the data-providing is ready. This
will no fire when page is not expired (and loaded from [memory-todo](#))

```js
class Browse extends Lightning.Component{
    static _template(){...}      
    
    _onDataProvided(){
        // do something
    }
}
```

## Events ##

In addition to Lightning's [life-cycle events](#https://rdkcentral.github.io/Lightning/docs/components/overview#component-events) the Router provides extra events
where your app can listen to: 

```js
class AccountPage extends Lightning.Component{
    
    static _template(){..}
    
    _onDataProvided(){
        // do some logic
    }
}
```

##### _onDataProvided() #####

Will be called when the [data provider](#data-providing) has resolved

##### _onMounted() #####

When the Page (Lightning Component) is created

##### _onChanged() #####

When the Page instance is being re-used: i.e
- from `Router.navigate("home/playback/12/10")` 
- to `Router.navigate("home/playback/293/99")` 

## Widget support

Widgets are Lightning Component that can live on multiple pages. 

>  Widgets overlay the pages they always have the highest z-index

Widgets need to be placed inside a `Widget` wrapper on the root level of your app, 
See in [example app](#https://github.com/mlapps/router-example-app/blob/94d46738a399703657bf4c17b0ffd442df939b58/src/App.js#L42) 

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

##### widget property

###### routes.js
```js
{
    path: 'discover/player/:userId/:videoId',
    component: Player,    
    // configure widgets should be made visible
    widgets: ['Notification', 'StatusBar']
}

```

Widgets are hidden by default, but on `Router.navigate('discover/player/998/29174` `Notification` and 
`StatusBar` `visible` property will be set `true`


#### Handle remote keypresses

##### handleRemote()

If we want the widget to [handle remote-control keys](#https://rdkcentral.github.io/Lightning/docs/focus/keyhandler)

```js
class Search extends Lightning.Component {
   _handleUp(){
       Router.handleRemote("widget", "Menu");
   } 
}
```

If we want to let the page to handle remote-control keys

```js
_handleBack(){
    Router.handleRemote("page");
}
```

or add the following logic to your statemachine (Widget) state if you want auto restore focus 
for keys who are now being handled by the widget.\
See in [example app](#https://github.com/mlapps/router-example-app/blob/94d46738a399703657bf4c17b0ffd442df939b58/src/App.js#L115)

```js
_handleKey(){
    Router.handleRemote("page");
}
```

## Page transitions

By default

```js
pageIn.visible = true;
pageOut.visible = true;
```

You can override this behaviour:

##### default transitions

The Router has a couple of default transitions that you can add to your page: 

-  `Transitions.left` will put the new page on `x:1920` and will do a transition to `x:0`, the old page with do a transition `x:-1920`
-  `Transitions.right` will put the new page on `x:-1920` and will do a transition to `x:0`, the old page with do a transition `x:1920`
-  `Transitions.up` will put the new page on `y:1080` and will do a transition to `y:0`, the old page with do a transition `y:-1080`
-  `Transitions.down` will put the new page on `y:-1080` and will do a transition to `y:0`, the old page with do a transition `y:1080`
-  `Transitions.fade` will do a transition on the new page from `alpha:0` to `alpha:1`
-  `Transitions.crossFade` will do a transitions on the new page from `alpha:0` to `alpha:1` and a transitions from `alpha:1` to `alpha:0` of the old page

You set it by adding a `easing()` method to your Page (Lightning Component)

```js
class SettingsPage extends Lightning.Component {
    static _template(){
        return {...}
    }
    
    easing(){
        return "left";
    } 
}

class PlayerPage extends Lightning.Component {
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

You can provide your own transitions.

##### smoothInOut() #####

Control transition of both new and old page:

You must(!):

- Set `pageIn.visibile = true`
- Resolve a Promise

```js
class BrowsePage extends Lightning.Component {
    static _template(){
        return {...}
    }
    
    smoothInOut(pageIn, pageOut){
      return new Promise((resolve, reject)=>{
              // set the start position properties 
              pageIn.x = 1920
              pageIn.rotation = Math.PI
              
              // toggle visibility
              pageIn.visible = true
              
              // do some transitions
              pageIn.patch({
                  smooth:{x:0, rotation:0}
              })
              
              // resolve promise when transition on x is finished
              pageIn.transition("x").on("finish", ()=>{
                  resolve()
              })
          })  
    }
}
```



##### smoothIn() #####

Provides a simple `smooth()` function that can set a transition on one property

```js
class SearchPage extends Lightning.Component {
    static _template(){
        return {...}
    }    
    smoothIn({smooth, pageIn}){
       // set some start property 
       pageIn.x = 1920;
       // return the call with property, value and arguments.
       return smooth("x", 0, {duration:2}); 
    }
}
```

It will self resolve on finish.


## Memory


De Router works with classes that extend `Lightning.Component` the reason you provide a class and not an instance is
to keep the memory usage to a minimum (which can really can benefit performance on low end devices) 

the router had support for lazy creation and destroy and you can configure them in your `settings.json` file:

*See in [example app](#https://github.com/mlapps/router-example-app/blob/master/settings.json#L23)*.

##### Lazy creation 

Pages will not be created, only when navigate to a route.

```js
"lazyCreate": true
```

##### Lazy destroy

Pages will be removed from the render-tree when you `navigate()` away from the page.

```js
"lazyDestroy": true
```

##### Texture garbage collect

To free up texture memory directly after the old page has been destroyed and not wait for Lightning to start collectionm garbage (texture) you can set the platformsettings flag `gcOnUnload: true`
This will force a texture directly after destroying the page.

```js
"gcOnUnload": true
```

## Deeplinking

The Router support deeplinking, external sources can deeplink to the configured routes.

Deeplinking is an important feature for your app since it will alow external source (An operator’s Ui) to deeplink directly to one of your app’s routes. Due to the lazy creation support in the page router we can keep memory usage to a minimum (only load what is needed)

If your app is not loaded and a Ui changes the url to cdn.operator.ext/yourApp/#home/player/13647/0h57m
the router will put Player component on the render-tree and show (and if there is a data providing route first resolve that)

## Backtracking

```js
"backtrack": true
```

This will let you control how users step out of the app after a deeplink.

Lets say a Ui navigates to: 
```
cdn.operator.ext/yourApp/#home/browse/12746
``` 



that means that (as far as the router is concerned) there is no history, a remote control back press will lead to an exit of the app. 
By changing platform setting backtracking: true, upon backpress after the deeplinking the router will remove the last part of the hash and tests if he can navigate to that url:
cdn.operator.ext/yourApp/#home/browse

if there is a route defined, it will load that route, otherwise strip of more and test again: cdn.operator.ext/yourApp/#home

this lets you model your way out of a deeplink.

## History management

The router maintains it’s own history and does not rely on a browser api, all the routes we have navigated to can end up in history. We don’t keep route duplicates in history, so /home/player/145 will only be in history once (even if the user navigated to it multiple times) but same route blueprints with different values can live in history, home/player/178 and home/player/91737 or browse/genre/action/50 and browse/genre/popular/50

Remote control backpress will check if there are routes in history, pop the last off navigate to that route (invoking the page loading process as discussed before)
