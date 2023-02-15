# Router Navigation

Once you've set up the [correct routes](configuration.md) for your app, you can start navigating from one Page to another.

Under the hood, the Router plugin listens for URL hash changes and displays the correct Page accordingly. You should
not change the browser's hash location *directly*, because the implementation might differ between platforms.

## Navigate

The Router plugin provides a `navigate` method which accepts three arguments: `path`, `params` and `store:`

```js
Router.navigate(path, params, store)
```

### path

For example, if you call `Router.navigate('player/1638/17421')` anywhere in your App, the Router starts loading the Player component. It updates the browser location hash accordingly, assuming that the following route is configured:

```js
{
  path: 'player/:assetId/:playlistId',
  component: Player
}
```

### params

If you want to pass *additional data* to the page to which you are navigating, you can supply a *data object* as the second argument of the `navigate` method. For example:

```js
Router.navigate('player/1638', { a: 1, b: 2, from: this } )
```

This loads the Page that is associated with the specified route path, and provides the additional data inside a `params` property on the instance of that Component. For example:

```js
class Player extends Lightning.Component{
    set params(args) {
        // do something with data passed in the navigate
    }
}
```

### store

By default, all visited routes are added to the history stack (unless this feature is disabled in a route's [configuration object](configuration.md#preventstorage)).

To prevent the `navigate` method from adding a Page to the history stack, you pass `false` as a *second* argument:

```js
Router.navigate("player/1638", false)
```

Or, if your second argument is a data object, as a *third* argument:

```js
Router.navigate("player/1638", {a:1, b:2}, false)
```

### keepAlive

If you are navigating from one page to another while the [lazy destroy](settings.md#lazyDestroy) feature is configured, the page from which you navigate is removed from the history stack.

Sometimes, you might want to keep the current page from which you are navigating alive, to go back to it's original state when necessary. To accomplish this, you insert the data parameter `keepAlive: true` in the data object of the `navigate` function. As a result, the current page from which you are navigating remains in the history stack.

For example:

```js
Router.navigate('player/1638', {keepAlive: true, a:1, b:2})
```

## Named Routes

Instead of constructing the hash that you want to navigate to, yourself, it's also possible to let the Router construct the hash.
You do this by adding a `name` property to a `route` object.

```js
{
  path: 'player/:assetId/:playlistId',
  component: Player,
  name: 'player'
}
```

And to `navigate()` to it:

```js
Router.navigate({
     to:"player",
     params:{
         assetId:12, playlistId:44
     }
})
```

This results in: `#player/12/44`

## Optional router path

There might be some cases in which you need a route path with an optional parameter at the end. Normally, you would have to define two different routes to the same component, one with the optional parameter and one without. Starting with Lightning-SDK `v5.3.0`, you can specify an optional router path parameter by adding a `?` suffix to the last parameter name.

Please note that only the last parameter of any path is allowed to be an optional parameter. For example, if you have a route path with three parameters, you can make only the last parameter optional, but not the second parameter.

When we define an optional parameter like this:
```js
{
  path: 'player/:assetId/:playlistId?',
  component: Player
  name: 'player'
}
```

This will generate two paths internally as below:

```js
{
    path: 'player/:assetId/:playlistId'
    component: Player
    name: 'player'
}
{
    path: 'player/:assetId',
    component: Player,
    name: 'player'
}
```

The following example would *not* work because only the last parameter of the path can be optional:

```js
{
  path: 'player/:assetId?/:playlistId',
  component: Player
  name: 'player'
}
```


## isNavigating Method

 You can use the `isNavigating` method to check if the Router is busy processing a request:

```js
Router.isNavigating()
```
This will return a `boolean`.

#### NEXT:
[Data Providing](dataproviding.md)
