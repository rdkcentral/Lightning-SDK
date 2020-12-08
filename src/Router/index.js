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
  isFunction,
  isPage,
  isObject,
  isBoolean,
  isString,
  getQueryStringParams,
  symbols,
} from './utils/helpers'

import {
  bootRouter,
  hasRoute,
  getRootHash,
  getBootRequest,
  mustUpdateLocationHash,
  getComponent,
  storeComponent,
  stage,
  app,
  routerConfig,
  setLastHash,
  getActivePage,
  routes,
  beforeEachRoute,
  getActiveHash,
  getActiveRoute,
} from './utils/router'

import { focusWidget, getActiveWidget, restoreFocus } from './utils/widgets'
import { getHistory, setHistory } from './utils/history'
import { createRequest, getRouteByHash, getValuesFromHash, getFloor } from './utils/route'
import { load } from './utils/loader'
import { stripRegex } from './utils/regex'
import { RoutedApp } from './base'

/*
rouThor ==[x]
 */
let navigateQueue = new Map()
let forcedHash = ''
let resumeHash = ''

/**
 * Start routing the app
 * @param config - route config object
 * @param instance - instance of the app
 */
const startRouter = (config, instance) => {
  bootRouter(config, instance)
  start()
}

// start translating url
const start = () => {
  const bootKey = '@router-boot-page'
  const hash = getHash()
  const params = getQueryStringParams(hash)
  const bootRequest = getBootRequest()

  // if we refreshed the boot-page we don't want to
  // redirect to this page so we force rootHash load
  const isDirectLoad = hash.indexOf(bootKey) !== -1
  const ready = () => {
    const rootHash = getRootHash()

    if (hasRoute(bootKey)) {
      resumeHash = isDirectLoad ? rootHash : hash || rootHash
      navigate(bootKey)
    } else if (!hash && rootHash) {
      if (isString(rootHash)) {
        navigate(rootHash)
      } else if (isFunction(rootHash)) {
        rootHash().then(url => {
          navigate(url)
        })
      }
    } else {
      queue(hash)
      handleHashChange().then(() => {
        app._refocus()
      })
    }
  }
  if (isFunction(bootRequest)) {
    bootRequest(params).then(() => {
      ready()
    })
  } else {
    ready()
  }
}

/**
 * start a new request
 * @param url
 * @param args
 * @param store
 */
export const navigate = (url, args, store = true) => {
  // push request in the queue
  queue(url, args, store)

  let hash = getHash()
  if (!mustUpdateLocationHash() && forcedHash) {
    hash = forcedHash
  }
  if (hash.replace(/^#/, '') !== url) {
    if (!mustUpdateLocationHash()) {
      forcedHash = url
      handleHashChange(url).then(() => {
        app._refocus()
      })
    } else {
      setHash(url)
    }
  } else {
    // @todo: reload url if in register
  }
}

const queue = (hash, args = {}, store = true) => {
  hash = hash.replace(/^#/, '')
  if (!navigateQueue.has(hash)) {
    for (let request of navigateQueue.values()) {
      request.cancel()
    }
    navigateQueue.set(hash, createRequest(hash, args, store))
    return true
  }

  return false
}

/**
 * Handle change of hash
 * @param override
 * @returns {Promise<void>}
 */
const handleHashChange = async override => {
  const hash = (override || getHash()).replace(/^#/, '')
  const request = navigateQueue.get(hash)
  const route = getRouteByHash(hash)

  if (!request) {
    if (routes.has('*')) {
      navigate('*')
    } else {
      console.error(`Unable to navigate to: ${hash}`)
    }
    return
  }

  // update current processed request
  request.hash = hash
  request.route = route

  let result = await beforeEachRoute(getActiveHash(), request)

  // test if a local hook is configured for the route
  if (route.beforeNavigate) {
    result = await route.beforeNavigate(getActiveHash(), request)
  }

  if (isBoolean(result)) {
    // only if resolve value is explicitly true
    // we continue the current route request
    if (result) {
      return resolveHashChange(request)
    }
  } else {
    // if navigation guard didn't return true
    // we cancel the current request
    request.cancel()
    navigateQueue.delete(request.hash)

    if (isString(result)) {
      navigate(result)
    } else if (isObject(result)) {
      navigate(result.path, result.params)
    }
  }
}

/**
 * Continue processing the hash change if not blocked
 * by global or local hook
 * @param request - {}
 */
const resolveHashChange = request => {
  const hash = request.hash
  const route = request.route
  // store last requested hash so we can
  // prevent a route that resolved later
  // from displaying itself
  setLastHash(hash)

  if (route.path) {
    const component = getComponent(route.path)
    // if a hook is provided for the current route
    if (isFunction(route.hook)) {
      const urlParams = getValuesFromHash(hash, route.path)
      const params = {}
      for (const key of urlParams.keys()) {
        params[key] = urlParams.get(key)
      }
      route.hook(app, { ...params })
    }
    // if there is a component attached to the route
    if (component) {
      if (isPage(component, stage)) {
        load(request).then(() => {
          app._refocus()
          navigateQueue.delete(hash)
        })
      } else {
        // of the component is not a constructor
        // or a Component instance we can assume
        // that it's a dynamic import
        component()
          .then(contents => {
            return contents.default
          })
          .then(module => {
            storeComponent(route.path, module)
            return load(request)
          })
          .then(() => {
            app._refocus()
            navigateQueue.delete(hash)
          })
      }
    } else {
      navigateQueue.delete(hash)
    }
  }
}

/**
 * Directional step in history
 * @param direction
 */
export const step = (direction = 0) => {
  if (!direction) {
    return false
  }

  const history = getHistory()
  // is we still have routes in our history
  // we splice the last of and navigate to that route
  if (history.length) {
    // for now we only support history back
    const route = history.splice(history.length - 1, 1)[0]
    // store changed history
    setHistory(history)
    return navigate(route, { [symbols.backtrack]: true }, false)
  } else if (routerConfig.get('backtrack')) {
    const hashLastPart = /(\/:?[\w%\s-]+)$/
    let hash = stripRegex(getHash())
    let floor = getFloor(hash)

    // test if we got deep-linked
    if (floor > 1) {
      while (floor--) {
        // strip of last part
        hash = hash.replace(hashLastPart, '')
        // if we have a configured route
        // we navigate to it
        if (getRouteByHash(hash)) {
          return navigate(hash, { [symbols.backtrack]: true }, false)
        }
      }
    }
  }

  if (isFunction(app._handleAppClose)) {
    return app._handleAppClose()
  }
  return false
}

/**
 * Resume Router's page loading process after
 * the BootComponent became visible;
 */
const resume = () => {
  if (resumeHash) {
    navigate(resumeHash, false)
  } else {
    console.warn('[Router]: resume() called but no hash found')
  }
}

/**
 * Query if the Router is still processing a Request
 * @returns {boolean}
 */
const isNavigating = () => {
  if (navigateQueue.size) {
    let isProcessing = false
    for (let request of navigateQueue.values()) {
      if (!request.isCancelled) {
        isProcessing = true
      }
    }
    return isProcessing
  }
  return false
}

/**
 * By default we return the location hash
 * @returns {string}
 */
let getHash = () => {
  return document.location.hash
}

/**
 * Update location hash
 * @param url
 */
let setHash = url => {
  document.location.hash = url
}

/**
 * This can be called from the platform / bootstrapper to override
 * the default getting and setting of the hash
 * @param config
 */
export const initRouter = config => {
  if (config.getHash) {
    getHash = config.getHash
  }
  if (config.setHash) {
    setHash = config.setHash
  }
}

/**
 * On hash change we start processing
 */
window.addEventListener('hashchange', async () => {
  await handleHashChange()
})

// export API
export default {
  startRouter,
  navigate,
  resume,
  step,
  activePage: getActivePage,
  getActivePage() {
    // warning
    return getActivePage()
  },
  getActiveRoute,
  getActiveHash,
  focusWidget,
  getActiveWidget,
  restoreFocus,
  isNavigating,
  App: RoutedApp,
  // keep backwards compatible
  focusPage: restoreFocus,
  /**
   * Deprecated api methods
   */
  setupRoutes() {
    console.warn('Router: setupRoutes is deprecated, consolidate your configuration')
    console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration')
  },
  on() {
    console.warn('Router.on() is deprecated, consolidate your configuration')
    console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration')
  },
  before() {
    console.warn('Router.before() is deprecated, consolidate your configuration')
    console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration')
  },
  after() {
    console.warn('Router.after() is deprecated, consolidate your configuration')
    console.warn('https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration')
  },
}
