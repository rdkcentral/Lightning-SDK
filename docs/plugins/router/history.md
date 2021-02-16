# Router History

The Router maintains its own history and does not rely on a browser web API.

Generally, all the routes to which you have navigated, can be added to history. However, route duplicates are *not* added, so `#home/player/145` will only be added to history *once* (even if you have navigated to it multiple times).

On the other hand, similar route blueprints with different values *are* added, for example: `home/player/178` and `home/player/91737`
or `browse/genre/action/50` and `browse/genre/popular/50`.

## Navigating Through History

### back()

By default, the Router takes ownership in navigating back through history. This means that, if you press **Back** on your remote control, the router calls the `back()` method and goes a step back in history.

```js
Router.back()
```

### go()

If you want to *override* this default call of the `back()` method, you can add the `go()` method to your `Page` class to specify the entry to which you want to navigate back to:

```js
_handleback(){
    Router.go(-3);
}
```

Based on the example above, the *go()* method will try to navigate to the third last entry in history.

#### history object {}

If you navigate away from a page via `Router.navigate("my/next/page")`, the calling page (hash) is added to the Router history as a new entry. For example:

```js
{
    hash: 'home/browse/adventure',
    state: {
        focusIndex:12,
        rowIndex:2
    }
}
```

In the example, `hash` represents the page that initiated the new `navigate`, and `state` is an optional *state history object* that your page can provide.

### historyState()

#### Pushing

If you want your page to add ('push') a state object to history, you can do the following:

```js

class Browse extends Lightning.Component {
    static _template(){
        ...
    }
    historyState(){
        return {
            focusIndex: 12,
            someVal: Math.random()
        }
    }
}
```

When you navigate away from the Browse page, the Router checks for the existence of the `historyState()` function,
and stores the return value (if this is an object).

#### Popping

If the Browse page is loaded ('popped') from history with a history `navigate`, and there is a state object in history, the Router calls
the `historyState()` method, with the *state object* as argument. For example:

```js
historyState(params){
    if(params){
        // called because entry was loaded from history
        this.setIndex(params.focusIndex)
    }else{
        // called because page was added to history
        return {
            focusIndex: 12,
            someVal: Math.random()
        }
    }
}
```

### getHistory()

You can get a copy of the Router's current history by calling the `getHistory()` method, which returns an *Array* of history objects:

```js
const history = Router.getHistory()
```

### replaceHistoryState()

The `replaceHistoryState()` method overrides the state object of the *last* entry that was added to history:

```js
Router.replaceHistoryState({a:1, b:2});
```

If you want to replace *other* entries, you must provide the `hash` as the second argument:

```js
const history = Router.getHistory();
const record = history[2];

Router.replaceHistoryState({a:1, b:2}, record.hash);
```

### getHistoryState()

You can use the `getHistoryState()` method to *review* the history state of one or more previous history entries. For example:

```js
// this returns the state object of the last entry
const state = Router.getHistoryState()
```

You can also provide a `hash`:

```js
const history = Router.getHistory();
const record = history[4];

// this returns the state object for the provided hash
const state = Router.getHistoryState(record.hash)
```
