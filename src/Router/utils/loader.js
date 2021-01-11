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

import {
  app,
  getComponent,
  onRequestResolved,
  getLastHash,
  pagesHost,
  stage,
  getPreviousState,
  getActivePage,
  routerConfig,
} from './router'

import Log from '../../Log'
import { isBoolean, isComponentConstructor, symbols } from './helpers'
import { getProvider, hasProvider, isPageExpired, types, addPersistData } from './provider'
import { createComponent } from './components'
import { executeTransition } from './transition'
import { getActiveWidget } from './widgets'
import emit from './emit'
import { getOption } from './route'
import { navigate } from '../index'
import { setHistory, updateHistory } from './history'
import { isWildcard } from './regex'

/**
 * The actual loading of the component
 * */
export const load = async request => {
  let expired = false
  try {
    request = await loader(request)
    if (request && !request.isCancelled) {
      // in case of on() providing we need to reset
      // app state;
      if (app.state === 'Loading') {
        if (getPreviousState() === 'Widgets') {
          app._setState('Widgets', [getActiveWidget()])
        } else {
          app._setState('')
        }
      }
      // Do page transition if instance
      // is not shared between the routes
      if (!request.isSharedInstance && !request.isCancelled) {
        await executeTransition(request.page, getActivePage())
      }
    } else {
      expired = true
    }
    // on expired we only cleanup
    if (expired || request.isCancelled) {
      Log.debug('[router]:', `Rejected ${request.hash} because route to ${getLastHash()} started`)
      if (request.isCreated && !request.isSharedInstance) {
        // remove from render-tree
        pagesHost.remove(request.page)
      }
    } else {
      onRequestResolved(request)
      // resolve promise
      return request.page
    }
  } catch (request) {
    if (!expired) {
      // @todo: revisit
      const { route } = request
      // clean up history if modifier is set
      if (getOption(route.options, 'clearHistory')) {
        setHistory([])
      } else if (!isWildcard.test(route.path)) {
        updateHistory(request)
      }

      if (request.isCreated && !request.isSharedInstance) {
        // remove from render-tree
        pagesHost.remove(request.page)
      }
      handleError(request)
    }
  }
}

const loader = async request => {
  const route = request.route
  const hash = request.hash
  const register = request.register

  // todo: grab from Route instance
  let type = getComponent(route.path)
  let isConstruct = isComponentConstructor(type)
  let provide = false

  // if it's an instance bt we're not coming back from
  // history we test if we can re-use this instance
  if (!isConstruct && !register.get(symbols.backtrack)) {
    if (!mustReuse(route)) {
      type = type.constructor
      isConstruct = true
    }
  }

  // If type is not a constructor
  if (!isConstruct) {
    request.page = type
    // if we have have a data route for current page
    if (hasProvider(route.path)) {
      if (isPageExpired(type) || type[symbols.hash] !== hash) {
        provide = true
      }
    }
    let currentRoute = getActivePage() && getActivePage()[symbols.route]
    // if the new route is equal to the current route it means that both
    // route share the Component instance and stack location / since this case
    // is conflicting with the way before() and after() loading works we flag it,
    // and check platform settings in we want to re-use instance
    if (route.path === currentRoute) {
      request.isSharedInstance = true
    }
  } else {
    request.page = createComponent(stage, type)
    pagesHost.a(request.page)
    // test if need to request data provider
    if (hasProvider(route.path)) {
      provide = true
    }
    request.isCreated = true
  }

  // we store hash and route as properties on the page instance
  // that way we can easily calculate new behaviour on page reload
  request.page[symbols.hash] = hash
  request.page[symbols.route] = route.path

  try {
    if (provide) {
      // extract attached data-provider for route
      // we're processing
      const { type: loadType, provider } = getProvider(route)

      // update running request
      request.provider = provider
      request.providerType = loadType

      await types[request.isSharedInstance ? 'shared' : loadType](request)

      // we early exit if the current request is expired
      if (hash !== getLastHash()) {
        return false
      } else {
        emit(request.page, 'dataProvided')
        // resolve promise
        return request
      }
    } else {
      addPersistData(request)
      return request
    }
  } catch (e) {
    request.error = e
    return Promise.reject(request)
  }
}

const handleError = request => {
  if (request && request.error) {
    console.error(request.error)
  } else if (request) {
    Log.error(request)
  }

  if (request.page) {
    navigate('!', { request }, false)
  }
}

export const mustReuse = route => {
  const opt = getOption(route.options, 'reuseInstance')
  const config = routerConfig.get('reuseInstance')

  // route always has final decision
  if (isBoolean(opt)) {
    return opt
  }
  return !(isBoolean(config) && config === false)
}
