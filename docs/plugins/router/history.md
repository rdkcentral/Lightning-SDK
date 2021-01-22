# Router

## History

The router maintains it’s own history and does not rely on a browser web API. All the routes we have navigated to can end up in history. We don’t keep route duplicates in history, so `#home/player/145` will only be in history once (even if the user navigated to it multiple times) but same route blueprints with different values can live in history, `home/player/178` and `home/player/91737` or `browse/genre/action/50` and `browse/genre/popular/50`

### Navigating through history

By default the Router will take ownership in navigating back in history, when you press `back` on your remote control the router will call:

##### back()

```js
Router.back()
```

And do a step back in history.

##### go()

If you want to override the default `Router.back()` invocation you can add the following to your `Page` class:

```js
_handleback(){
    Router.go(-3);
}
```

This will try to navigate to the third last `history` entry

### history object {}

When you navigate away from a page via `Router.navigate("my/next/page")` the calling page (hash) will end up
as a new entry in the Router's history, for instance:  

```js
{
    hash: 'home/browse/adventure',
    state: {
        focusIndex:12,
        rowIndex:2
    }
}
```

`hash` is the hash that started the new `navigate` and state is an optional state history object that your page can provide.

### historyState()

##### pushing

If you want your page to push a state object in history you can do the following: 

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

When you navigate away from the browse page, the Router will check for the existence of historyState function
and store the return value if it's an `object`

##### popping

If the browse page gets loaded via a history navigate, and there is a state object in history, the Router will call
the same `historyState()`-method with the `stateObject` as argument

```js

historyState(params){
    if(params){
        // called because entry got loaded from history
        this.setIndex(params.focusIndex)
    }else{
        // called because page will be put in history
        return {
            focusIndex: 12,
            someVal: Math.random()
        }
    }
}
```

### getHistory()

You can get a copy of the Router's current history by calling:  
```js
const history = Router.getHistory()
```

this will return an `array` of `history objects`


### replaceHistoryState()

It's possible to replace the state object of the last entry that ended in history:

```js
Router.replaceHistoryState({a:1, b:2});
```

This will override (or set) the history state object of the last entry. It's also possible to replace other 
entries, but you will need to provide the `hash` as second argument: 

```js
const history = Router.getHistory();
const record = history[2];

Router.replaceHistoryState({a:1, b:2}, record.hash);
```

### getHistoryState()

In addition to replacing the history state, you can also review the history state of previous entries: 

```js
// this will return state object of the last entry
const state = Router.getHistoryState()
```

of provide a hash

```js
const history = Router.getHistory();
const record = history[4];

// this will return the state object for the provided hash
const state = Router.getHistoryState(record.hash)
```
