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

// only used during local development
let unlocked = false

let submit = pin => {
  return new Promise((resolve, reject) => {
    if (pin.toString() === Settings.get('platform', 'pin', '0000').toString()) {
      unlocked = true
      resolve(unlocked)
    } else {
      reject('Incorrect pin')
    }
  })
}

let check = () => {
  return new Promise(resolve => {
    resolve(unlocked)
  })
}

export const initPin = config => {
  if (config.submit && typeof config.submit === 'function') {
    submit = config.submit
  }
  if (config.check && typeof config.check === 'function') {
    check = config.check
  }
}

// Public API
export default {
  show() {
    console.log('todo: show PIN dialog')
  },
  hide() {
    console.log('todo: hide PIN dialog')
  },
  submit(pin) {
    return new Promise((resolve, reject) => {
      try {
        submit(pin)
          .then(resolve)
          .catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  },
  unlocked() {
    return new Promise((resolve, reject) => {
      try {
        check()
          .then(resolve)
          .catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  },
  locked() {
    return new Promise((resolve, reject) => {
      try {
        check()
          .then(unlocked => resolve(!!!unlocked))
          .catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  },
}
