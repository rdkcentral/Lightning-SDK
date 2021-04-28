/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2021 Metrological
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

// export { default as advertising } from './src/Advertising/defaults'
// export { default as authentication } from './src/Authentication/defaults'
// export { default as discovery } from './src/Discovery/defaults'
// export { default as log } from './src/Log/defaults'
// export { default as lifecycle } from './src/Lifecycle/defaults'
// export { default as metrics } from './src/Metrics/defaults'
import { default as advertising } from '../Advertising/defaults'
import { default as authentication } from '../Authentication/defaults'
import { default as discovery, events as discovery_events } from '../Discovery/defaults'
import { default as lifecycle } from '../Lifecycle/defaults'
import { default as metrics } from '../Metrics/defaults'
import { default as platform } from '../Platform/defaults'

import Events, { emit } from '../Events'

let mock = {
  advertising: advertising,
  authentication: authentication,
  discovery: discovery,
  lifecycle: lifecycle,
  metrics: metrics,
  platform: platform,
}

let events = {
  discovery: discovery_events,
}

let callback

function send(json) {
  setTimeout(() =>
    callback({ jsonrpc: '2.0', result: getResult(json.method, json.params), id: json.id })
  )
}

function receive(_callback) {
  callback = _callback
  // set up a test harnesses
  window['$firebolt_test_harness'] = {
    emit: function(module, event) {
      module = module.toLowerCase()
      if (events[module] && events[module][event]) emit(module, event, events[module][event])
    },
  }
}

function dotGrab(obj = {}, key) {
  const keys = key.split('.')
  for (let i = 0; i < keys.length; i++) {
    obj = obj[keys[i]] = obj[keys[i]] !== undefined ? obj[keys[i]] : {}
  }
  return typeof obj === 'object' ? (Object.keys(obj).length ? obj : undefined) : obj
}

function getResult(method, params) {
  let api = dotGrab(mock, method)

  if (typeof api === 'function') {
    return api(params)
  } else return api
}

export default {
  send: send,
  receive: receive,
}
