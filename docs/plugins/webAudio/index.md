# Web Audio

A common feature of TV apps is to play audios. The WebAudio plugin offers a convenient interface to interact with the audio player of the STB. You can use it to play / pause audios.
It also allowing developers to choose audio sources, add effects to audio, apply spatial effects (such as panning) and much more.

Although it's possible to implement a fully custom audio solution, the use of the WebAudio plugin from the SDK is highly recommended.

## Example app

We've provided an example App that showcases all the features of the Web Audio: https://github.com/mlapps/com.metrological.app.WebAudioTester.

## Usage

In order to power your App with audio capabilities you first need to import this plugin from the Lightning-SDK.

```js
import { WebAudio } from '@lightningjs/sdk'

```

## Methods

The Web Audio exposes methods that you can use in your app:

### initWebAudio

The Web Audio API involves handling audio operations inside an audio context, and has been designed to allow modular routing. We can use `initWebAudio` method to override the default AudioContext of `window` object with platform provided AudioContext.

`AudioContext` represents an audio-processing graph built from audio modules linked together.
It controls the execution of audio processing or decoding.

By default Web Audio plugin uses `window.AudioContext` or `window.webkitAudioContext`.

The `initWebAudio` accept config object.

```js
const config = {
    AudioContext: platformAudioContext
}

WebAudio.initWebAudio(config)
```

### Load

Loads the configured audio buffers into the application and set the optional context instance.

The `load` method accepts a config object.
the config should have `sounds` property with an array of audio objects as value. Each audio object key act as an `identifier` of `audio` and the value is the audio source URL.

the config can have optional property `audioContext` represents an instance of context.


```js
const audios = [
    {speech: 'https://webaudioapi.com/samples/room-effects/sounds/speech.mp3'},
    {chrono: 'https://webaudioapi.com/samples/script-processor/chrono.mp3'}
]

const config = {
    sounds: audios,
    audioContext: new AudioContext() //optional
}

WebAudio.load(config)
```
### getBuffers

Returns the beffers of loaded audios.

```js
WebAudio.getBuffers()
```

### isReady

Returns whether instance of `AudioContext` created or not.

```js
WebAudio.isReady()
```

### loadEffects

Loads all the available effects into the application.

Effects are impulse responses used to perform linear convolution on audio.

The `loadEffects` method accepts an array of objects. Each object key acts as an identifier of the effect and the value represents the impulse response source URL.

```js
const effects = [
    {telephone: 'https://webaudioapi.com/samples/room-effects//sounds/impulse-response/telephone.wav' },
    {muffler: 'https://webaudioapi.com/samples/room-effects//sounds/impulse-response/muffler.wav' },
]

WebAudio.load(effects)
```

### getAudio

Returns the `WebAudio` instance of a given identifier.

The `WebAudio` provide provision to control single audio with effects [Single Audio](singleAudio.md)`.

The `getAudio` method accept an identifier
to find out the audio.

```js
WebAudio.getAudio('speech')
```

### setSettings

By default all the loaded audios are marked as `selectedAudios` and these can be controlled by `play`, `pause`, `stop` and `reset` methods.

The `setSettings` method accepts the two arguments
(`settings` and `identifiers`). Both the parameters are optional.

`settings` is an object where the key represents the setting name and the value represents its value.

The `identifiers` is an array of audio `identifiers`. If `idetifiers` are provided only those audios are marked as `selectedAudios`.

settings will be applied on `selectedAudios`.

```js
const settings = {
    volume: 1,
    skip: 0.5,
    delay: 1,
    loop: false,
    stereoPanner: 1,
    effect: 'muffler',
    filter: new WebAudio.FilterParams(),
    compress: new WebAudio.CompressorParam(),
    panner: new WebAudio.PannerParams(),
    IIRFilter: [feedForward, feedBack],
    distortion: [amount, oversample]
}

const audios = ['speech', 'chrono']

WebAudio.setSettings(settings, audios)

// WebAudio.setSettings(settings) //settings applied on all loaded audios

// WebAudio.setSettings({}, audios) // only given audio identifiers marked as selectedAudios with empty settings.
```

### play

Plays the `selectedAudios`.

```js

WebAudio.play()
```

### stop

Stops the `audios` that are currently playing.

```js
WebAudio.stop()
```

### pause

Pauses the `audios` that are currently playing.

```js
WebAudio.pause()
```

### resume

Resumes the `audios` that are currently paused.

```js
WebAudio.resume()
```

### remove

Remove audios that are loaded.

The `remove` method accepts `identifiers` as an argument and will be removed whatever specified in the arguments, if we don't specify anything then all the identifiers will be removed.

```js
WebAudio.remove() // remove all the audios

/*
 WebAudio.remove(['speech']) remove only speech audio
*/
```

### removeEffects

Removes the audio effects (impulse response audios).

The `removeEffects` method accepts `identifiers` as an argument and will be removed whatever specified in the arguments, if we don't specify anything then all the effects will be removed.

```js
WebAudio.removeEffects() // remove all the effects

/*
 WebAudio.removeEffects(['telephone']) remove only telephone effect
*/
```

### getListener

Returns the `WebAudioListener` instance that represents the position and orientation of the unique person listening to the audio scene, and is used in audio spatialization.

You can find more about properties of Audio Listener at [AudioListener](https://developer.mozilla.org/en-US/docs/Web/API/AudioListener#properties)

```js

const listener = WebAudio.getListener()

listener.positionX = 0
listener.positionY = 0
listener.positionZ = 1
listener.forwardX = 0
listener.forwardY = 0
listener.forwardZ = 1
listener.upX =  0
listener.upY = 0
listener.upZ = 1

```

Next:
[Single Audio](singleAudio.md)
