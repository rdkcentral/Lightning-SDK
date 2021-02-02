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

import Events, { emit } from '../Events'
import Log from '../Log'
import Settings from '../Settings'
import Registry from '../Registry'

const supportedStates = ['init', 'ready', 'active', 'pause', 'background', 'close']
const store = {
  _previous: null,
  _current: 'init',
  get current() {
    return this._current
  },
  set current(v) {
    if (supportedStates.indexOf(v) && this.current !== v) {
      this._previous = this._current
      this._current = v
      Log.info('Lifecycle', 'State changed from ' + this._previous + ' to ' + this._current)
      emit('Lifecycle', 'close', {
        from: this._previous,
        to: this._current,
      })
    }
  },
}

export const initLifecycle = config => {
  Events.listen('Lifecycle', 'close', () => {
    Settings.clearSubscribers()
    Registry.clear()
    Events.clear() // maybe this should be moved to an after close ...
    if (config.onClose && typeof config.onClose === 'function') {
      config.onClose()
    }
  })
}

// public API
export default {
  close() {
    store.current = 'close'
  },
  ready() {
    store.current = 'ready'
  },
  state() {
    return store.current
  },
}
