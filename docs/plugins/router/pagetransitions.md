# Router

## Page transitions

When you navigate from one page to the other, the default behaviour is to simply set the `visibility` property of the
_new_, _incoming_ Page to `true`. And the `visibility` property of the _old_, _outgoing_ Page is set to `false`.

With the Router plugin you can override this simple _hide_ and _show_ behavior, and apply custom or default page transitions.
You can do this by specifying a `pageTransition`-method on your Page component.

### Default transitions

The Router-plugin offers some default transitions that you can add to your Page and help you to quickly make your App look good.

-  **left**<br />puts the new page on `x:1920` and does a transition to `x:0`, the old page will do a transition `x:-1920`
-  **right**<br />puts the new page on `x:-1920` and does a transition to `x:0`, the old page will do a transition `x:1920`
-  **up**<br />puts the new page on `y:1080` and does a transition to `y:0`, the old page will do a transition `y:-1080`
-  **down**<br />puts the new page on `y:-1080` and does a transition to `y:0`, the old page with do a transition `y:1080`
-  **fade**<br />does a transition on the new page from `alpha:0` to `alpha:1`
-  **crossFade**<br />does a transition on the new page from `alpha:0` to `alpha:1` and a transition from `alpha:1` to `alpha:0` on the old page


In order to invoke any of the default transitions on your page, you simply return a `String` with the transition name in
the `pageTransition` method.

```js
class SettingsPage extends Lightning.Component {
  static _template() {
    return {...}
  }

  pageTransition() {
    return 'left';
  }
}

class PlayerPage extends Lightning.Component {
  static _template() {
    return {...}
  }

  pageTransition() {
    return 'crossFade'
  }
}
```

The default transitions will impact both new and the old page (if there is one).

### Custom transitions

It is also possible to add your own custom page transition to a Page. You can do so by returning a `Promise` from the `pageTransition` method (instead of a `String` with a default transition name).

The `pageTransition` method receives the new page (`pageIn`) and the old page (`pageOut`) as it's arguments.
You are free to set any of the properties of either the new page or the old page, to put together your transition.

Just remember that when using custom page transitions you _have_ to set the `visibility` of the `pageIn` to `true` yourself.

Also make sure that you `resolve` the Promise returned in the `pageTransition`-method.

```js
class BrowsePage extends Lightning.Component {
  static _template() {
      return {...}
  }

  pageTransition(pageIn, pageOut) {
    return new Promise((resolve, reject) => {
      // set the start position properties
      pageIn.x = 1920
      pageIn.rotation = Math.PI

      // toggle visibility
      pageIn.visible = true

      // do some transitions
      pageIn.patch({
        smooth: { x: 0, rotation: 0 }
      })

      // resolve promise when transition on x is finished
      pageIn.transition('x').on('finish', ()=>{
        resolve()
      })
    })
  }
}
```

Next:
[Widgets](widgets.md)
