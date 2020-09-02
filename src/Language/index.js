/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Log from '../Log'

let meta = {}
let translations = {}
let language = null
let dictionary = null

export const initLanguage = (file, lng = null) => {
  return fetch(file)
    .then(response => response.json())
    .then(json => {
      setTranslations(json)
      // set language (directly or in a promise)
      typeof lng === 'object' && 'then' in lng && typeof lng.then === 'function'
        ? lng.then(l => setLanguage(l)).catch(Log.error)
        : setLanguage(lng)
    })
    .catch(() => Log.error('Language file ' + file + ' not found'))
}

const setTranslations = obj => {
  if ('meta' in obj) {
    meta = { ...obj.meta }
    delete obj.meta
  }
  translations = obj
}

const setLanguage = lng => {
  language = null
  dictionary = null
  if (lng in translations) {
    language = lng
  } else {
    if ('map' in meta && lng in meta.map && meta.map[lng] in translations) {
      language = meta.map[lng]
    } else if ('default' in meta && meta.default in translations) {
      language = meta.default
      Log.warn(
        'Translations for Language ' +
          language +
          ' not found. Using default language ' +
          meta.default
      )
    } else {
      Log.error('Translations for Language ' + language + ' not found.')
    }
  }
  if (language) {
    Log.info('Setting language to', language)
    dictionary = translations[language]
  }
}

export default {
  translate(key) {
    let replacements = [...arguments].slice(1)

    // no replacements so just translated string
    if (replacements.length === 0) {
      return (dictionary && dictionary[key]) || key
    } else {
      if (replacements.length === 1 && typeof replacements[0] === 'object') {
        replacements = replacements.pop()
      }

      return Object.keys(
        // maps array input to an object {0: 'item1', 1: 'item2'}
        Array.isArray(replacements) ? Object.assign({}, replacements) : replacements
      ).reduce((text, replacementKey) => {
        return text.replace(
          new RegExp('{\\s?' + replacementKey + '\\s?}', 'g'),
          replacements[replacementKey]
        )
      }, (dictionary && dictionary[key]) || key)
    }
  },

  translations(obj) {
    setTranslations(obj)
  },

  set(language) {
    return setLanguage(language)
  },

  available() {
    const languageKeys = Object.keys(translations)
    return 'names' in meta
      ? languageKeys.map(key => ({ code: key, name: meta.names[key] || key }))
      : languageKeys
  },
}
