# Colors

The Colors plugin is intended primarily for storing colors so that you can easily access them anywhere in your project, without the need to remember the actual color code or ARGB code. The plugin calculates the desired color and returns it in ARGB format.

The plugin comes with 8 standard colors: white, black, red, green, blue, yellow, cyan and magenta.

## Usage

If you want to use the Colors plugin, import it from the Lightning SDK:

```js
import { Colors } from '@lightningjs/sdk'
```

### Loading on Boot

You can automatically load and initialize the Colors plugin when your App boots, by specifying the `static` method `colors()` on the App class in the file **src/App.js**.

With the `colors` method, you can return a boolean *true*, an object or a string:

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

### Defining the Colors File

With the default and *string* option during boot, the Colors plugin expects a JSON file, named **colors.json**. (Or another JSON file at a custom location defined with the string option.) This JSON file should look like the following:

```json
{
    "background": "#c9deff",
    "focus": "#276EE5"
}
```

### Retrieving Colors

To retrieve a color from the Colors plugin, you simply have to import `Colors` into your source file and use the following function to get the color. For example:

```js
Colors('white').get()
```

### Adjusting Color Values

The Colors plugin also enables you to adjust the values of a specific color before retrieving it.

#### Alpha
If you want your color to have some opacity / alpha, you can use the following code:

```js
Colors('red').alpha(0.4).get()
```

The parameter of the `alpha` function expects a value with between 0 and 1.

#### Hue Value
You can adjust the Hue value of your color using the following code:

```js
Colors('red').hue(120).get()
```

The parameter of the `hue` function expects a value between 0 and 360.

#### Lightness
You can adjust the lightness of your color using the following code:

```js
Colors('green').lightness(0.3).get()
```

The parameter of the `lightness` function expects a value between 0 and 1.

#### Saturation
You can adjust the saturation of your color using the following code:

```js
Colors('blue').saturation(0.3).get()
```

The parameter of the `saturation` function expects a value between 0 and 1.

#### Lighter
You can also make your color lighter using the following code:

```js
Colors('red').lighter(0.3).get()
```

The `lighter` function takes the current `Lightness` value and changes this value based on the parameter used.

The parameter of the `lighter` function expects a value between 0 and 1.

#### Darker
Similarly, you can make your color darker using the following code:

```js
Colors('red').darker(0.3).get()
```

The `darker` function takes the current `Brightness` value and changes this value based on the parameter.

The parameter of the `lighter` function expects a value between 0 and 1.

#### Mixing
If you want to mix two different colors, you can use the `mix` function.

```js
Colors('cyan').mix(Colors('magenta').get(), 0.5).get()
```

The first parameter of this function can be a stored color or an ARGB color.

The second parameter is the mixing percentage. We normalized this percentage to a value from 0 to 1.

### Chaining

The Colors plugin also enables you to chain functions. For example, making a specific color darker and give it a certain opacity:

```js
Colors('red').darker(0.2).alpha(0.8).get()
```
