# Locale

If your app targets an international public, it might be a good idea to offer your app in different languages. Instead of hardcoding texts, you can use the Locale plugin to retrieve local translations.

## Usage

Any time you want to display a translated text in a component, you have to import the Locale plugin.

```js
import { Locale } from 'wpe-lightning-sdk'
```

### Specifying translations

The Locale plugin reads it's data from a json file, for example `static/locale/locale.json`, with the following format:

```json
{
  "en" :{
    "how": "How do you want your egg today?",
    "boiledEgg": "Boiled egg",
    "softBoiledEgg": "Soft-boiled egg",
    "choice": "How to choose the egg",
    "buyQuestion": "I'd like to buy {0} eggs, {1} dollars each."
  },
  "it": {
    "how": "Come vuoi il tuo uovo oggi?",
    "boiledEgg": "Uovo sodo",
    "softBoiledEgg": "Uovo alla coque",
    "choice": "Come scegliere l'uovo",
    "buyQuestion": "Mi piacerebbe comprare {0} uova, {1} dollari ciascuna."
  }
}
 ```

### Setting the (default) language

In order to specify the Locale file to be used, add a static method `getLocale` to your main App component (`src/App.js`) and return the path to your `locale.json`.

You can also use this method to set the default language for your App.

```js
static getLocale() {
  Locale.setLanguage('en')
  return Utils.asset('locale/locale.json')
}
```

## Available methods

### Load Language file

Load a language file on the fly. This is handled automatically for you when using the static `getLocale()` method in the main App component (`src/App.js`).

```js
Locale.load('path/to/locale.json')
```

### Set Language

Set the current language. For example when a user changes the language.

```js
Locale.setlanguage(languageKey)
```

### Get a translation

Once a language has been set, an object `tr` is available on the Locale plugin, which maps to the translations of that given language

```js
Locale.tr.boiledEgg
```

### Formatting a translation

Every translation key is also augmented with a `format()`-method, which allows you to replace pre defined elements in the translated string with values.

```js
// I'd like to buy {0} eggs, {1} dollars each
Locale.tr.buyQuestion.format(10, 0.5)
// => I'd like to buy 10 eggs, 0.5 dollars each.
```
