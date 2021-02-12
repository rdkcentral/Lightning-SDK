# FPS Counter

The number of *Frames per second (FPS)* is an important measure for the performance of your App. The higher the FPS, the smoother the experience. When you are validating your App on a certain platform, it's useful to get an indication of the *FPS score*.

The SDK contains a built-in *FPS counter* that can be enabled or disabled via the Platform Setting `showFps` in `settings.json`. When it is enabled, a *real-time* counter with the current FPS will be displayed as an overlay in the top left corner of your App.

## Advanced Configuration

If you need more control over the behavior of the FPS counter, you can pass an *object* that contains one or more of the following configuration options (instead of passing only a `boolean`):

| Name | Default | Description |
|---|---|---|
| `interval` | 500 | Refresh rate in milliseconds |
| `log` | false | Indicates whether or not to *also* log the calculated FPS value to the console |
| `threshold` | 1 | Minimum difference between FPS values to display / log |

```js
"showFps": {
  "interval": 300,
  "log": true,
  "threshold": 3
}
```
