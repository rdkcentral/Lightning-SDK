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
import Utils from '../Utils'

let meta = {}
let translations = {}
let language = null
let dictionary = null

export const initLanguage = (file, language = null) => {
  return new Promise((resolve, reject) => {
    fetch(file)
      .then(response => response.json())
      .then(json => {
        setTranslations(json)
        // set language (directly or in a promise)
        typeof language === 'object' && 'then' in language && typeof language.then === 'function'
          ? language
              .then(lang =>
                setLanguage(lang)
                  .then(resolve)
                  .catch(reject)
              )
              .catch(e => {
                Log.error(e)
                reject(e)
              })
          : setLanguage(language)
              .then(resolve)
              .catch(reject)
      })
      .catch(() => {
        const error = 'Language file ' + file + ' not found'
        Log.error(error)
        reject(error)
      })
  })
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

  return new Promise((resolve, reject) => {
    if (lng in translations) {
      language = lng
    } else {
      if ('map' in meta && lng in meta.map && meta.map[lng] in translations) {
        language = meta.map[lng]
      } else if ('default' in meta && meta.default in translations) {
        language = meta.default
        const error =
          'Translations for Language ' +
          language +
          ' not found. Using default language ' +
          meta.default
        Log.warn(error)
        reject(error)
      } else {
        const error = 'Translations for Language ' + language + ' not found.'
        Log.error(error)
        reject(error)
      }
    }

    if (language) {
      Log.info('Setting language to', language)

      const translationsObj = translations[language]
      if (typeof translationsObj === 'object') {
        dictionary = translationsObj
        resolve()
      } else if (typeof translationsObj === 'string') {
        const url = Utils.asset(translationsObj)

        fetch(url)
          .then(response => response.json())
          .then(json => {
            // save the translations for this language (to prevent loading twice)
            translations[language] = json
            dictionary = json
            resolve()
          })
          .catch(e => {
            const error = 'Error while fetching ' + url
            Log.error(error, e)
            reject(error)
          })
      }
    }
  })
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
