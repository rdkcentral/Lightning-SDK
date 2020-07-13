# Router

## Data providing

The Router offers an interface to do `async` API requests to grab data and make it available to the Page.

There are 3 types of data providing callbacks available: `on()`, `before()` and `after()`. You can only use one type of
data providing for each route.

The data providing callbacks are configured in the global routes configuration object. A data providing callback must always return Promise (and `resolve` or `reject` it).

```js
{
    path: 'player/:playlistId/:assetId',
    // page instance and dynamic url data
    // will be available in the callback
    on: (page, {playlistId, assetId}) => {
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
    cache: 60 * 10 // 10 minutes
}
```

Considering the route configuration above, when you navigate to: `localhost:8080/#player/267/173688` via `Router.navigate('player/267/173688');` the router will:

1. Hide the current page (and destroy it to free up memory, if so configured)
2. Show an optional `Loading` Component
3. Wait for the data provider's request to resolve
4. Show the new page attached to route

### Caching data

By specifying a cache property on the route definition, you can control how long the provided date stays valid upon visiting
the same page twice. If the same route is hit within the cache time, the Page will be loaded with the cached data. Otherwise a
new request will be made.

This only applies if the Page still exists in memory.

### Before data provider

The _Before_ data provider works almost the same as the _On_ data provider. The difference is in the way the Pages are loaded.

```js
{
    path: 'settings/wifi/:hotspotId/connect',
    before: (page, {hotspotId})=>{
       return connect(hotspotId)
    },
    cache: 60
}
```

Considering the route definiton above, the Router plugin will:

1. Make the the request
2. Keep the current page visible
3. Wait for the request to resolve
4. Show the new page (and destroy it from memory if configured)

### After data provider

The _After_ data provider also works similar, but follows a slightly different sequence for displaying the old and the new Page

```js
{
    path: 'home/assets/popular',
    after: (page)=>{
       return getPopular();
    },
    cache: 0
}
```

Considering the route definiton above, the Router plugin will:

1. Show (and first create if needed) the new page
2. Hide the old page
3. Do the request


By adding `_onDataProvided() {..}` to you Lightning Component you can listen when the data-providing is ready. This
will not fire when the page is not expired (and loaded from [memory-todo](#))

```js
class Browse extends Lightning.Component{
    static _template(){...}

    _onDataProvided(){
        // do something
    }
}
```

Next:
[Router events](plugins/router/events.md)
