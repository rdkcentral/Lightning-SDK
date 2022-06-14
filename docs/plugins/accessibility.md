# Accessibility

The Accessibility plugin provides functionality to easily make your App more accesible.

Currently it provides functionality to apply a **Colorshifting filter** to your App, helping people with different types of color blindness to properly use your App.

## Usage

The Accessibility plugin is automatically included in the root of your App. In most cases there is no need to specifically import the Accessibility plugin into your App code.

## Colorshift filter

When you want to apply a colorshift filter over your _entire App_, you can do so by calling the
`colorshift` method attached to the root `application`.

A reference to the root application is made available in every Lightning component (via `this.application`), allowing you to invoke this function from anywhere in your App.

### colorshift

Applies a color filter and optional _brightness_, _contrast_ and _gamma_ configuration.

```js
const type = 'deuteranopia'
const config = {
  brightness: 18,
  contrast: 69,
  gamma: 42
}
this.application.colorshift(type, config)
```

#### type

Valid values for Colorshift types are:

- `deuteranopia` (red-green, green weak)
- `protanopia` (red-green, red weak)
- `tritanopia` (blue-yellow)
- `monochromacy` (grayscale)
- `normal` (normal vision)

When passing `false` the entire colorshift filter is disabled.

#### config

`config` is an object where the _brightness_, _contrast_ and _gamma_ of each color filter can be tweaked. The values are expected to be between `0` and `100`, and default to `50`.

It's not required to pass in the entire object. Keys that are ommitted are automatically assumed to have the default value (of `50`).

The `normal` type color filter should be used for cases where you only want to adjust the brightness, contrast or gamma values, without applying any specific color blindness filter.


### Advanced use

The typical use of the colorshift filter is to apply it over the entire app (using `this.appliction.coloshift()`). But there may also be cases where you want to apply it only to a single element (for demo purposes or during in-app configuration of the color settings, for example).

In this case you should import the `Accessibility` plugin into your component.

```js
import { Accessibility } from '@lightningjs/sdk'
```

Next you can use the `colorshift` method similarly to the standard use. With the exception that the first argument refers to the Lightning element you want to apply the colorshift filter to.

```js
const type = 'protanopia'
const config = {
  brightness: 54,
}
const element = this.tag('Logo')
Accessibility.colorshift(element, type, config)
```

Important to remember is that the element you apply the colorshift filter to shouldn't already have a _shader_ applied to it, nor can it have `rtt` set to `true`. In these cases you could create a wrapper and apply the colorshift filter to the wrapper instead.

### Colorshift configuration UX

To make it as easy as possible to make your App colorblindness friendly, we have made available a standard importable [UI component](...) to set and configure the colorshift settings for your App.

Feel free to use this UI component directly inside your App. Or use it as inspiration to build your own configuration screen.
