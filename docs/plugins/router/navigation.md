# Router Navigation

Once you've set up the [correct routes](configuration.md) for your app, you can start navigating from one Page to another.

Under the hood, the Router plugin listens for URL hash changes and displays the correct Page accordingly. You should
not change the browser's hash location *directly*, because the implementation might differ between platforms.

## Navigate

The Router plugin provides a `navigate` method which accepts three arguments: `path`, `params` and `store:`

```js
Router.navigate(path, params, store)
```

### **path**

For example, if you call `Router.navigate('player/1638/17421')` anywhere in your App, the Router starts loading the Player
component. It updates the browser location hash accordingly, assuming that the following route is configured:

```js
{
  path: 'player/:assetId/:playlistId',
  component: Player
}
```

### params

If you want to pass *additional data* to the page to which you are navigating, you can supply a *data object*
as the second argument of the `navigate` method. For example:

```js
Router.navigate('player/1638', { a: 1, b: 2, from: this } )
```

This loads the Page that is associated with the specified route path, and provides the additional data inside
a `params` property on the instance of that Component. For example:

```js
class Player extends Lightning.Component{
    set params(args) {
        // do something with data passed in the navigate
    }
}
```

### store

By default, all visited routes are added to the history stack (unless this feature is disabled in a route's [configuraton object](configuration.md#preventstorage)).

To prevent the `navigate` method from adding a Page to the history stack, you pass
`false` as a *second* argument:

```js
Router.navigate("player/1638", false)
```

Or, if your second argument is a data object, as a *third* argument:

```js
Router.navigate("player/1638", {a:1, b:2}, false)
```

### KeepAlive Parameter

If you are navigating from one page to another while the [lazy destroy](settings.md#lazyDestroy) feature is configured, the page from which you navigate is removed from the history stack.

Sometimes, you might want to keep the current page from which you are navigating alive, to go back to it's original state when necessary. To accomplish this, you insert the data parameter `keepAlive: true` in the data object of the `navigate` function. As a result, the current page from which you are navigating  remains in the history stack.

For example:

```js
Router.navigate('player/1638', {keepAlive: true, a:1, b:2})
```

## isNavigating

At some point, you might want to check if the Router is busy processing a request. You can use the `isNavigating` method for that purpose. This method returns a `boolean`.

```js
Router.isNavigating()
```

#### NEXT:
[Data Providing](dataproviding.md)
