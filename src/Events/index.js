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

const callbacks = {}

const emit = (event, ...args) => {
  callbacks[event] &&
    callbacks[event].forEach(cb => {
      cb.apply(null, args)
    })
}

const addEventListener = (event ,cb) => {
  if (typeof cb === 'function') {
    callbacks[event] = callbacks[event] || []
    callbacks[event].push(cb)
  } else {
    Log.error('Please provide a function as a callback')
  }
}

const removeEventListener = (event, cb = false) => {
  if (callbacks[event] && callbacks[event].length) {
    callbacks[event] = cb ? callbacks[event].filter(_cb => _cb === cb) : []
  }
}

export default {
  emit,
  addEventListener,
  removeEventListener
}
