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

import { default as mock } from './mock'
import { default as queue } from './queue'
import { initSettings } from '../Settings'

// TODO need to spec Firebolt Settings
initSettings({}, { log: true })

const promises = []
let transport
let id = 0
let transport_service_name = 'com.comcast.BridgeObject_1'
let timeout

// create global handshake namespace
if (!window.__firebolt) {
  window.__firebolt = {}
}

// Returns an FTL queue. Initializes the default transport layer if available
const getTransportLayer = () => {
  let transport
  if (typeof window.__firebolt.transport_service_name === 'string')
    transport_service_name = window.__firebolt.transport_service_name

  if (
    typeof window.ServiceManager !== 'undefined' &&
    window.ServiceManager &&
    window.ServiceManager.version
  ) {
    // Wire up the queue
    transport = queue
    // get the default bridge service, and flush the queue
    window.ServiceManager.getServiceForJavaScript(transport_service_name, service => {
      setTransportLayer(service)
    })
  } else {
    // Check for custom, or fall back to mock
    transport = queue
  }
  return transport
}

const setTransportLayer = tl => {
  if (timeout) clearTimeout(timeout)

  // remove handshake object
  delete window.__firebolt

  transport = tl
  queue.flush(tl)
}

const send = (module, method, params) => {
  let p = new Promise((resolve, reject) => {
    promises[id] = {}
    promises[id].promise = this
    promises[id].resolve = resolve
    promises[id].reject = reject
  })

  let json = { jsonrpc: '2.0', method: module + '.' + method, params: params, id: id }
  id++
  transport.send(json)

  return p
}

transport = getTransportLayer()

// TODO: clean up resolved promises
transport.receive(json => {
  let p = promises[json.id]

  if (p) {
    if (json.error) p.reject(json.error)
    else {
      p.resolve(json.result)
    }
  }
})

if (window.__firebolt.getTransportLayer) {
  setTransportLayer(window.__firebolt.getTransportLayer())
} else {
  window.__firebolt.setTransportLayer = setTransportLayer
}

// in 500ms, default to the mock FTL
// TODO: design a better way to load mock
timeout = setTimeout(() => {
  setTransportLayer(mock)
}, 500)

export default {
  send: send,
}
