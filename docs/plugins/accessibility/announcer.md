# Announcer Mixin

Extend your app with the `Announcer` class, that when enabled, allows for relevant information to be voiced along the focus path of the application. On Focus Change events, the `Announcer` class traverses the `_focusPath` property collecting strings or promises of strings to announce to the user. The array of information is passed to a speak function which is responsible for converting the text to speech. We include a default speak function
which uses the [speechSynthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis), but you can replace this with your own implementation by passing a speak function as the second argument to `Announcer`.

Note: The speechSynth api has some known problems:
https://stackoverflow.com/questions/39391502/js-speechsynthesis-problems-with-the-cancel-method
https://stackoverflow.com/questions/23483990/speechsynthesis-api-onend-callback-not-working

This class does its best to work around these issues, but speech synth api can randomly fail.

## Usage

Extend your application with `Announcer` before boot:

```js
import { Router, Accessibility } from '@lightningjs/sdk';
const Base = Announcer(Router.App)
export default class App extends Base {
```

Set `announcerEnabled` to true in your app and optionally `debug` to true to see console tables of the output as shown below.

| Index | Component    | Property   | Value                                            |
| ----- | ------------ | ---------- | ------------------------------------------------ |
| 0     | BrowsePage-1 | Title      | Free to Me                                       |
| 1     | Grid         | Title      |                                                  |
| 2     | Rows         | Title      |                                                  |
| 3     | Row          | Title      | Popular Movies - Free to Me                      |
| 4     | Items        | Title      |                                                  |
| 5     | TileItem     | Title      | Teenage Mutant Ninja Turtles: Out of the Shadows |
| 6     | Metadata     | Announce   | Promise                                          |
| 7     | Metadata     | No Context |                                                  |
| 8     | TileItem     | Context    | 1 of 5                                           |
| 9     | Items        | No Context |                                                  |
| 10    | Row          | No Context |                                                  |
| 11    | Rows         | No Context |                                                  |
| 12    | Grid         | No Context |                                                  |
| 13    | BrowsePage-1 | Context    | PAUSE-2 Press LEFT or RIGHT to                   |

The `Announcer` will travel through the `_focusPath` looking for `component.announce` then `component.title` properties. After collecting those properties it reverses the `_focusPath` looking for `component.announceContext` properties.

### SpeechType

All of the properties may return values compatible with the following recursive type definition:

```
SpeechType = string | Array<SpeechType> | Promise<SpeechType> | () => SpeechType
```

At its simplest, you may return a string or an array of strings. Promises and functions that return SpeechType values may be used as necessary for advanced/asyncronous use cases.

#### Examples

```js
  get announce() {
    return [
      'Despicable Me',
      Promise.resolve([
        ['2020', 'Rated PG'],
        Promise.resolve('Steve Carell, Miranda Cosgrove, Kristen Wiig, Pierre Coffin'),
        () => 'A description of the movie'
      ])
    ];
  }

  get announceContext() {
    return 'Press LEFT or RIGHT to review items';
  }
```

## Inserting a pause

You may also use `PAUSE-#` to pause speech for # seconds before saying the next string.

```js
  get announceContext() {
    return ['PAUSE-2.5', 'Hello there!'];
  }
```

## API

### Options

| name                | type    | readonly | default                                                                                                                         | description                                                                                         |
| ------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| voiceOutDelay       | integer | false    | 500ms | time in ms to determine when voice out is read.                                                                                 |                                                                                                     |
| announcerFocusDebounce       | integer | false    | 400ms | time in ms to determine when voice out is read.                                                                                 |                                                                                                     |
| announcerTimeout       | integer | false    | 30000ms | time in ms till focus history is reset causing full readout                                                                                |                                                                                                     |
### Properties

| name             | type    | readonly | description                                                                                                                                                                                                                                        |
| ---------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| announcerEnabled | boolean | false    | flag to turn on or off Announcer                                                                                                                                                                                                                   |
| announcerTimeout | number  | false    | By default the announcer only gets information about what changed between focus paths. The announcerTimeout resets the cache to announce the full focus path when the user has been inactive a certain amount of time. Default value is 5 minutes. |

### Signals

| name              | args           | description                                                                                                                                                                                                               |
| ----------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| $announce         |                | Performs a manual announce                                                                                                                                                                                                |
| &nbsp;            | `announcement` | See _SpeechType_ above                                                                                                                                                                                                    |
| &nbsp;            | `options`      | Object containing one or more boolean flags: <br/><ul><li>append - Appends announcement to the currently announcing series.</li><li>notification - Speaks out notification and then performs $announcerRefresh.</li></ul> |
| $announcerRefresh | depth          | Performs an announce using the focusPath - depth can trim known focusPath                                                                                                                                                 |
| $announcerCancel  | none           | Cancels current speaking                                                                                                                                                                                                  |

### Events

These stage level events can be listened to using the syntax `this.stage.on('EVENT_NAME', callback);`

| name                | args | description                                                                                                                   |
| ------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------- |
| announceEnded       | -    | emitted when all contents of the announce array have finished being read out                                                  |
| announceTimoutEnded | -    | emitted after the amount of time of announded word count \* 500ms, used to account for the known speechSynth api issues above |
