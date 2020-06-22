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

import Settings from '../Settings'
import localCookie from 'localCookie'

let namespace
let lc

export const initStorage = () => {
  namespace = Settings.get('platform', 'appId')
  // todo: pass options (for example to force the use of cookies)
  lc = new localCookie()
}

const namespacedKey = key => (namespace ? [namespace, key].join('.') : key)

export default {
  get(key) {
    try {
      return JSON.parse(lc.getItem(namespacedKey(key)))
    } catch (e) {
      return null
    }
  },
  set(key, value) {
    try {
      lc.setItem(namespacedKey(key), JSON.stringify(value))
      return true
    } catch (e) {
      return false
    }
  },
  remove(key) {
    lc.removeItem(namespacedKey(key))
  },
  clear() {
    if (namespace) {
      lc.keys().forEach(key => {
        // remove the item if in the namespace
        key.indexOf(namespace + '.') === 0 ? lc.removeItem(key) : null
      })
    } else {
      lc.clear()
    }
  },
}
