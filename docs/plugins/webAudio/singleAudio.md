# Single Audio

The `Web Audio` provides a provision to apply effects and controls on each individual audio

The `getAudio` method returns the WebAudio instance of specified audio

```js
const speechAudio = WebAudio.getAudio('speech')
```
## Controls Methods

### play

Plays the current audio.

```js
WebAudio.getAudio('speech').play()
```

### pause

Pauses the audio that is currently being played.

```js
WebAudio.getAudio('speech').pause()
```

### resume

Resumes the current audio.

```js
WebAudio.getAudio('speech').resume()
```

### stop

Stops the audio that is currently being played.

```js
WebAudio.getAudio('speech').stop()
```

##  Effects Methods

### volume

Sets the volume of the audio.

Multiply the audio samples by a value to make them louder or quieter.

The `volume` method accept one argument (`volume`) and the value should be in the range [0, 1].


```js
WebAudio.getAudio('speech').volume(0.5)
```

### skip

Skips a specified number of seconds from start of audio.

The `skip` method accepts the number of seconds to jump as single argument. When the value in seconds exceeds the duration of the audio, it rounds down the value and jumps straight to the end of the audio.

```js
WebAudio.getAudio('speech').skip(5) // range: [0, duration of audio]
```

### delay

Sets the delay on audio. User can't hear the sound of audio when it play until delay is over.

The `delay` method accepts the number of seconds of delay as single argument.

```js
WebAudio.getAudio('speech').delay(5) // range: [0, 179]
```

### loop

Sets the audio in a loop state.

The loop method accepts a Boolean as its single argument. When passed `true` (or when omitted), it instructs the web audio to loop (i.e., to restart the current audio when it reaches the end). When passed `false`, it instructs the web audio not to loop the audio.

```js
WebAudio.getAudio('speech').loop()
```

### reset

Reset the audio to initial state by dropping all the configured settings.

```js
WebAudio.getAudio('speech').reset()
```

### effect

Applies the effect on audio.

Performs a Linear Convolution on current audio buffer with effect impulse response and achieves a reverb effect.

The `effect` method accepts the `identifier` of effect as single argument and that should be the valid as well as loaded before.

```js
WebAudio.getAudio('speech').effet('muffler')
```

### compress

Compression effect lowers the volume of loudest parts of the audio singal.

The `compress` method accepts the `CompressorParams` object as a single argument.

The `CompressorParams` instance can be created by `new WebAudio.CompressorParams()`.

You can find more about the properties of compressor at [Compressor](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode#properties).

```js
const compParams = new WebAudio.CompressorParams()

compParams.threshold = -50 // range:[-100, 0]
compParams.knee = 20    //  range: [0, 40]
compParams.ratio = 6    //  range: [1, 20]
compParams.attack = 1   //  range: [0, 1]
compParams.release = 1  //  range: [0, 1]

WebAudio.getAudio('speech').compress(compParams)
```

### filter

A low-order filter on the audio which uses
filter algorithms based on the type of filter.

Example `lowpass` filter type achieve frequencies below the cutoff pass through and frequencies above it are attenuated.

The `filter` method accepts the `FilterParams` object as single argument.

The `FilterParams` instance can be created by the `new WebAudio.FilterParams()`

You can find more about the properties of filter at [Filter](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode#properties)

```js
// create instance of FilterParams
const filterParams  = new WebAudio.FilterParams()

// FilterParams properties
filterParams.frequency = 100 // cut of frequecy in hertz
filterParams.detune = 10    //  frequency in cents
filterParams.Q = 10         //  range: [0.0001, 1000]
filterParams.gain = 10      //  range: [-40, 40]
filterParams.type = WebAudio.FilterParams.TYPE.HIGHPASS

WebAudio.getAudio('speech').filter(filterParams)

/* Available filter types are,

WebAudio.FilterParams.TYPE.LOWPASS
WebAudio.FilterParams.TYPE.HIGHPASS
WebAudio.FilterParams.TYPE.BANDPASS
WebAudio.FilterParams.TYPE.LOWSHELF
WebAudio.FilterParams.TYPE.HIGHSHELF
WebAudio.FilterParams.TYPE.NOTCH
WebAudio.FilterParams.TYPE.PEAKING
WebAudio.FilterParams.TYPE.ALLPASS
*/

```

### IIRFilter

An infinite impulse response filter, the filter response parameters can be specified, so that it can be tuned as needed.

The `IIRFilter` method accepts 2 arguments (`feedForward`, `feedBack`). Both of these parameters are arrays, neither of which can be larger than 20 items.

```js

const feedForward = [0.00020298, 0.0004059599, 0.00020298]

const feedBack = [1.0126964558, -1.9991880801, 0.9873035442]

WebAudio.getAudio('speech').IIRFilter(feedForward, feedBack)
```

### distortion

Represents a non-linear distorter. It uses a curve to apply a waveshaping distortion to the signal.

The `distortion` method accepts 2 arguments (`amount`, `oversample`). The `amount` should be in the range [0, 1]
and the `oversample` could be one of the following
`2x`, `4x` and `none`.
The default `oversample` is set to `none`.

the `distortion` curve is formed based on code at the [Distortion curve](https://stackoverflow.com/a/22313408).

```js
WebAudio.getAudio('speech').distortion(0.5, '2x')
```

### panner

Represents the position and behavior of an audio source signal in 3D space, allowing you to create complex panning effects.

The `filter` method accepts the `PannerParams` object as a single argument.

The `PannerParams` instance can be created by the `new WebAudio.PannerParams()`.

You can find more about the properties of panner at [Panner](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode#properties).

```js

const pannerParams = new WebAudio.PannerParams()

pannerParams.positionX = 0
pannerParams.positionY = 0
pannerParams.positionZ = 1
pannerParams.coneInnerAngle = 480
pannerParams.coneOuterAngle = -10
pannerParams.coneOuterGain = 0
pannerParams.distanceModel = 'linear' // possibleValues: ['linear', 'inverse', 'exponential'],
pannerParams.maxDistance = 9
pannerParams.orientationX = 0
pannerParams.orientationY = 0
pannerParams.orientationZ = 1
pannerParams.panningModel = 'HRTF'  // possibleValues: ['equalpower', 'HRTF']
pannerParams.refDistance = 1
pannerParams.rolloffFactor = 1.1

WebAudio.getAudio('speech').panner(pannerParams)
```

### getPanner

Returns the `PannerNodeWrapper` instance which enable provision to directly update the properties on created panner node.

```js
WebAudio.getAudio('speech').getPanner()
```

### stereoPanner

This can be used to pan an audio stream  left or right.

The `stereoPanner` method accepts the `pan` value between
`-1` (full left pan) and `1` (full right pan).

```js
WebAudio.getAudio('speech').stereoPanner(1)
```

## Equalizer

Equalization is a process of adjusting the volume of different frequency bands within the audio signal. The webAudio plugin has divided the frequency spectrum into five bands [`low, lowMid, mid, highMid, high`] and its respective frequencies are [`60, 230, 910, 3600, 14000`].


### equalizer

Creates an equalizer on a single audio with predefined frequency bands.


```js
WebAudio.getAudio('speech').equalizer()
```

### setGainOn

Adjust the gain of the each frequency band.

```js
WebAudio.getAudio('speech').setGainOnBand('low', 50) // increase the volume of signals falls under low frequency band by 50 db
WebAudio.getAudio('speech').setGainOnBand('lowMid', 40)
WebAudio.getAudio('speech').setGainOnBand('mid', 30)
WebAudio.getAudio('speech').setGainOnBand('highMid', -10)
WebAudio.getAudio('speech').setGainOnBand('high', -20) // decrease the volume of signal falls under high frequency band by 20 db

```

## Method Chaining

All the effects methods on `WebAudio` (`WebAudio.getAudio('speech')`) are chainable methods

```js

// method chaining
WebAudio.getAudio('speech').volume(1).skip(5).delay(5).loop().effect('muffler').play()

```



