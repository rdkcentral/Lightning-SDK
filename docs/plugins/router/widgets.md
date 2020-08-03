# Router

## Widgets

Widgets are Lightning Component that can live on multiple pages.

>  Widgets overlay the pages as they will always have the highest z-index

In you App's `template`, Widgets need to be placed inside a `Widget` wrapper on the root level of your app. For example:

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

Considering the example above, whenever you do `Router.navigate('discover/player/998/29174')` the `visible`-property of both `Notification` and `StatusBar` will be set to `true`.


### Handling focus

In Lightning key presses are handled by the component that has _focus_ ([handle remote-control keys](https://rdkcentral.github.io/Lightning/docs/focus/keyhandler))

In a routed App, by default the focus is delegated to the current Page. In order to move the focus from the Page to an
active `Widget` , you can use the `focusWidget` method exported by the Router plugin and pass it the _reference_ to the
Widget you want to give focus.

```js
class SearchPage extends Lightning.Component {
   _handleUp(){
       Router.focusWidget('Menu');
   }
}
```

Subsequently you can delegate the focus from a widget back to the active Router page by using the `focusPage` method.

```js
class Menu extends Lightning.Component {
   _handleDown(){
       Router.focusPage();
   }
}
```

Next:
[Settings](settings.md)
