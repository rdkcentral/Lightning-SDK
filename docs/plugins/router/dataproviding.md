# Data Providing

The *Data Providing* interface of the Router plugin enables you to execute *asynchronous API requests* to grab data and make this data available to a certain Page.

The following three types of data providing callbacks are available for this purpose:

* [on()](#on)
* [before()](#before)
* [after()](#after)

You can only use *one* data providing callback type for each route.

The data providing callbacks are configured in the *global* configuration object of the routes.

> A data providing callback must always return a *promise* (which either *resolves* or *rejects*).

## Callback Functions

### on

The `on` data provider shows the Loader, performs the data request, hides the Loader and displays the new page. For example:

```js
{
    path: 'player/:playlistId/:assetId',
    // page instance and dynamic url data
    // will be available in the callback
    on: (page, {playlistId, assetId}) => {
        return new promise((resolve, reject)=>{
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
    cache: 60 * 10 // 10 minutes
}
```

If you navigate to: `localhost:8080/#player/267/173688` via `Router.navigate('player/267/173688');`, the Router performs the following subsequent actions:

1. Hide the current page (and destroy it to free up memory, if so configured)
2. Show a `Loading` Component (optional)
3. Wait for the data provider's request to resolve
4. Show the new page attached to the route

### before

The `before` data provider works similar to the `on` data provider. They only differ in the way that pages are loaded. For example:

```js
{
    path: 'settings/wifi/:hotspotId/connect',
    before: (page, {hotspotId})=>{
       return connect(hotspotId)
    },
    cache: 60
}
```

The Router plugin performs the following actions:

1. Make the request
2. Keep the current page visible
3. Wait for the request to resolve
4. Show the new page (and destroy it from memory, if so configured)

### after

The `after` data provider works similarly, but follows a slightly different sequence for displaying the old and the new Page. For example:

```js
{
    path: 'home/assets/popular',
    after: (page)=>{
       return getPopular();
    },
    cache: 0
}
```

The Router plugin performs the following actions:

1. Show (if necessary, first create) the new page
2. Hide the old page
3. Perform the request

### `cache` Property

By specifying a `cache` property in the route definition, you can control how long the provided date stays valid if the same page is visited twice. If the same route is hit within the specified cache time, the page is loaded with the cached data. Otherwise, a
new request will be made.

> This only applies if the page still exists in memory.

### onDataProvided

The `_onDataProvided` method is invoked when the `on`, `before` or `after` data providing callback has resolved.

By adding `_onDataProvided() {..}` to your Lightning Component, you can listen when the data providing is ready.

This will not fire when the page is not expired (and loaded from memory).

```js
class Browse extends Lightning.Component{
    static _template(){...}

    _onDataProvided(){
        // do something
    }
}
```

#### NEXT:
[Router Events](events.md)
