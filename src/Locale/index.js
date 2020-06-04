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

/**
 * Simple module for localization of strings.
 *
 * How to use:
 * 1. Create localization file with following JSON format:
 * {
 *   "en" :{
 *     "how": "How do you want your egg today?",
 *     "boiledEgg": "Boiled egg",
 *     "softBoiledEgg": "Soft-boiled egg",
 *     "choice": "How to choose the egg",
 *     "buyQuestion": "I'd like to buy {0} eggs, {1} dollars each."
 *   },
 *
 *   "it": {
 *     "how": "Come vuoi il tuo uovo oggi?",
 *     "boiledEgg": "Uovo sodo",
 *     "softBoiledEgg": "Uovo alla coque",
 *     "choice": "Come scegliere l'uovo",
 *     "buyQuestion": "Mi piacerebbe comprare {0} uova, {1} dollari ciascuna."
 *   }
 * }
 *
 * 2. Use Locale's module load method, specifying path to your localization file and set chosen language, e.g.:
 *    > Locale.load('static/locale/locale.json');
 *    > Locale.setLanguage('en');
 *
 * 3. Use localization strings:
 *    > console.log(Locale.tr.how);
 *    How do you want your egg today?
 *    > console.log(Locale.tr.boiledEgg);
 *    Boiled egg
 *
 * 4. String formatting
 *    > console.log(Locale.tr.buyQuestion.format(10, 0.5));
 *    I'd like to buy 10 eggs, 0.5 dollars each.
 */

import Log from '../Log'
class Locale {
  constructor() {
    this.__enabled = false
  }

  /**
   * Loads translation object from external json file.
   *
   * @param {String} path Path to resource.
   * @return {Promise}
   */
  async load(path) {
    if (!this.__enabled) {
      return
    }

    await fetch(path)
      .then(resp => resp.json())
      .then(resp => {
        this.loadFromObject(resp)
      })
  }

  /**
   * Sets language used by module.
   *
   * @param {String} lang
   */
  setLanguage(lang) {
    this.__enabled = true
    this.language = lang
  }

  /**
   * Returns reference to translation object for current language.
   *
   * @return {Object}
   */
  get tr() {
    return this.__trObj[this.language]
  }

  /**
   * Loads translation object from existing object (binds existing object).
   *
   * @param {Object} trObj
   */
  loadFromObject(trObj) {
    const fallbackLanguage = 'en'
    if (Object.keys(trObj).indexOf(this.language) === -1) {
      Log.warn('No translations found for: ' + this.language)
      if (Object.keys(trObj).indexOf(fallbackLanguage) > -1) {
        Log.warn('Using fallback language: ' + fallbackLanguage)
        this.language = fallbackLanguage
      } else {
        const error = 'No translations found for fallback language: ' + fallbackLanguage
        Log.error(error)
        throw Error(error)
      }
    }

    this.__trObj = trObj
    for (const lang of Object.values(this.__trObj)) {
      for (const str of Object.keys(lang)) {
        lang[str] = new LocalizedString(lang[str])
      }
    }
  }
}

/**
 * Extended string class used for localization.
 */
class LocalizedString extends String {
  /**
   * Returns formatted LocalizedString.
   * Replaces each placeholder value (e.g. {0}, {1}) with corresponding argument.
   *
   * E.g.:
   * > new LocalizedString('{0} and {1} and {0}').format('A', 'B');
   * A and B and A
   *
   * @param  {...any} args List of arguments for placeholders.
   */
  format(...args) {
    const sub = args.reduce((string, arg, index) => string.split(`{${index}}`).join(arg), this)
    return new LocalizedString(sub)
  }
}

export default new Locale()
