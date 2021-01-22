# Router

## Deeplinking

The Router plugin has built-in support for deeplinking, which means that your App can be opened at a specific route. This is an important feature, because it allows external sources (such as an operator) to jump straight into the Player Page of your App, for example.

The Lazy creation support in the page router enables to only load what is needed and keep memory usage to a minimum. Also in case of a deeplink, regular dataproviding for a specific route is still executed.

On top of that there is exists the [boot](configuration?id=boot) function that can
handle any general operations that has need to be executed for you App to functon properly.

## Backtracking

When a user enters your App via a deeplink, there is technically no history available. By default this would mean that a back key press will lead to an exit of the app.

On some platforms this is not the expected behaviour. For that reason the Router plugin supports _backtracking_ functionality. When enabled (via the platform setting `router.backtracking`), upon a backpress the router will _recursively_ remove the last part of the hash, until it finds a valid path to navigate to.