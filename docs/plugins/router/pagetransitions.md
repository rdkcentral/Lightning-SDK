# Page Transitions

If you navigate from one page to another, the default behavior is that the `[visibility](../../../lightning-core-reference/RenderEngine/Elements/Rendering.md#Visibility)` property of the new (incoming) Page is set to `true` and that this same property of the old (outgoing) Page is set to `false`.

You can *override* this simple 'hide and show' behavior using the Router plugin. By adding a `pageTransition` method to your Page component, you can apply [default](#Default-Page-Transitions) or [custom](#Custom-Page-Transitions) page transitions.

## Default Page Transitions

The Router plugin provides default transitions that you can add to your Page. They help you to quickly make your App look good. These default page transitions are:

| Transition | Description |
|---|---|
| `left` | Put the new page on `x:1920` and perform a transition to `x:0`. For the old page, perform a transition to `x:-1920`. |
| `right` | Put the new page on `x:-1920` and perform a transition to `x:0`. For the old page, perform a transition to `x:1920`. |
| `up` | Put the new page on `y:1080` and perform a transition to `y:0`. For the old page, perform a transition to `y:-1080`. |
| `down` | Put the new page on `y:-1080` and perform a transition to `y:0`. For the old page, perform a transition to `y:1080`. |
| `fade` | For the new page, perform  a transition from `alpha:0` to `alpha:1`. |
| `crossFade` | For the new page, perform a transition from `alpha:0` to `alpha:1`. For the old page, perform a transition from `alpha:1` to `alpha:0`. |

You can invoke a default transition on your page by returning a *String* that contains the transition name in
the `pageTransition` method.

For example:

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

> A default page transition affects both the new and the old page (if there is one).

## Custom Page Transitions

You can also add a *custom* page transition to a Page by returning a *Promise* from the `pageTransition` method (instead of returning a *String* with a default transition name).

The `pageTransition` method receives the new (`pageIn`) and old (`pageOut`) page as its arguments. You can compose your own custom transition by setting any of the properties of either the new or the old page.

> When using custom page transitions, you must *explicitly* set the `visibility` of `pageIn` to `true`. Also, you must *resolve* the Promise returned in the `pageTransition` method.

For example:

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

      // resolve Promise when transition on x is finished
      pageIn.transition('x').on('finish', ()=>{
        resolve()
      })
    })
  }
}
```

#### NEXT:
[Widgets](widgets.md)
