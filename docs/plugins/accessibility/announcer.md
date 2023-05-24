# Announcer Library

The `Announcer` library allows for relevant information to be voiced along the focus path of the application. By passing the focus path to `Announcer.onFocusChange` the function traverses the `_focusPath` property collecting strings or promises of strings to announce to the user. The array of information is passed to a SpeechEngine which is responsible for converting the text to speech. By default we use the [speechSynthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis), but you can replace this by overwriting `Announcer._textToSpeech`.

Note: The speechSynth api has some known problems:<br />
https://stackoverflow.com/questions/39391502/js-speechsynthesis-problems-with-the-cancel-method<br />
https://stackoverflow.com/questions/23483990/speechsynthesis-api-onend-callback-not-working<br />

This class does its best to work around these issues, but speech synth api can randomly fail.

## Usage

```js
import { Router, {Announcer} = Accessibility } from '@lightningjs/sdk';
export default class App extends Router.App {
  ...
  _focusChange() {
    Announcer.onFocusChange(this.application._focusPath);
  }
}
```

Set `Announcer.debug = true` to see console tables of the output as shown below.

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

The `Announcer` will travel through the `_focusPath` looking for `component.announce` then `component.title` properties. After collecting those properties it reverses the `_focusPath` looking for `component.announceContext`.

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
### Properties

| name             | type    | readonly | description                                                                                                                                                                                                                                        |
| ---------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enabled | boolean | false    | default true - flag to turn on or off Announcer                                                                                                                                                                                                                   |
| announcerTimeout | number  | false    | By default the announcer only gets information about what changed between focus paths. The announcerTimeout resets the cache to announce the full focus path when the user has been inactive a certain amount of time. Default value is 5 minutes. |

### Methods

| name              | args           | description                                                                                                                                                                                                               |
| ----------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| speak         |                | Performs a manual announce                                                                                                                                                                                                |
| &nbsp;            | `announcement` | See _SpeechType_ above                                                                                                                                                                                                    |
| &nbsp;            | `options`      | Object containing one or more boolean flags: <br/><ul><li>append - Appends announcement to the currently announcing series.</li><li>notification - Speaks out notification and then performs $announcerRefresh.</li></ul> |
| clearPrevFocus | `depth`          | Clears the last known focusPath - depth can trim known focusPath                                                                                                                                                 |
| cancel  | none           | Cancels current speaking                                                                                                                                                                                            |
| setupTimers | `options` | Object containing: <br/><ul><li>focusDebounce - default amount of time to wait after last input before focus change announcing will occur.</li><li>focusChangeTimeout - Amount of time with no input before full announce will occur on next focusChange</li></ul> |
