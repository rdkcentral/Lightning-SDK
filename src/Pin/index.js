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

import Settings from '../Settings'
import PinDialog from './dialog'
import { ApplicationInstance } from '../Launch'

// only used during local development
let unlocked = false
let contextItems = ['purchase', 'parental']

let submit = (pin, context) => {
  return new Promise((resolve, reject) => {
    if (
      pin.toString() === Settings.get('platform', 'pin', '0000').toString() &&
      contextItems.includes(context)
    ) {
      unlocked = true
      resolve(unlocked)
    } else {
      reject('Incorrect pin or Incorrect context')
    }
  })
}

let check = context => {
  return new Promise((resolve, reject) => {
    contextItems.includes(context) ? resolve(unlocked) : reject('Incorrect Context')
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

let pinDialog = null

// Public API
export default {
  show() {
    return new Promise((resolve, reject) => {
      pinDialog = ApplicationInstance.stage.c({
        ref: 'PinDialog',
        type: PinDialog,
        resolve,
        reject,
      })
      ApplicationInstance.childList.a(pinDialog)
      ApplicationInstance.focus = pinDialog
    })
  },
  hide() {
    ApplicationInstance.focus = null
    ApplicationInstance.children = ApplicationInstance.children.map(
      child => child !== pinDialog && child
    )
    pinDialog = null
  },
  submit(pin, context = contextItems[0]) {
    return new Promise((resolve, reject) => {
      try {
        submit(pin, context)
          .then(resolve)
          .catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  },
  unlocked(context = contextItems[0]) {
    return new Promise((resolve, reject) => {
      try {
        check(context)
          .then(resolve)
          .catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  },
  locked(context = contextItems[0]) {
    return new Promise((resolve, reject) => {
      try {
        check(context)
          .then(unlocked => resolve(!!!unlocked))
          .catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  },
}
