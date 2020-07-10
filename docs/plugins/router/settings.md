# Router

## Settings

When you configure routes you always provide it with a Page Class (extended from `Lightning.Component`) and page instance.
This keeps memory usage to a minimum, which can be really beneficial for performance on low-end devices).

Apart from that there are some Router settings that can be configured per platform to decrease the memory footprint even further.

Please note that within the context of the Metrological AppStore these setting are defined as a platform setting _outside_ of the control of the App. You can however experiment with this during local development via `settings.json`.

All router related settings are grouped in a `router`-key within `platform`-settings.

### Lazy creation

When lazy creation is enabled (i.e. `lazyCreate: true`), Pages will not be created until you actually navigate to a route. By default lazy creation is set to `false`. This makes the navigation between pages faster, but takes up more memory.

### Lazy destroy

When lazy destroy is enabled (i.e. `lazyDestroy: true`), Pages will be removed from the render-tree (and thus from memory) when you navigate away from said Page. By default lazy destroy is set to `false`. This makes navigation back to a previous page faster, but takes up more memory.

### Texture garbage collect

To free up texture memory directly after the old page has been destroyed and not wait for Lightning to start collecting garbage (texture) you can set the flag `gcOnUnload: true`. This will force a texture directly after destroying the page.

```json
{
    "appSettings": {
    },
    "platformSettings": {
        "router": {
          "lazyCreate": true,
          "lazyDestroy": false,
          "gcOnUnload": true
        }
    }
}
```
