# Deeplinking

The Router plugin has built-in support for *deeplinking*, which means that your App can be opened at a *specific* route.

Deeplinking is an important feature, because:

* It allows external sources (such as operator) to go directly to your App's *Player* page (for example).
* The [lazy creation](settings.md#lazyCreate) support in the page Router enables you to *only* load what is needed and keep memory usage to a minimum.
* Regular data providing for a specific route is still executed.
* The configuration object's [boot](configuration.md#boot) key handles any general operations to be executed for a proper functioning of your App.

## Backtrack

When a user enters your App via a deeplink, there is technically *no* history available. By default, this would mean that a **Back** key press leads to exiting the App.

On some platforms, this is not the desired behavior. For that reason, the Router plugin supports the *[backtrack](settings.md#backtrack)* functionality.

When this feature is enabled (via the Platform Setting  `Router.backtrack`) and the **Back** key is pressed, the Router will *recursively* remove the last part of the hash, until it finds a valid path to navigate to.

#### NEXT:
[History](history.md)
