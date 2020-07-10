# Router

## Widgets

Widgets are Lightning Component that can live on multiple pages.

>  Widgets overlay the pages as they will always have the highest z-index

In you App's `template`, Widgets need to be placed inside a `Widget` wrapper on the root level of your app. For example

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

### Activating widgets

Widgets are hidden by default, but can be made visible per route by adding the property `widgets` to a route definition.
The value of `widgets` should be an `Array` with the `refs` of the widgets to be displayed when that particular route is hit.

```js
{
    path: 'discover/player/:userId/:videoId',
    component: Player,
    // configure widgets should be made visible
    widgets: ['Notification', 'StatusBar']
}
```

Considering the example above, whenever you do `Router.navigate('discover/player/998/29174` the `visible`-property of both `Notification` and `StatusBar` will be set to `true`.


### Handle remote keypresses

### handleRemote()

If we want the widget to [handle remote-control keys](https://rdkcentral.github.io/Lightning/docs/focus/keyhandler)

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
See in [example app](https://github.com/mlapps/router-example-app/blob/94d46738a399703657bf4c17b0ffd442df939b58/src/App.js#L115)

```js
_handleKey(){
    Router.handleRemote("page");
}
```
