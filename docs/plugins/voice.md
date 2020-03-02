# Voice

The Lightning-SDK provides a high level set of APIs to handle voice intents. Intents are captured audio fragments processed by a voice recognition system. The intent is the interpreted result of the audio where the App needs to take actions.

### Intents

An intent comes with an action and params in the form of an object:
```js
{
  action: <action>,
  params: <params>
}
```

**action**
A String containing the name of the action to be invoked. E.g.: `seach`, `tune`, `launch`.

**params**
A Structured value that holds the parameter values to be used during the invocation of the action. This member MAY be omitted.

### Usage

To get started, import the voice module:

```js
import { Voice } from 'wpe-lightning-sdk'
```

## Handling intents

To subscribe for intents:

```js
const parseIntent = (intent) => {
  //handle intent
}

Voice.listen( parseIntent )
```

To stop listening for intents:

```js
Voice.close()
```

