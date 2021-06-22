/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
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
 * @class Validator representing all validations
 */
export default class Validator {
  /**
   * Invoke all the configured validators on audio
   * @param {Object} param The audio parameter
   * @param {number} val The value for validation
   * @return {Boolean} The result of given value pass the all the
   * configured validation rules or not
   */
  validate(param, val) {
    return param.validator.every(rule => {
      return this[rule](param, val)
    })
  }

  /**
   * Check the given value is number or not
   */
  isNumber(param, val) {
    if (isNaN(val)) {
      console.error(`${param.name} must be a number`)
      return false
    }
    return true
  }

  /**
   * Check the given value is within the audio parameter range or not
   */
  range(param, val) {
    if (val < param.range[0] || val > param.range[1]) {
      console.warn(`${param.name} must be in range (${param.range})`)
      return false
    }
    return true
  }

  isString(param, val) {
    if (Object.prototype.toString.call(val) == '[object String]') {
      return true
    }
    console.error(`${param.name} must be a string`)
    return false
  }

  /**
   * Check given filter is valid filter type or not
   */
  isValidFilterType(param, val) {
    if (param.filters.includes(val)) {
      return true
    }
    console.error(`${param.name} is not a valid filter type`)
    return false
  }

  /**
   * Check given value is available in possible values array
   */
  isExists(param, val) {
    if (param.possibleValues.includes(val)) {
      return true
    }
    console.error(`${param.name} is not a valid value. possible values are ${param.possibleValues}`)
    return false
  }
}
