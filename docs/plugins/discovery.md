# Discovery
Your App likely wants to integrate with the Platform's discovery capabilities. For example to add a "Watch Next" tile that links to your app from platform home screen.

Getting access to this information requires to connect to lower level APIs made available by the platform. Since implementations differ between operators and platforms, the Lightning-SDK offers a Discovery plugin, that exposes a generic, agnostic interface to the developer.

Under the hood, an underlaying transport layer will then take care of calling the right APIs for the actual platform implementation that your App is running on.

The Discovery plugin is used to _send_ information to the Platform.

## Usage

Whenever you need to interact with the Discovery, import the Discovery plugin from the Lightning SDK

```js
import { Discovery } from '@lightningjs/sdk'
```

## Available methods

### Entitlements
Gets or sets the users entitlements for this app to enable platform home screen awareness.

Takes an Array of entitlements, by default, during _local develompent_:

```js
Discovery.entitlements([
  {
    entitlementId: "http://entitlements/some/canonical/id",
    startTime: "2021-01-01T18:25:43.511Z",
    endTime: "2021-12-31T12:59:59.911Z"
  },
  {
    entitlementId: "http://entitlements/some/canonical/id2",
    startTime: "2021-04-23T18:25:43.511Z",
    endTime: "2022-04-23T18:25:43.511Z"
  }
])
```

### Watched
Adds a content the user's watch history to enable platform home screen awareness.

Takes an array of watched items:

```json
Discovery.watched([
  {
    "contentId": "http://content/some/canonical/id",
    "watchedOn": "2022-04-23T18:25:43.511Z"
  }
])
```

Returns a boolean, indicating success/failure to persist items.

### Watch Next
Adds a tile to the platform home screen to faciliate watching the next piece of content in a sequence, e.g. the next episode in a series.

Parameters:

**titles** - either a String or map of locales to localized titles, e.g.:

```js
"Watch the next episode of \"Show\""
```

or

```js
{
  "en-US": "Watch the next episode of \"Show\"",
  "es": "Mira el próximo episodio de \"Show \""
}
```

**linkUrl** - String, e.g. `"https://www.youtube.com/watch?v=b8fjxn8Kgg4"`
**expires** -   ISO8601 Date/Time string, e.g. `"2021-01-01T18:25:43.511Z"`
**contentId** - canonical ID of the content
**images** - single url as a string, or a localized map with aspect ratios, e.g.

```js
"https://i.ytimg.com/vi/4r7wHMg5Yjg/maxresdefault.jpg"
```

or

```js
{
  "3x4": {
      "en-US": "https://i.ytimg.com/vi/4r7wHMg5Yjg/maxresdefault.jpg",
      "es": "https://i.ytimg.com/vi/4r7wHMg5Yjg/maxresdefault.jpg"
  },
  "16x9": {
      "en": "https://i.ytimg.com/vi/4r7wHMg5Yjg/maxresdefault.jpg"
  }
}
```

Usage:

```js
Discovery.watchNext(
  {
    "en-US": "Watch the next episode of \"Show\"",
    "es": "Mira el próximo episodio de \"Show \""
  },
  "https://www.youtube.com/watch?v=b8fjxn8Kgg4",
  "2021-01-01T18:25:43.511Z",
  "b8fjxn8Kgg4",
  {
    "3x4": {
        "en-US": "https://i.ytimg.com/vi/4r7wHMg5Yjg/maxresdefault.jpg",
        "es": "https://i.ytimg.com/vi/4r7wHMg5Yjg/maxresdefault.jpg"
    },
    "16x9": {
        "en": "https://i.ytimg.com/vi/4r7wHMg5Yjg/maxresdefault.jpg"
    }
  }
)
```