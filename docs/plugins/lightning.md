# Lightning

The Lightning SDK exposes Lightning as a module that can be imported in your App. In other words, there is no need to install Lightning Core as a separate dependency.

You use Lightning in every component, since components extend the `Lightning component` base class.

Apart from that, you can use Lightning to take advantage of the default texture and tools made available by Lightning (see [Using Tools from Lightning](#using-tools-from-lightning) below).

## Usage

### Extending the Lightning Component

It is required that *all* components in your App (including the main App) extend the Lightning component.

```js
import { Lightning } from '@lightningjs/sdk'

export default class MyComponent extends Lightning.Component {
  //
}
```

### Using Tools from Lightning

Lightning provides a set of tools that you can use in your App. For example:

```js
import { Lightning } from '@lightningjs/sdk'

export default class MyComponent extends Lightning.Component {
  static _template() {
    return {
      RoundedRectangle: {
        texture: Lightning.Tools.getRoundRect(100, 10, 4)
      }
    }
  }
}
```

### Using Textures from Lightning

You can use textures provided by Lightning as shown in the following example:

```js
import { Lightning } from '@lightningjs/sdk'

export default class MyComponent extends Lightning.Component {
  static _template() {
    return {
      RoundedRectangle: {
        texture: Lightning.textures.NoiseTexture
      }
    }
  }
}
```

> See the [Lightning Core Reference](../../lightning-core-reference/index.md) documentation for more information.
