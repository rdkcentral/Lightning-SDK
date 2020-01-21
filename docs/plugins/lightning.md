# Lightning

The Lightning SDK is built on top of Lightning, but it also exposes Lightning as a module that can be imported in your App. In other words, there is no need to install Lightning-core as a separate dependency.

You will use Lightning in almost every component, since components extend the Lightning component base class.

Apart from that you can also use it to take advantage of the default texture and tools made available by Lightning.

See <a href="https://webplatformforembedded.github.io/Lightning/" target="_blank">Lightning documentation</a> for more information.

## Usage

### Extending a Lightning component

All components in your app (including the main App) are required to extend a Lightning component.

```js
import { Lightning } from 'wpe-lightning-sdk'

export default class MyComponent extends Lightning.Component {
  //
}
```

### Using Tools from Lightning

Lightning offers a set of tools that you can use in your App.

```js
import { Lightning } from 'wpe-lightning-sdk'

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

See <a href="https://webplatformforembedded.github.io/Lightning/docs/textures/toolbox" target="_blank">Lightning documentation</a> for more information.

### Using Textures from Lightning

```js
import { Lightning } from 'wpe-lightning-sdk'

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
