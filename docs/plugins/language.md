# Language

The language plugin supports internationalisation features for your App.

## Usage

In order to use the Language plugin, import it from the Lightning SDK.

```js
import { Language } from 'wpe-lightning-sdk'
```

### Loading on boot

You can automatically load and initialize the Language plugin when your App boots, by specifying a `static` method `language()`
on the `App`-class in `src/App.js`.

The `language`-method should return which language to use on initialisation. This can either be a string or a Promise that resolves a
string with the language code.


```js
export default class App extends Lightning.Component {

  static language() {
    // hardcoded string
    return 'en'
    // or string retrieved van Storage
    return Storage.get('selectedLanguage') || 'en'
    // or a promise (e.g. using the Profile plugin)
    return Profile.language()
  }

}
```

### Translations file

By default the Language plugin expects a `json` file, called `translations.json` in the `static` folder of your App.

If you want, you can specify a different name and / or location for your translations file, or even host it on a remote CDN.
You can configure this via the `static` method `language()` on `App.js`, by returning an object with a `file` and a
`language` property (instead of just the initial language).

```js
export default class App extends Lightning.Component {

  static language() {
    return {
      file: Utils.asset('my/custom/language-file.json'),
      language: Profile.language() // or hardcoded string 'en'
    }
  }

}
```

The translations file should contain valid json in the following format.

```json
{
  "en": {
    "key": "translated string in English",
    "another key": "another translated string in English"
  },
  "nl": {
    "key": "translated string in Dutch",
    "another key": "another translated string in Dutch"
  }
}
```

Optionally you can add an extra `meta`-key to `translations.json` with more detailed configuration and metadata.

```json
{
  "meta": {
    "default": "en", // default fallback language
    "names": { // human readable names for language codes
        "en": "English",
        "nl": "Nederlands"
    },
    "map": { // mapping language codes
      "en-US": "en",
      "en-GB": "en",
      "nl-NL": "nl",
      "nl-BE": "nl"
    }
  },
  "en": {
    //
  },
  "nl": {
    //
  }

}
```

## Available methods

### Set

Sets or changes the current Language.

```js
const languageCode = 'en'
Language.set(languageCode)
```

The language code should match with one of the language-keys specified in your `translations.json`.

The `map` option in the `meta` key of your translations file can be used to specify _aliases_, and as such can be used
to map different ISO codes (i.e. en-GB, en-US, etc.) to a single language key (en).

If you have specified a `default` language in the `meta` key of your translations file, the Language plugin will use
that as a fallback in case no matching language was found.

Note, changing the language doesn't automatically trigger a template render update.

#### Translate

Translates a key to the matching value.

```js
Language.translate('hello')
```

The translate method will lookup the translation-key in the current selected language and return the _translated_ value.
If no value is found in the dictionary of the current language, it will return the supplied key.

Optionally you can specify _replacements_ in the translated string. There are 2 ways of defining replacements: _order_ based and _name_ based.

Consider the following `translations.json`:

```json
{
  "en": {
    "introduction": "Hi, my name is {0}, my lastname is {1} and I am {2} years old",
    "introduction2": "Hi, my name is {firstname}, my lastname is {lastname} and I am {age} years old",
  }
}
```

We can either pass a set of function argument for order based replacements.

```js
Language.translate('introduction1', 'John', 'Doe', 18)
// Hi, my name is John, my lastname is Doe and I am 18 years old
```

Or a _key-value_-object for name based replacements.

```js
Language.translate('introduction2', {lastname: 'Smith', firstname: 'Joe', age: 27}) // name based replacements
// Hi, my name is Joe, my lastname is Smith and I am 27 years old
```

### Available

Returns an Array with the available languages as specified in `translations.json`, which can for example be used to display
a dynamic language switcher in your App.

By default it will return a simple Array with the available language codes:

```js
Language.available() // ['en', 'nl', 'fr']
```

If you have specified an object with `names` in the `meta` key of your translations file, the `available`-method will return an
Array of objects

```js
Language.available()
// [{code: 'en', name: 'English'}, {code: 'nl', name: 'Nederlands'}]
```

### Translations

Advanced method that allows you to set the translations manually during runtime, instead of using the automatic load
of `translations.json` on boot.

```js

const translations = {
  meta: {
    map: {
      'en-US': 'en',
      'en-GB': 'en',
      'nl-NL': 'nl',
      'nl-BE': 'nl',
    }
  },
  en: {
    hello: 'hello {name}',
    goodbye: 'goodbye {name}',
  },
  nl: {
    hello: 'hallo {name}',
    goodbye: 'tot ziens {name}',
  },
}

Language.translations(translations)
Language.set('en-GB')
Language.translation('hello', {name: 'John'})
```
