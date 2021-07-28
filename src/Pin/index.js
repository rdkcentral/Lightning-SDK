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
import { Log } from '../../index'

// only used during local development
let unlocked = false
const contextItems = ['purchase', 'parental']

let submit = (pin, context) => {
  return new Promise((resolve, reject) => {
    if (pin.toString() === Settings.get('platform', 'pin', '0000').toString()) {
      unlocked = true
      resolve(unlocked)
    } else {
      reject('Incorrect pin')
    }
  })
}

let check = context => {
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

let pinDialog = null

const contextCheck = context => {
  if (!context) {
    Log.info('Please provide context explicitly')
    return contextItems[0]
  }
  return false
}

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
  submit(pin, context) {
    return new Promise((resolve, reject) => {
      try {
        if (contextCheck(context) || contextItems.includes(context)) {
          submit(pin, context)
            .then(resolve)
            .catch(reject)
        } else {
          reject('Incorrect Context provided')
        }
      } catch (e) {
        reject(e)
      }
    })
  },
  unlocked(context) {
    return new Promise((resolve, reject) => {
      try {
        if (contextCheck(context) || contextItems.includes(context)) {
          check(context)
            .then(resolve)
            .catch(reject)
        } else {
          reject('Incorrect Context provided')
        }
      } catch (e) {
        reject(e)
      }
    })
  },
  locked(context) {
    return new Promise((resolve, reject) => {
      try {
        if (contextCheck(context) || contextItems.includes(context)) {
          check(context)
            .then(unlocked => resolve(!!!unlocked))
            .catch(reject)
        } else {
          reject('Incorrect Context provided')
        }
      } catch (e) {
        reject(e)
      }
    })
  },
}
