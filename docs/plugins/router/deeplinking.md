# Router

## Deeplinking

The Router plugin has built-in support for deeplinking, which means that your App can be opened at a specific route. This is an important feature, because it allows external sources (an operator for example) to jump straight into the Player Page of your App.

The Lazy creation support in the page router enables to only load what is needed and keep memory usage to a minimum. Also in case of a deeplink, regular dataproviding for a specific route is still executed. On top of that there is exists the [boot](#) function that can
handle any general operations that has need to be executed for you App to functon properly.

## Backtracking

When a user enters your App via a deeplink, there is technically no history available. By default this would mean that a back key press will lead to an exit of the app.

On some platforms this is not the expected behaviour. For that reason the Router plugin support _backtracking_ functionality. When enabled (via the platform setting `router.backtracking`), upon a backpress the router will recursively remove the last part of the hash, until it finds a valid path to navigate to.

## History management

The router maintains it’s own history and does not rely on a browser api, all the routes we have navigated to can end up in history. We don’t keep route duplicates in history, so `#home/player/145` will only be in history once (even if the user navigated to it multiple times) but same route blueprints with different values can live in history, `home/player/178` and `home/player/91737` or `browse/genre/action/50` and `browse/genre/popular/50`

Remote control backpress will check if there are routes in history, pop the last off navigate to that route (invoking the page loading process as discussed before)
