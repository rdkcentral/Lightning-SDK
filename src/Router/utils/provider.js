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

import { symbols, getQueryStringParams } from './helpers'
import { app, routes, routeExists, setPreviousState } from './router'
import { getValuesFromHash } from './route'
import emit from './emit'

export const dataHooks = {
  on: request => {
    setPreviousState(app.state || '')
    app._setState('Loading')
    return execProvider(request)
  },
  before: request => {
    return execProvider(request)
  },
  after: request => {
    try {
      execProvider(request, true)
    } catch (e) {
      // for now we fail silently
    }
    return Promise.resolve()
  },
}

const execProvider = (request, emitProvided) => {
  const route = request.route
  const provider = route.provider
  const expires = route.cache ? route.cache * 1000 : 0
  const params = addPersistData(request)
  return provider
    .request(request.page, { ...params })
    .then(() => {
      request.page[symbols.expires] = Date.now() + expires
      if (emitProvided) {
        emit(request.page, 'dataProvided')
      }
    })
    .catch(e => {
      request.page[symbols.expires] = Date.now()
      throw e
    })
}

export const addPersistData = ({ page, route, hash, register = new Map() }) => {
  const urlValues = getValuesFromHash(hash, route.path)
  const queryParams = getQueryStringParams(hash)
  const pageData = new Map([...urlValues, ...register])
  const params = {}

  // make dynamic url data available to the page
  // as instance properties
  for (let [name, value] of pageData) {
    params[name] = value
  }

  if (queryParams) {
    params[symbols.queryParams] = queryParams
  }

  // check navigation register for persistent data
  if (register.size) {
    const obj = {}
    for (let [k, v] of register) {
      obj[k] = v
    }
    page.persist = obj
  }

  // make url data and persist data available
  // via params property
  page.params = params
  emit(page, ['urlParams'], params)

  return params
}

/**
 * Test if page passed cache-time
 * @param page
 * @returns {boolean}
 */
export const isPageExpired = page => {
  if (!page[symbols.expires]) {
    return false
  }

  const expires = page[symbols.expires]
  const now = Date.now()

  return now >= expires
}

export const hasProvider = path => {
  if (routeExists(path)) {
    const record = routes.get(path)
    return !!record.provider
  }
  return false
}

export const getProvider = route => {
  // @todo: fix, route already is passed in
  if (routeExists(route.path)) {
    const { provider } = routes.get(route.path)
    return {
      type: provider.type,
      provider: provider.request,
    }
  }
}
