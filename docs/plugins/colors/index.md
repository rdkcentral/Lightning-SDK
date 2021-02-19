# Colors

This plugin is primarily for storing colors so you can easily access them anywhere in your project, without the hassle of remembering the actual color code or argb code. This plugin will calculate the desired color and return them in ARGB format.

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
        return 'my/custom/colors-file.json'
    }
}
```

### Colors file

With the default, and string option during boot the Colors plugin expects a JSON file. The default option will look for a JSON file named colors.json. Or a JSON file at a custom location defined with the string option. The JSON file should look something like this:

```json
{
    "background": "#c9deff",
    "focus": "#276EE5"
}
```

### Retrieving Colors

Retrieving a color from the Colors plugin is very easy. You simply import Colors into your source file and use the following function to get the color. For example:

```js
Colors('white').get()
```

### Adjusting Color values

With this plugin you can also adjust the values of a specific color before retrieving it.

#### Alpha
If you want your color to have some opacity / alpha you can use the following:

```js
Colors('red').alpha(0.4).get()
```

The parameter used in the alpha function expects a value with 0 as a minimum, and 1 as maximum value.

#### Hue
You can adjust the Hue value of your color using the following:

```js
Colors('red').hue(120).get()
```

The parameter used in the hue function expects a value with 0 as a minimum, and 360 as maximum value.


#### Lightness
You can adjust the Lightness value of your color using the following:

```js
Colors('green').lightness(0.3).get()
```

The parameter used in the lightness function expects a value with 0 as a minimum, and 1 as maximum value.

#### Saturation
You can adjust the Saturation value of your color using the following:

```js
Colors('blue').saturation(0.3).get()
```

The parameter used in the saturation function expects a value with 0 as a minimum, and 1 as maximum value.

#### Lighter
You can also make your color Lighter using the following:

```js
Colors('red').lighter(0.3).get()
```

The lighter function takes the current Lightness value and changes that according to the parameter.
The parameter used in the lighter function expects a value with 0 as a minimum, and 1 as maximum value.

#### Darker
You can also make your color Darker using the following:

```js
Colors('red').darker(0.3).get()
```

The darker function takes the current Brightness value and changes that according to the parameter.
The parameter used in the lighter function expects a value with 0 as a minimum, and 1 as maximum value.


#### Mixing
If you want to mix two different colors you can do it with the mix function. The first parameter can be a stored color, or an ARGB color. The second parameter is the percentage of how it is mixed, we normalized it to a value from 0 to 1.

```js
Colors('cyan').mix(Colors('magenta').get(), 0.5).get()
```

### Chaining

With this plugin you can also chain functions, if for example a specific color darker and give it a specific opacity:

```js
Colors('red').darker(0.2).alpha(0.8).get()
```