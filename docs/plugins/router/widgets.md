# Router Widgets

Widgets are Lightning Components that can be applied to multiple pages.

> Widgets overlay pages because they always have the highest z-index.

You place widgets inside a `Widgets` wrapper in your App's template, on the *root* level of your App. For example:

```
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

## Activating Widgets

Widgets are hidden by default. You can make them visible for a route by adding the property `widgets` to the route definition.

The value of `widgets` must be an Array that contains the `refs` of the widgets to be displayed when that particular route is hit. For example:

```
{
    path: 'discover/player/:userId/:videoId',
    component: Player,
    // configure widgets should be made visible
    widgets: ['Notification', 'StatusBar']
}
```

If you apply  `Router.navigate('discover/player/998/29174')`, the `visible` property of both `Notification` and `StatusBar` is set to 'true'.

## Handling Focus

In Lightning, key presses are handled by the component that has the *focus* (see [Key Handling](../../../lightning-core-reference/RemoteControl/KeyHandling.md) for more information).

In a routed App, the focus is by default on the currently active page. To move the focus to an
active widget, you can use the `focusWidget` method which is provided by the Router plugin. With this method, you can pass the *reference* to the widget to which you want to give the focus.

```
class SearchPage extends Lightning.Component {
   _handleUp(){
       Router.focusWidget('Menu');
   }
}
```

Similarly, you can delegate the focus from a widget *back* to the active page by using the `focusPage` method:

```
class Menu extends Lightning.Component {
   _handleDown(){
       Router.focusPage();
   }
}
```

## Interaction

A page can *interact* with one of the widgets via the `widgets` property, which is passed to the `page` instance. The widgets can be referenced by their *lowercase reference*. For example:

```
_handleEnter(){
    this.widgets.notification.notify("hello!")
}
```

#### NEXT:
[Settings](settings.md)
