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
import Metrics from '../Metrics'
import Settings from '../Settings'
import Log from '../Log'

const supportedStates = ['init', 'inactive', 'foreground', 'background', 'suspended', 'unloading']
const store = {
  _previous: null,
  _current: 'initializing',
  get current() {
    return this._current
  },
  set current(v) {
    if (supportedStates.indexOf(v) && this.current !== v) {
      this._previous = this._current
      this._current = v
      Log.info('Lifecycle', 'State changed from ' + this._previous + ' to ' + this._current)
      emit('Lifecycle', this.current, {
        state: this._current,
        previous: this._previous,
      })
    }
  },
}

export const initLifecycle = config => {
  Events.listen('Lifecycle', 'unloading', () => {
    // maybe not needed?
    if (config.onClose && typeof config.onClose === 'function') {
      config.onClose()
    }
    Settings.clearSubscribers()
    Events.clear()
  })
}

// public API
export default {
  state() {
    return store.current
  },
  ready() {
    Metrics.app.ready()
    store.current = 'inactive'
    setTimeout(() => (store.current = 'foreground'), 100)
  },
  close(reason) {
    if (reason === 'REMOTE_BUTTON') {
      store.current = 'inactive'
    } else {
      store.current = 'unloading'
      setTimeout(() => this.finished(), 2000)
    }
  },
  finished() {
    if (store.current === 'unloading') {
      Metrics.app.close()
      location.href = 'about:blank'
    } else throw 'Cannot call finished() except when in the unloading transition'
  },
}
