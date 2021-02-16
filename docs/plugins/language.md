# Language

The Language plugin supports internationalization features for your App.

## Usage

If you want to use the Language plugin, import it from the Lightning SDK:

```js
import { Language } from '@lightningjs/sdk'
```

### Loading on Boot

You can automatically load and initialize the Language plugin when your App boots, by specifying a `static` method `language()`
on the `App` class in **src/App.js**.

The `language` method returns the language to be used on initialization. This can either be a string or a promise that resolves a
string with the language code.

```js
export default class App extends Lightning.Component {

  static language() {
    // hardcoded string
    return 'en'
    // or string retrieved from Storage
    return Storage.get('selectedLanguage')  || 'en'
    // or a promise (e.g. using the Profile plugin)
    return Profile.language()
  }

}
```

### Translations File

By default, the Language plugin expects a file with translations in JSON format, called **translations.json**, which is located in the **static** folder of your App.

If you want, you can specify a different name and / or location for your translations file, or even host it on a remote CDN.
You can configure this via the `static` method `language()` on **App.js**, by returning an object with a `file` and a
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

The translations file should contain valid JSON in the following format:

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

Optionally, you can add a `meta` key to **translations.json**, that contains more detailed configuration and metadata.

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

### Splitting Up in Several Files

Depending on the size of an App and the number of supported languages, the translations file may grow rather large.
This can make translation management more cumbersome during development. Also, it can negatively affect the loading time
(since the entire **translations.json** is loaded upon boot).

For this reason, the Language plugin offers the option to *split* the translations in different files (for example, **en.json** and **nl.json**) where each file must contain a basic JSON object with keys and their translated values. For example:

```json
{
  "key": "translated string in English",
  "another key": "another translated string in English"
}
```

In the main **translations.json** file, the different language files must be properly wired up. Instead of specifying an entire JSON object, the location of the corresponding JSON file in the **static** folder should be specified as a *string*.

For example:

```json
{
  "meta": {
    "default": "en",
  },
  "en": "translations/en.json",
  "nl": "translations/dutch.json"
}
```

It is possible to use both inline JSON objects and references to external language files in the same **translations.json** file.

External language files are loaded on-the-fly when a specific language is set. This may result in additional load time
when switching between languages.

## Available Methods

### set()

Sets or changes the current language.

```js
const languageCode = 'en'
Language.set(languageCode).then(() => {
  // the current language is now 'en'
}).catch()
```

The `set` method returns a promise that resolves when the `Language` has been properly changed.
Setting the language is *instant* for translations specified inline in the **translations.json** file.
For external language files, an *asynchronous* load request will be made.

The language code should match with one of the language keys specified in your **translations.json**.

The `map` option in the `meta` key of your translations file can be used to specify *aliases*, and as such can be used
to map different ISO codes (i.e., en-GB, en-US) to a single language key (en).

If you have specified a `default` language in the `meta` key of your translations file, the Language plugin will use
that as a *fallback* if no matching language was found.

> Changing the language doesn't automatically trigger a template render update.

### get()

Gets and returns the currently selected language.

```js
// The current language is 'en'
const currentLanguage = Language.get()
// currentLanguage = 'en'
```

### translate()

Translates a key to the matching value.

```js
Language.translate('hello')
```

The `translate` method looks up the translation key in the currently selected language and returns the *translated* value.
If no value is found in the dictionary of the current language, it returns the supplied key.

Optionally, you can specify *replacements* in the translated string. There are two ways of defining replacements: *order-based* and *name-based*.

Consider the following `translations.json`:

```json
{
  "en": {
    "introduction1": "Hi, my name is {0}, my lastname is {1} and I am {2} years old",
    "introduction2": "Hi, my name is {firstname}, my lastname is {lastname} and I am {age} years old",
  }
}
```

For *order-based* replacements, you pass a set of function arguments:

```js
Language.translate('introduction1', 'John', 'Doe', 18)
// Hi, my name is John, my lastname is Doe and I am 18 years old
```

For *name-based* replacements, you pass a *key-value* object:

```js
Language.translate('introduction2', {lastname: 'Smith', firstname: 'Joe', age: 27}) // name based replacements
// Hi, my name is Joe, my lastname is Smith and I am 27 years old
```

### available()

Returns an Array with the available languages as specified in **translations.json**, which, for example, can be used to display
a dynamic language switcher in your App.

The `available` method returns an Array of objects with a `code` and a `name` property.

The `name` property is set to the language name as specified in the `meta.names` property of your translation file.

If you have not specified `names`, or if a particular language does not have a name defined, the property defaults to
the `code` value.

```js
Language.available()
// [{code: 'en', name: 'English'}, {code: 'nl', name: 'Nederlands'}, {code: 'de': name: 'de'}]
```

### translations()

Advanced method that allows you to set the translations manually during runtime, instead of using the automatic load
of **translations.json** on boot.

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
