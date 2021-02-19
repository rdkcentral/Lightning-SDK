# Router Settings

When you configure routes, you always provide them with a *Page class* (extended from `Lightning.Component`) and a *Page instance*.
This keeps memory usage to a minimum, which can be beneficial for performance on low-end devices.

To decrease the memory footprint even further, you can configure specific Router settings per platform.

> Within the context of the [Metrological Dashboard](http://dashboard.metrological.com/), these settings are defined as Platform Settings *outside* the App's control. However, during local development, you can experiment with them using the **settings.json** file. All Router-related settings are grouped in a `Router` key within `platformSettings`.

For example:

```json
{
    "appSettings": {
    },
    "platformSettings": {
        "Router": {
          "lazyCreate": true,
          "lazyDestroy": true,
          "gcOnUnload": true,
          "backtracking": true,
          "reuseInstance": false,
          "destroyOnHistoryBack": false,
          "stats": false
        }
    }
}
```

The settings are described below.

### lazyCreate

If you enable *Lazy Creation* by setting `lazyCreate` to 'true', pages are not created until you actually *navigate* to a route.

By default, Lazy Creation is *disabled*. This results in faster navigation between pages, but is also more memory-consuming.

### lazyDestroy

If you enable *Lazy Destroy* by setting `lazyDestroy` to 'true', pages from which you navigate, are removed from the [Render Tree](../../../lightning-core-reference/RenderEngine/RenderTree.md) (and thus from memory).

By default, Lazy Destroy is *disabled*. This results in faster navigating back to a previous page, but also is more memory-consuming.

### gcOnUnload

If you want to free up texture memory *directly* after a previous page has been destroyed and you do not want to wait for Lightning's (texture) garbage collection, you can set `gcOnUnload` to 'true'. This forces a texture garbage collect directly after destroying the page.

### backtracking

If you want to enable *backtracking* in your app, you set `backtracking` to 'true'.

### destroyOnHistoryBack

If you want to remove a page from memory *only* when it is unloaded after doing a step back in history  (see [Router History](history.md#back) for more information), you can set `lazyDestroy` to 'false' and `destroyOnHistoryBack` to 'true'.

### updateHash

If you do *not* want the Router to update the hash on a `navigate`, you can set `updateHash` to 'false'.

### reuseInstance

If you navigate to a new hash that shares the same route and the previous `settings/hotspot/12` and `settings/hotspot/22`
share the blueprint `settings/hotspot/:id`, the Router *reuses* the current Page instance by default.

If you want to prevent this, you can set `reuseInstance: false`. This can be overridden per route via the [Route Options](configuration.md#route-options).

### stats

If you enable `stats `(it is *disabled* by default), the Router tracks page view information and add this to a global
statistics report.

#### NEXT:
[Deeplinking](deeplinking.md)
