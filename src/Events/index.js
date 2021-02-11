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

let listenerId = 0
const listeners = {}

export const emit = (plugin, event, value) => {
  Log.info('Events', 'Emitting event', plugin, event, value)

  callCallbacks(listeners['*.*'], [plugin, event, value])
  callCallbacks(listeners[plugin + '.*'], [event, value])
  callCallbacks(listeners[plugin + '.' + event], [value])
}

const callCallbacks = (cbs, args) => {
  cbs &&
    Object.keys(cbs).forEach(listenerId => {
      cbs[listenerId].apply(null, args)
    })
}

export const initEvents = config => {
  if (config.emit) config.emit(emit)
}

export default {
  listen(...args) {
    // grab the callback (i.e. the last argument)
    const callback = args.pop()

    if (typeof callback !== 'function') {
      Log.error('Events', 'No valid callback passed')
      return false
    } else {
      listenerId++
      const plugin = args[0] || '*'
      const event = args[1] || '*'

      const key = plugin + '.' + event

      listeners[key] = listeners[key] || {}
      listeners[key][listenerId] = callback

      return listenerId
    }
  },
  clear(pluginOrId = false, event = false) {
    if (typeof pluginOrId === 'number') {
      Log.info('Events', 'Clear listener by id (' + pluginOrId + ')')
      const searchId = pluginOrId.toString()
      Object.keys(listeners).every(key => {
        if (listeners[key][searchId]) {
          // delete callback
          delete listeners[key][searchId]
          // delete the whole namespace if it was the only callback
          if (Object.keys(listeners[key]).length === 0) {
            delete listeners[key]
          }
          return false
        }
        return true
      })
    } else {
      if (!pluginOrId && !event) {
        Log.info('Events', 'Clear all listeners')
        Object.keys(listeners).forEach(key => {
          delete listeners[key]
        })
      } else if (!event) {
        Log.info('Events', 'Clear listeners by plugin (' + pluginOrId + ')')
        Object.keys(listeners).forEach(key => {
          if (key.indexOf(pluginOrId) === 0) {
            delete listeners[key]
          }
        })
      } else {
        Log.info(
          'Events',
          'Clear listeners by plugin: (' + pluginOrId + ') and event (' + event + ')'
        )
        delete listeners[pluginOrId + '.' + event]
      }
    }
  },
  broadcast(event, value) {
    emit('App', event, value)
  },
}
