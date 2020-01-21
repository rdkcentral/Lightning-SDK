# Image

The standard way of displaying images in Lightning is to just specify the `src`. This is the prefered way for your App's local assets (such as background, splash screen, logo and icons).

It's adviced that you optimize an App's local assets, by resizing them to the exact size and quality you will be using them. This will be beneficial for the memory usage of your App.

However when you don't have control over the images you're displaying in your App (because they come from a remote API for example), you can use the Image plugin to resize and crop images.

## Usage

Whenever you need to resize image, import the Image plugin from the Lightning SDK

```js
import { Img } from 'wpe-lightning-sdk'
```

## Available methods

### Exact

Resizes the image to the exact dimensions, ignorning the ratio.

```js
Img(url).exact(width, height)
```

### Landscape

Resizes the image by width, maintaining the ratio.

```js
Img(url).landscape(width)
```

### Portrait

Resizes the image by height, maintaining the ratio

```js
Img(url).portrait(height)
```

### Cover

Resizes the image in such a way that it covers the entire area. Depending on the orientation (portrait or landscape) of the image it will resize the image by width or by height.

```js
Img(url).cover(width, height)
```

### Contain

Resizes the image in such a way that it is contained within the available area. Depending on the orientation (portrait or landscape) of the image it will resize the image by width or by height.

```js
Img(url).contain(width, height)
```

### Original

Generate an image without resizing it (i.e. use the original dimensions), while still passing it through the proxy (and taking advantage of caching).

```js
Img(url).original()
```

## Deprecated methods

In the previous SDK different aliases for the same image resize options were offered. They are supported as deprecated methods until the summer of 2020.

### Crop

Alias for `cover`.

```js
Img(url).crop(width, height)
```

### Fit

Alias for `exact`.

```js
Img(url).fit(width, height)
```

### Parent

Alias for `exact`.

```js
Img(url).parent(width, height)
```

### Height

Alias for `portrait`.

```js
Img(url).height(width, height)
```


### Width

Alias for `landscape`.

```js
Img(url).landscape(width, height)
```

### Auto

Alias for `cover`.

```js
Img(url).auto(width, height)
```
