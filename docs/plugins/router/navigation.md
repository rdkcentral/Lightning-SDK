# Router

## Navigation

Once you've set up the [correct routes](configuration) for your app, you can start navigating from one Page to another.

Under the hood the Router plugin listens for URL hash changes, and displays the correct Page based on that. However you should
not directly change the browsers hash location, because the implementation might differ between platforms.

Instead the Router plugin exposes a `navigate` method, that accepts 3 arguments.

```js
Router.navigate(path, params, store)
```

For example when you call `Router.navigate('player/1638/17421')` anywhere in your app, the Router will start loading the Player
component and update the browser location hash accordingly, assuming the following route is configured.

```js
{
  path: 'player/:assetId/:playlistId',
  component: Player
}
```

### Passing data

Sometimes you want to pass on additional data to the page you are navigating to. You can do this by supplying an `object`
as the second argument of the `navigate` method.

```js
Router.navigate('player/1638', { a: 1, b: 2, from: this } )
```

This will load the Page associated with this route-path, and additionally it will make available the data inside
a `params` property on the instance of that Component.

```js
class Player extends Lightning.Component{
    set params(args) {
        // do something with data passed in the navigate
    }
}
```

### Prevent storing in history

By default all visited routes will end up in memory (unless the route already turned this off in the
[configuraton object](configuration?id=store)).
If you don't want a particular `navigate` to cause a Page to end up in the history stack, you can prevent this by passing
`false` as a second argument.

```js
Router.navigate("player/1638", false)
```

Or as third argument when your second argument is a data object

```js
Router.navigate("player/1638", {a:1, b:2}, false)
```

## Keep alive

When [Lazy destroy](settings?id=lazy-destroy) is configured, whenever you navigate from one page to another the _old_ page is destroyed.

In some cases you might want to keep that page around, in order to go back to it in the original state. If you add `keepAlive: true` as one of the data parameters, the _current_ page you are navigating _from_ will remain in memory.

```js
Router.navigate('player/1638', {keepAlive: true, a:1, b:2})
```

## Named routes

Instead of constructing the hash you want to navigate to yourself it's also possible to let the Router construct the hash. 
You do this by adding a `name` property a `route` object.

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


### isNavigating()

To check if the Router is processing a Request you can call: 

```js
Router.isNavigating()
```

This will return a `boolean`

Next:
[Data providing](dataproviding.md)

