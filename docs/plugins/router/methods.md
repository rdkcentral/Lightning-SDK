# Router

## Public methods overview

The Router exposes a couple of methods that you can use in your app: 

#### startRouter()

```js
Router.startRouter(routes)
```
read more [on setup](index.md#setup) or [routes configuration object](configuration.md#router-configuration)

#
#### navigate()

```js
Router.navigate("path/to/navigate")
```

[read more](navigation.md#navigation)

#
#### back()

```js
Router.back()
```

[read more](history.md#back)

#
#### go()

```js
Router.go(-3)
```

[read more](history.md#go)

#
#### focusWidget()

```js
Router.focusWidget("Menu")
```

[read more](widgets.md#handling-focus)

#
#### getActiveWidget()

```js
Router.getActiveWidget()
```

Will return the instance of the widget that has `focus`

#
#### focusPage()

```js
Router.focusPage()
```

[read more](widgets.md#handling-focus)

#
#### isNavigating()

```js
Router.isNavigating()
```

[read more](navigation.md#isnavigating)

#
#### getHistory()

```js
Router.getHistory()
```

[read more](history.md#gethistory)

#
#### getHistoryState()

```js
Router.getHistoryState()
```

[read more](history.md#gethistorystate)

#
#### replaceHistoryState()

```js
Router.replaceHistoryState({a:1, b:2})
```

[read more](history.md#replacehistorystate)

#
#### App Base class

```js
class MyApp extends Router.App {
    
}
```

[read more](index.md#setup)

#
#### resume()

```js
Router.resume()
```

[read more](configuration.md#boot-component)

#
#### getActivePage()

```js
Router.getActivePage()
```

Will return reference of the active `Page` instance

#
#### getActiveRoute()

```js
Router.getActiveRoute()
```

Will return the active route `path` blueprint

#
#### getActiveHash()

```js
Router.getActiveHash()
```

Will return the active `hash`













