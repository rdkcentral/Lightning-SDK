# Router

## Page Events

In addition to Lightning's default [life-cycle events](https://rdkcentral.github.io/Lightning/docs/components/overview#component-events) the Router plugin provides some extra events your app can listen to.

### _onDataProvided()

When you use [data providing](dataproviding.md) the `_onDataProvided`-method will be invoked when
the `on`, `before` or `after` data provider has resolved.

### _onMounted()

When a Page (Lightning Component) is created by the Router plugin the `_onMounted`-method will be invoked.

### _onChanged()

When a Page instance is being re-used between navigations the `_onChanged` method will be invoked.

For example:

- from `Router.navigate("home/playback/12/10")`
- to `Router.navigate("home/playback/293/99")`
<br /><br />

### _onUrlParams(params)

This will make dynamic url params available to the page.
With the following configuration

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

and we navigate to: Router.navigate('account/12456/56783')

```js
class Account extends Lightning.Component{
  _onUrlParams(params){
      // params => {user: 12456, device:56783}
  }
}
```

### _handleAppClose()

When the Router's history is empty the SDK will continue the handle the back key and close the app. 
You can prevent this by adding `_handleAppClose()` to your Application class, for instance to show
and exit dialog. 

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
## Widget Events ##

### _onActivated(page)

This is an event where your `Widgets` can listen to, it will be called at the moment
that Router changes the visiblity to `true`. The `page` parameter is the reference to the instance
of the page that activated the widget.

Next: [Page transitions](pagetransitions.md)
