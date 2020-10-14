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

export default (sourceObject, setup = () => {}) => {
  let ready = false

  const doSetup = () => {
    if (ready === false) {
      setup()
      ready = true
    }
  }

  return Object.keys(sourceObject).reduce((obj, key) => {
    if (typeof sourceObject[key] === 'function') {
      obj[key] = function() {
        doSetup()
        return sourceObject[key].apply(sourceObject, arguments)
      }
    } else if (typeof Object.getOwnPropertyDescriptor(sourceObject, key).get === 'function') {
      obj.__defineGetter__(key, function() {
        doSetup()
        return Object.getOwnPropertyDescriptor(sourceObject, key).get.apply(sourceObject)
      })
    } else if (typeof Object.getOwnPropertyDescriptor(sourceObject, key).set === 'function') {
      obj.__defineSetter__(key, function() {
        doSetup()
        return Object.getOwnPropertyDescriptor(sourceObject, key).set.sourceObject[key].apply(
          sourceObject,
          arguments
        )
      })
    } else {
      obj[key] = sourceObject[key]
    }
    return obj
  }, {})
}
