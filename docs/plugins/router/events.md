# Router Events

In addition to Lightning's default [life cycle events](../../../lightning-core-reference/Components/LifecycleEvents.md), the Router plugin provides some extra events to which your App can listen. These events are grouped into:

* [Page Events](#page-events)
* [Widget Events](#widget-event)

## Page Events

### _onDataProvided

If you use [Data Providing](dataproviding.md#on-data-provided), the `_onDataProvided` method is invoked when the `on`, `before` or `after` data providing callback has resolved.

### _onMounted

The `_onMounted` method is invoked when the Router creates a Page component.

### _onChanged

The `_onChanged` method is invoked when a Page instance is reused in navigation.

For example:

* from `Router.navigate("home/playback/12/10")`
* to `Router.navigate("home/playback/293/99")`

### _onUrlParams(params)

This event passes dynamic URL parameters to a page.
The configuration is as follows:

```js
export default {
    routes: [
        {
            path: 'account/:user/:device',
            component: Account
        }
    ]
}
```

For example, if you navigate to  `Router.navigate('account/12456/56783')`, the corresponding call is as follows:

```js
class Account extends Lightning.Component{
  _onUrlParams(params){
      // params => {user: 12456, device:56783}
  }
}
```

### _handleAppClose

When the Router's history is empty, the SDK will continue to handle the **Back** key and close the App.

You can prevent this by adding `_handleAppClose()` to your App class, for instance to show an **Exit** dialog:

```js
class MyApp extends Router.App{

  _handleAppClose(params){
      this.toggleExitDialog().then((confirmed)=>{
          // close the application
          if(confirmed){
             this.application.closeApp();
          }
      });
  }
}
```

## Widget Event

### _onActivated(page)

The `onActivated()` event is an event to which the Router widgets can listen. It is called when the Router changes the visibility to `true`. The `page` parameter is the reference to the page instance that activated the widget.

#### NEXT:
[Page Transitions](pagetransitions.md)
