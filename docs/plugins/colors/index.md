# Colors

This plugin is primarily for storing colors so you can easily access them anywhere in your project, without the hassle of remembering the actual color code or argb code. This library will calculate the desired color and return them in ARGB format.

The plugin comes with 8 standard colors; white, black, red, green, blue, yellow, cyan, and magenta.

## Usage

If you want to use the Colors plugin, import it from the Lightning SDK:

```js
import { Colors } from '@lightningjs/sdk'
```

### Loading on boot

You can automatically load and initialize the Colors plugin when your App boots, by specifying ‘static’ method ‘colors()’ on the App class in src/App.js.

With ‘colors’ method you can return, a boolean ‘true’, an object, or a string:

```js
export default class App extends Lightning.Component {
	static colors() {
        //default
        return true
        //object
        return {
            background: '#c9deff',
            focus: '#276ee5'
        }
        //string
        return 'my/custom/language-file.json'
    }
}
```

### Colors file

With the default, and string option during boot the Colors plugin expects a JSON file. The default option will look for a JSON file named colors.json. Or a JSON file at a custom location defined with the string option. The JSON file should look something like this:

```js
{
    "background": "#c9deff",
    "focus": "#276EE5",
}
```

### Retrieving Colors

Retrieving a color from the Colors plugin is very easy. You simply import Colors into your source file and use the following function to get the color. For example:

```js
Colors('white').get()
```

If your want your white color to have some opacity / alpha your can use the following:

```js
Colors('white').alpha(0.4).get()
```

You can also make your colors lighter or darker. For example:

```js
Colors('blue').lighter(0.3).get()
Colors('green').darker(0.3).get()
```

With this library you can also chain methods, if for example a specific color darker and give it a specific opacity:

```js
Colors('red').darker(0.2).alpha(0.8).get()
```

If you want to mix two different colors you can do it with the mix function. The first two parameters can be stored colors, #RRGGBB, or ARGB. The third parameter is the percentage of how it is mixed, we normalized it to a value from 0 to 1.

```js
Colors('cyan').mix(Colors('magenta').get(), 0.5).get()
```