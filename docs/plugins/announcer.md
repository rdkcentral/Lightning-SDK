# Announcer

You can choose to extend your app with the Announcer class adding a framework for Voice Guidance. On Focus Change events, the Announcer class traverses the _focusPath property collecting strings or promises of strings to announce to the user. The array of information is passed to a speak function which is responsible for converting the text to speach. We include a default speak function which uses the speechSynthesis API, but you replace this with your own implementation by passing a speak function as the second argument to Announcer

## Usage

Extend your application with Announcer before boot:

```
import { Announcer } from 'wpe-lightning-sdk'
const Base = Announcer(lng.Component, customSpeechImpl)
export default class App extends Base {
```

Set `announcerEnabled` to true in your app and optionally `debug` to true to see console tables of the output as shown below.

| Index | Component | Property | Value |
| --- | ---- | ------------ | ------------- |
| 0 | BrowsePage-1 | Title | Free to Me
| 1 | Grid | Title |
| 2 | Rows | Title |
| 3 | Row | Title | Popular Movies - Free to Me
| 4 | Items | Title |
| 5 | TileItem | Title | Teenage Mutant Ninja Turtles: Out of the Shadows
| 6 | Metadata | Announce | Promise
| 7 | Metadata | No Context |
| 8 | TileItem | Context | 1 of 5
| 9 | Items | No Context |
| 10 | Row | No Context |
| 11 | Rows | No Context |
| 12 | Grid | No Context |
| 13 | BrowsePage-1 | Context |  ! ! ! ! Press LEFT or RIGHT to

The announcer will travel through the focusPath looking for `component.announce` then `component.title` properties. After collecting those properties it reverses the focusPath looking for `component.announceContext` properties.

For async data you may return a promise which resolves to a string.

## announcerEnabled

Boolean flag to turn on our off Announcer

## announcerTimeout

By default the announcer only gets information about what changed between focus paths. The announcerTimeout resets the cache to announce the full focus path when the user has been inactive a certain amount of time. Default value is 5 minutes.
