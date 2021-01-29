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

import { emit, addEventListener, removeEventListener } from '../Events'
import Log from '../Log'
import isProbablyLightningComponent from '../helpers/isProbablyLightningComponent'
import { initBaseEvents } from './base'
import { initLightningEvents } from './lightning'

const supportedStates = ['loading', 'active', 'paused', 'background', 'close']
let currentState = supportedStates[0]

export const initLifecycle = (app, transport) => {
  if (transport) {
    transport.stateChange = stateChange
    if (transport.onClose && typeof transport.onClose === 'function') {
      addEventListener('close', transport.onClose)
    }
  }

  if (isProbablyLightningComponent(app)) {
    initLightningEvents.init()
  }

  initBaseEvents()
}

const stateChange = (state) => {
  if (supportedStates.indexOf(state) !== -1) {
    Log.info('State change: ', state)
    emit(state)
    currentState = state
  }
}

// public API
export default {
  ready() { stateChange('active') },
  close() { stateChange('close') }, // when the app wants to close
  state() { return currentState },
  addEventListener,
  removeEventListener,
}
