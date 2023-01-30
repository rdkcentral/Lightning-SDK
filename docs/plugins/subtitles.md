# Subtitles

You use the _Subtitles_ plugin to easily display Subtitles (or Closed Captions) in your App.

The plugin comes with some basic styling of Subtitles and offers the option to customize some of them, such as fontSize, colors and positioning.

> The Subtitles plugins in the Lightning-SDK only offers an API for displaying Subtitles.<br /><br />
> Retrieving subtitles from a video stream or a remote API is not part of the Plugin's functionality as it's very App and / or Platform specific.

## Usage

If you want to display Subtitles in your App, first import the Subtitles plugin from the Lightning SDK:

```js
import { Subtitles } from '@lightningjs/sdk'
```

## Available Methods

### show

Sets the visibility of Subtitles to true, to display Subtitles

```js
Subtitles.show()
```

### hide

Sets the visibility of Subtitles to false, to hide Subtitles

```js
Subtitles.hide()
```

### styles

Sets the styles of the Subtitles text

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

Sets the fontFamily of the Subtitles text

```js
Subtitles.fontFamily('sans-serif')
```

### fontSize

Sets the fontSize of the Subtitles text

```js
Subtitles.fontSize(50)
```

### fontColor

Sets the fontColor of the Subtitles text

```js
Subtitles.fontColor(0xffffffff)
```

### backgroundColor

Sets the backgroundColor of the Subtitles text

```js
Subtitles.backgroundColor(0x90000000)
```

### textAlign

Sets the textAlign of the Subtitles text

```js
Subtitles.textAlign('center')
```

### position

Sets the x and y positions of the Subtitles text.

The position method accepts 2 arguments: x and y. x value must be either 'left' or 'center' or 'right' and y value must be either 'top' or 'center' or 'bottom'. Default value of x is 'center' and y is 'bottom'.

```js
Subtitles.position('center', 'top')
```

### maxWidth

Sets the maxWidth of the Subtitles text

```js
Subtitles.maxWidth(1200)
```

### text

Sets the text of the Subtitles text

```js
Subtitles.text('Subtitle Text')
```

### clear

Clears the text of the Subtitles text

```js
Subtitles.clear()
```
