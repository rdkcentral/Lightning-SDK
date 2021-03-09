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

import { getActiveHash, getActivePage } from './router'
import { getOption, getRouteByHash } from './route'
import { isFunction, isObject, isArray, symbols } from './helpers'
import { getRouterConfig } from './router'

/**
 * Simple flat array that holds the visited hashes + state Object
 * so the router can navigate back to them
 * @type {Array}
 */
let history = []

export const updateHistory = request => {
  const hash = getActiveHash()

  if (!hash) {
    return
  }

  const activeRoute = getRouteByHash(hash)
  const register = request.register
  const regStore = register.get(symbols.store)
  const routerConfig = getRouterConfig()

  // test preventStorage on route
  const configStore = !getOption(activeRoute.options, 'preventStorage')

  if (regStore && configStore) {
    const toStore = hash.replace(/^\//, '')
    const location = locationInHistory(toStore)
    const stateObject = getStateObject(getActivePage())

    // store hash if it's not a part of history or flag for
    // storage of same hash is true
    if (location === -1 || routerConfig.get('storeSameHash')) {
      history.push({ hash: toStore, state: stateObject })
    } else {
      // if we visit the same route we want to sync history
      const prev = history.splice(location, 1)[0]
      history.push({ hash: prev.hash, state: stateObject })
    }
  }
}

const locationInHistory = hash => {
  for (let i = 0; i < history.length; i++) {
    if (history[i].hash === hash) {
      return i
    }
  }
  return -1
}

export const getHistoryState = hash => {
  let state = null
  if (history.length) {
    // if no hash is provided we get the last
    // pushed history record
    if (!hash) {
      const record = history[history.length - 1]
      // could be null
      state = record.state
    } else {
      if (locationInHistory(hash) !== -1) {
        const record = history[locationInHistory(hash)]
        state = record.state
      }
    }
  }
  return state
}

export const replaceHistoryState = (state = null, hash) => {
  if (!history.length) {
    return
  }
  const location = hash ? locationInHistory(hash) : history.length - 1
  if (location !== -1 && isObject(state)) {
    history[location].state = state
  }
}

const getStateObject = page => {
  if (page && isFunction(page.historyState)) {
    return page.historyState()
  }
  return null
}

export const getHistory = () => {
  return history.slice(0)
}

export const setHistory = (arr = []) => {
  if (isArray(arr)) {
    history = arr
  }
}
