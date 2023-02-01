# Subtitles

You can use the *Subtitles* plugin to easily display Subtitles (or Closed Captions) in your App.

The plugin comes with some basic styling of Subtitles and offers the option to customize them, such as font size, colors, and positioning.

> The Subtitles plugins in the Lightning-SDK only offers an API for displaying Subtitles.

> Retrieving subtitles from a video stream or a remote API is not part of the Plugin's functionality as it's very App and / or Platform specific.

## Usage

If you want to display Subtitles in your App, first import the Subtitles plugin from the Lightning SDK:

```js
import { Subtitles } from '@lightningjs/sdk'
```

## Available Methods

### show

Sets the visibility of Subtitles to `true`, to display Subtitles.

```js
Subtitles.show()
```

### hide

Sets the visibility of Subtitles to `false`, to hide Subtitles.

```js
Subtitles.hide()
```

### text

Sets the text of the Subtitles text.

```js
Subtitles.text('Subtitle Text')
```

### clear

Clears the text of the Subtitles text.

```js
Subtitles.clear()
```

### styles

Sets the styles of the Subtitles text. This is a short hand method for setting the following styles: `fontFamily`, `fontSize`, `fontColor`, `backgroundColor`, `textAlign`. If any of these styles are not set, the default values will be used.

```js
Subtitles.styles({
  fontFamily: 'sans-serif',
  fontSize: 45,
  fontColor: 0xffffffff,
  backgroundColor: 0x90000000,
  textAlign: 'center',
})
```
### fontFamily

Sets the `fontFamily` style of the Subtitles text.

```js
Subtitles.fontFamily('sans-serif')
```

### fontSize

Sets the `fontSize` style of the Subtitles text.

```js
Subtitles.fontSize(50)
```

### fontColor

Sets the `fontColor` style of the Subtitles text

```js
Subtitles.fontColor(0xffffffff)
```

### backgroundColor

Sets the `backgroundColor` style of the Subtitles text

```js
Subtitles.backgroundColor(0x90000000)
```

### textAlign

Sets the `textAlign` style of the Subtitles text

```js
Subtitles.textAlign('center')
```

### position

Sets the x and y positions of the Subtitles text.

`x` value must be either a number or one of the following options: `'left'`, `'center'`, `'right'`. The default value for `x` is `'center'`.

`y` value must be either a number or one of the following options: `'top'`, `'center'`, `'bottom'`. The default value for `y` is 'bottom'.

```js
Subtitles.position('center', 'top')
Subtitles.position(100, 100)
```

### maxWidth

Sets the maximum width of the Subtitles text.

```js
Subtitles.maxWidth(1200)
```
