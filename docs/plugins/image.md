# Image


The standard way of displaying images in Lightning is to just specify the `src`. This is the preferred way for specifying local assets (such as background, splash screen, logo and icons) of Lightning Apps.


It is recommended that you *optimize* the local assets of your App by resizing them to the *exact* size and quality in which you will use them. This positively affects the memory usage of your App.


However, if you don't have control over the images that to be displayed in your App (for example, because they originate from a remote API), you can use the *Image* plugin to resize and crop the images.

## Usage


Import the Image plugin from the Lightning SDK in components where you want to resize an image:


```
import { Img } from '@lightningjs/sdk'
```

## Available Methods

### exact()


Resizes the image to the exact dimensions, ignoring the ratio.


```
Img(url).exact(width, height)
```

### landscape()


Resizes the image by width, maintaining the ratio.


```
Img(url).landscape(width)
```

### portrait()


Resizes the image by height, maintaining the ratio.


```
Img(url).portrait(height)
```

### cover()


Resizes the image in such a way that it covers the entire area. Depending on the orientation (portrait or landscape) of the image and the target, it resizes the image by width or by height.


```
Img(url).cover(width, height)
```

### contain()


Resizes the image in such a way that it is contained within the available area. Depending on the orientation (portrait or landscape) of the image and the target, it resizes the image by width or by height.


```
Img(url).contain(width, height)
```

### original()


Generates the image without resizing it (that is, it uses the original dimensions), while still passing it through the proxy (and taking advantage of caching).


```
Img(url).original()
```

## Image Quality


To increase the performance on lower-end boxes –especially those with limited GPU memory– there is a platform setting `image.quality` which enables you to control the *image quality*.


Depending on this setting, the images that are returned by the image server may be *smaller* than actually displayed on the screen.
Lightning *stretches* the images to fit them within the desired dimensions.

> Although this setting saves on used GPU memory, it also impacts the visual quality of the images.


Within the context of the Metrological Application Platform, this setting is defined as a platform setting *outside* the control area of your App.
However, you can experiment with this setting during local development via **settings.json** (located in the root of your project):


```
{
    "appSettings": {
    },
    "platformSettings": {
        "image": {
          "quality": 50
        }
    }
}
```


The Platform Setting `image.quality` is a value between `1` and `100`, where 1 means low quality and 100 is the original image quality.


If preferred, it can also be defined as a *string* with a percentage sign appended (for example, `"75%"`).
