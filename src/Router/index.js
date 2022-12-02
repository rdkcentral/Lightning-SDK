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

import {
  isFunction,
  isPage,
  isObject,
  isBoolean,
  isString,
  getQueryStringParams,
  symbols,
  cleanHash,
} from './utils/helpers'

import {
  bootRouter,
  routeExists,
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
  beforeEachRoute,
  getActiveHash,
  getActiveRoute,
} from './utils/router'

import { focusWidget, getActiveWidget, restoreFocus } from './utils/widgets'
import { getHistory, setHistory, getHistoryState, replaceHistoryState } from './utils/history'
import {
  createRequest,
  getRouteByHash,
  getValuesFromHash,
  getFloor,
  getHashByName,
  keepActivePageAlive,
} from './utils/route'
import { load } from './utils/loader'
import { stripRegex, isWildcard } from './utils/regex'
import { RoutedApp } from './base'
import Registry from '../Registry'

/*
rouThor ==[x]
 */
export let navigateQueue = new Map()
let forcedHash = ''
let resumeHash = ''

/**
 * Start routing the app
 * @param config - route config object
 * @param instance - instance of the app
 */
const startRouter = (config, instance) => {
  bootRouter(config, instance)
  registerListener()
  start()
}

// start translating url
const start = () => {
  let hash = (getHash() || '').replace(/^#/, '')
  const bootKey = '$'
  const params = getQueryStringParams(hash)
  const bootRequest = getBootRequest()
  const rootHash = getRootHash()
  const isDirectLoad = hash.indexOf(bootKey) !== -1

  // prevent direct reload of wildcard routes
  // expect bootComponent
  if (isWildcard.test(hash) && hash !== bootKey) {
    hash = ''
  }

  // store resume point for manual resume
  resumeHash = isDirectLoad ? rootHash : hash || rootHash

  const ready = () => {
    if (!hash && rootHash) {
      if (isString(rootHash)) {
        navigate(rootHash)
      } else if (isFunction(rootHash)) {
        rootHash().then(res => {
          if (isObject(res)) {
            navigate(res.path, res.params)
          } else {
            navigate(res)
          }
        })
      }
    } else {
      queue(hash)
      handleHashChange()
        .then(() => {
          app._refocus()
        })
        .catch(e => {
          console.error(e)
        })
    }
  }

  if (routeExists(bootKey)) {
    if (hash && !isDirectLoad) {
      if (!getRouteByHash(hash)) {
        navigate('*', { failedHash: hash })
        return
      }
    }
    navigate(
      bootKey,
      {
        resume: resumeHash,
        reload: bootKey === hash,
      },
      false
    )
  } else if (isFunction(bootRequest)) {
    bootRequest(params)
      .then(() => {
        ready()
      })
      .catch(e => {
        handleBootError(e)
      })
  } else {
    ready()
  }
}

const handleBootError = e => {
  if (routeExists('!')) {
    navigate('!', { request: { error: e } })
  } else {
    console.error(e)
  }
}

/**
 * start a new request
 * @param url
 * @param args
 * @param store
 */
export const navigate = (url, args = {}, store) => {
  if (isObject(url)) {
    url = getHashByName(url)
    if (!url) {
      return
    }
  }

  let hash = getHash()
  if (!mustUpdateLocationHash() && forcedHash) {
    hash = forcedHash
  }
  if (hash.replace(/^#/, '') !== url) {
    // push request in the queue
    queue(url, args, store)

    setHash(url)
    if (!mustUpdateLocationHash()) {
      forcedHash = url
      handleHashChange(url)
        .then(() => {
          app._refocus()
        })
        .catch(e => {
          console.error(e)
        })
    }
  } else if (args.reload) {
    // push request in the queue
    queue(url, args, store)

    handleHashChange(url)
      .then(() => {
        app._refocus()
      })
      .catch(e => {
        console.error(e)
      })
  }
}

const queue = (hash, args = {}, store) => {
  hash = cleanHash(hash)
  if (!navigateQueue.has(hash)) {
    for (let request of navigateQueue.values()) {
      request.cancel()
    }
    const request = createRequest(hash, args, store)
    navigateQueue.set(decodeURIComponent(hash), request)

    return request
  }
  return false
}

/**
 * Handle change of hash
 * @param override
 * @returns {Promise<void>}
 */
const handleHashChange = async override => {
  const hash = cleanHash(override || getHash())
  const queueId = decodeURIComponent(hash)
  let request = navigateQueue.get(queueId)

  // handle hash updated manually
  if (!request && !navigateQueue.size) {
    request = queue(hash)
  }

  const route = getRouteByHash(hash)

  console.log('ABCDE Route to be navigated =>', route)
  if (!route) {
    if (routeExists('*')) {
      navigate('*', { failedHash: hash })
    } else {
      console.error(`Unable to navigate to: ${hash}`)
    }
    return
  }

  // update current processed request
  request.hash = hash
  request.route = route

  console.log('ABCDE request information =>', request)

  let result = await beforeEachRoute(getActiveHash(), request)

  // test if a local hook is configured for the route
  if (result && route.beforeNavigate) {
    result = await route.beforeNavigate(getActiveHash(), request)
  }
  console.log('ABCDE Result beforenavigate =>', result)
  if (isBoolean(result)) {
    // only if resolve value is explicitly true
    // we continue the current route request
    if (result) {
      console.log('ABCDE resolve hash change', request)
      return resolveHashChange(request)
    }
  } else {
    // if navigation guard didn't return true
    // we cancel the current request
    request.cancel()
    navigateQueue.delete(queueId)

    if (isString(result)) {
      navigate(result)
    } else if (isObject(result)) {
      let store = true
      if (isBoolean(result.store)) {
        store = result.store
      }
      navigate(result.path, result.params, store)
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
  const queueId = decodeURIComponent(hash)
  // store last requested hash so we can
  // prevent a route that resolved later
  // from displaying itself
  setLastHash(hash)

  if (route.path) {
    const component = getComponent(route.path)
    // if a hook is provided for the current route
    if (isFunction(route.hook)) {
      let routerPath = route.path
      if (routerPath.endsWith('?'))
        routerPath = routerPath.substring(0, routerPath.lastIndexOf('/'))
      console.log('ABCDE router path before value from hash =>', routerPath, hash)
      const urlParams = getValuesFromHash(hash, routerPath)
      console.log('ABCDE url parameters =>', urlParams)
      const params = {}
      for (const key of urlParams.keys()) {
        params[key] = urlParams.get(key)
      }
      route.hook(app, { ...params })
    }
    // if there is a component attached to the route
    if (component) {
      // force page to root state to prevent shared state issues
      const activePage = getActivePage()
      if (activePage) {
        const keepAlive = keepActivePageAlive(getActiveRoute(), request)
        if (activePage && route.path === getActiveRoute() && !keepAlive) {
          activePage._setState('')
        }
      }

      if (isPage(component, stage)) {
        load(request).then(() => {
          app._refocus()
          navigateQueue.delete(queueId)
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
            navigateQueue.delete(queueId)
          })
      }
    } else {
      navigateQueue.delete(queueId)
    }
  }
}

/**
 * Directional step in history
 * @param level
 */
export const step = (level = 0) => {
  if (!level || isNaN(level)) {
    return false
  }
  const history = getHistory()
  // for now we only support negative numbers
  level = Math.abs(level)

  // we can't step back past the amount
  // of history entries
  if (level > history.length) {
    if (isFunction(app._handleAppClose)) {
      return app._handleAppClose()
    }
    return app.application.closeApp()
  } else if (history.length) {
    // for now we only support history back
    const route = history.splice(history.length - level, level)[0]
    // store changed history
    setHistory(history)
    return navigate(
      route.hash,
      {
        [symbols.backtrack]: true,
        [symbols.historyState]: route.state,
      },
      false
    )
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
  return false
}

/**
 * Resume Router's page loading process after
 * the BootComponent became visible;
 */
const resume = () => {
  if (isString(resumeHash)) {
    navigate(resumeHash, false)
    resumeHash = ''
  } else if (isFunction(resumeHash)) {
    resumeHash().then(res => {
      resumeHash = ''
      if (isObject(res)) {
        navigate(res.path, res.params)
      } else {
        navigate(res)
      }
    })
  } else {
    console.warn('[Router]: resume() called but no hash found')
  }
}

/**
 * Force reload active hash
 */
const reload = () => {
  if (!isNavigating()) {
    const hash = getActiveHash()
    navigate(hash, { reload: true }, false)
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

export const getResumeHash = () => {
  return resumeHash
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
const registerListener = () => {
  Registry.addEventListener(window, 'hashchange', async () => {
    if (mustUpdateLocationHash()) {
      try {
        await handleHashChange()
      } catch (e) {
        console.error(e)
      }
    }
  })
}

/**
 * Navigate to root hash
 */
const root = () => {
  const rootHash = getRootHash()
  if (isString(rootHash)) {
    navigate(rootHash)
  } else if (isFunction(rootHash)) {
    rootHash().then(res => {
      if (isObject(res)) {
        navigate(res.path, res.params)
      } else {
        navigate(res)
      }
    })
  }
}

// export API
export default {
  startRouter,
  navigate,
  resume,
  step,
  go: step,
  back: step.bind(null, -1),
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
  getHistory,
  setHistory,
  getHistoryState,
  replaceHistoryState,
  getQueryStringParams,
  reload,
  symbols,
  App: RoutedApp,
  // keep backwards compatible
  focusPage: restoreFocus,
  root: root,
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
