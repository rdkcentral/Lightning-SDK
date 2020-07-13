# Router

## Page transitions

By default

```js
pageIn.visible = true;
pageOut.visible = true;
```

You can override this behaviour:

##### default transitions

The Router has a couple of default transitions that you can add to your page:

-  `Transitions.left` will put the new page on `x:1920` and will do a transition to `x:0`, the old page with do a transition `x:-1920`
-  `Transitions.right` will put the new page on `x:-1920` and will do a transition to `x:0`, the old page with do a transition `x:1920`
-  `Transitions.up` will put the new page on `y:1080` and will do a transition to `y:0`, the old page with do a transition `y:-1080`
-  `Transitions.down` will put the new page on `y:-1080` and will do a transition to `y:0`, the old page with do a transition `y:1080`
-  `Transitions.fade` will do a transition on the new page from `alpha:0` to `alpha:1`
-  `Transitions.crossFade` will do a transitions on the new page from `alpha:0` to `alpha:1` and a transitions from `alpha:1` to `alpha:0` of the old page

You set it by adding a `easing()` method to your Page (Lightning Component)

```js
class SettingsPage extends Lightning.Component {
    static _template(){
        return {...}
    }

    easing(){
        return "left";
    }
}

class PlayerPage extends Lightning.Component {
    static _template(){
        return {...}
    }

    easing(){
        return "crossFade";
    }
}

```

the default transitions will impact both new and the old page (if there is one)

#### custom transitions

You can provide your own transitions.

##### smoothInOut() #####

Control transition of both new and old page:

You must(!):

- Set `pageIn.visibile = true`
- Resolve a Promise

```js
class BrowsePage extends Lightning.Component {
    static _template(){
        return {...}
    }

    smoothInOut(pageIn, pageOut){
      return new Promise((resolve, reject)=>{
              // set the start position properties
              pageIn.x = 1920
              pageIn.rotation = Math.PI

              // toggle visibility
              pageIn.visible = true

              // do some transitions
              pageIn.patch({
                  smooth:{x:0, rotation:0}
              })

              // resolve promise when transition on x is finished
              pageIn.transition("x").on("finish", ()=>{
                  resolve()
              })
          })
    }
}
```



##### smoothIn() #####

Provides a simple `smooth()` function that can set a transition on one property

```js
class SearchPage extends Lightning.Component {
    static _template(){
        return {...}
    }
    smoothIn({smooth, pageIn}){
       // set some start property
       pageIn.x = 1920;
       // return the call with property, value and arguments.
       return smooth("x", 0, {duration:2});
    }
}
```

It will self resolve on finish.

Next:
[Widgets](plugins/router/widgets.md)
