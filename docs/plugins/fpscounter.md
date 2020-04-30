# FPS counter

Frames per second (FPS) is an important measure for the performance of your App. A higher FPS indicates a smoother experience.
When validating an App on a certain platform it's useful to get an indication of the FPS score.

The SDK contains a built-in **FPS counter** that can be turned on or off via the [Platform Setting](/plugins/settings?id=platform) `showFps` in `settings.json`.

When enabled a _real-time_ counter with the current FPS will be displayed as an overlay in the top left corner of the App.

## Advanced configuration

If you need more control over the behaviour of the FPS counter, you can pass an `object` with more configuration instead of a `boolean`.

- **interval** - specifies the refresh rate in miliseconds (defaults to `500`)
- **log** - whether to _also_ log the calculated FPS value to the console (defaults to `false`)
- **threshold** - minimal difference between FPS values to display / log (defaults to `1`)

```json
"showFps": {
  "interval": 300,
  "log": true,
  "threshold": 3
}
```
