# Touch

The Touch plugin enables touch-support for your Lightning App. This will let you
model App interaction via touch-screen and pointers (Magic remote) 

## Usage

In order to power your App with Touch capabilities you first need to import the Touch plugin from the Lightning-SDK
in your `App.js`

```js
import { Touch } from 'wpe-lightning-sdk'
```

## Setup

You can `enable` touch via one of Lightning's [life-cycle events](https://rdkcentral.github.io/Lightning/docs/components/overview#component-events) 

```js
import { Touch } from 'wpe-lightning-sdk'

export default class App extends Router.App {
    _setup() {
        Touch.enable(this.stage)
    }
}
```

## Events

In addition to Lightning's default [life-cycle events](https://rdkcentral.github.io/Lightning/docs/components/overview#component-events) the Touch plugin provides some extra events that your `Component` can listen
to on Touch interaction.

#### _handleTouchStart()

Will be called on the selected `Component` on `touchstart`

```js
class Menu extends Lightning.Component{
   _handleTouchStart(){
       // respond to touchstart
   } 
}
```

#### _handleTouchMove(args)

If we selected a `Component` on `touchstart` we will invoke on the selected `Component`

```js
_handleTouchMove(args){
    // args => { start, current, delta }
}
```

#### _handleTouchHover(args)

If we did not collide with a `Component` on `touchstart` we will invoke `handleTouchHover` 
on every component we move over.

```js
_handleTouchHover(args){
    // args => { start, current, delta }
}
```

#### _handleTouchEnd(args)

When you release the `select` key or finger, we will invoke `handleTouchEnd` on the selected
item (if we have a selected item via `touchstart`) or simply on the `Component` at the coordinates
where we released