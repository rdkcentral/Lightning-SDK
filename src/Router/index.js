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
  isComponentConstructor,
  isArray,
  ucfirst,
  isObject,
  isBoolean,
  isString,
  getConfigMap,
  incorrectParams,
  isPromise,
  getQueryStringParams,
  symbols,
} from './utils'

import Transitions from './transitions'
import Log from '../Log'
import { AppInstance } from '../Application'
import { RoutedApp } from './base'
import stats from './stats'

let getHash = () => {
  return document.location.hash
}

let setHash = url => {
  document.location.hash = url
}

export const initRouter = config => {
  if (config.getHash) {
    getHash = config.getHash
  }
  if (config.setHash) {
    setHash = config.setHash
  }
}

/*
rouThor ==[x]
 */

// instance of Lightning.Application
let application

//instance of Lightning.Component
let app

let stage
let widgetsHost
let pagesHost

const pages = new Map()
const providers = new Map()
const modifiers = new Map()
const widgetsPerRoute = new Map()
const routeHooks = new Map()

let register = new Map()
let routerConfig

// widget that has focus
let activeWidget
let rootHash
let bootRequest
let history = []
let initialised = false
let activeRoute
let activeHash
let updateHash = true
let forcedHash
let lastHash = true
let previousState

// page that has focus
let activePage
const hasRegex = /\{\/(.*?)\/([igm]{0,3})\}/g
const isWildcard = /^[!*$]$/

/**
 * Setup Page router
 * @param config - route config object
 * @param instance - instance of the app
 */
export const startRouter = (config, instance) => {
  // backwards compatible
  let { appInstance, routes, provider = () => {}, widgets = () => {} } = config

  if (instance && isPage(instance)) {
    app = instance
  }

  if (!app) {
    app = appInstance || AppInstance
  }

  application = app.application
  pagesHost = application.childList
  stage = app.stage
  routerConfig = getConfigMap()

  // test if required to host pages in a different child
  if (app.pages) {
    pagesHost = app.pages.childList
  }

  // test if app uses widgets
  if (app.widgets && app.widgets.children) {
    widgetsHost = app.widgets.childList
    // hide all widgets on boot
    widgetsHost.forEach(w => (w.visible = false))
  }

  // register step back handler
  app._handleBack = e => {
    step(-1)
    e.preventDefault()
  }

  // register step back handler
  app._captureKey = capture.bind(null)

  if (isArray(routes)) {
    setupRoutes(config)
    start()
  } else if (isFunction(routes)) {
    // register route data bindings
    provider()
    // register routes
    routes()
    // register widgets
    widgets()
  }
}

export const setupRoutes = routesConfig => {
  let bootPage = routesConfig.bootComponent

  if (!initialised) {
    rootHash = routesConfig.root
    if (isFunction(routesConfig.boot)) {
      boot(routesConfig.boot)
    }
    if (bootPage && isPage(bootPage)) {
      route('@boot-page', routesConfig.bootComponent)
    }
    if (isBoolean(routesConfig.updateHash)) {
      updateHash = routesConfig.updateHash
    }
    if (isFunction(routesConfig.beforeEachRoute)) {
      beforeEachRoute = routesConfig.beforeEachRoute
    }
    initialised = true
  }

  routesConfig.routes.forEach(r => {
    route(r.path, r.component || r.hook, r.options)
    if (r.widgets) {
      widget(r.path, r.widgets)
    }
    if (isFunction(r.on)) {
      on(r.path, r.on, r.cache || 0)
    }
    if (isFunction(r.before)) {
      before(r.path, r.before, r.cache || 0)
    }
    if (isFunction(r.after)) {
      after(r.path, r.after, r.cache || 0)
    }
    if (isFunction(r.beforeNavigate)) {
      hook(r.path, r.beforeNavigate)
    }
  })
}

/**
 * create a new route
 * @param route - {string}
 * @param type - {(Lightning.Component|Function()*)}
 * @param modifiers - {Object{}} - preventStorage | clearHistory | storeLast
 */
export const route = (route, type, config) => {
  route = route.replace(/\/+$/, '')
  // if the route is defined we try to push
  // the new type on to the stack
  if (pages.has(route)) {
    let stack = pages.get(route)
    if (!isArray(stack)) {
      stack = [stack]
    }

    // iterate stack and look if there is page instance
    // attached to the route
    const hasPage = stack.filter(o => isPage(o, stage))
    if (hasPage.length) {
      // only allow multiple functions for route
      if (isFunction(type) && !isPage(type, stage)) {
        stack.push(type)
      } else {
        console.warn(`Page for route('${route}') already exists`)
      }
    } else {
      if (isFunction(type)) {
        stack.push(type)
      } else {
        if (!routerConfig.get('lazyCreate')) {
          type = isComponentConstructor(type) ? create(type) : type
          pagesHost.a(type)
        }
        stack.push(type)
      }
    }
    pages.set(route, stack)
  } else {
    if (isPage(type, stage)) {
      // if flag lazy eq false we (test) and create
      // correct component and add it to the childList
      if (!routerConfig.get('lazyCreate')) {
        type = isComponentConstructor(type) ? create(type) : type
        pagesHost.a(type)
      }
    }

    // if lazy we just store the constructor or function
    pages.set(route, [type])

    // store router modifiers
    if (config) {
      modifiers.set(route, config)
    }
  }
}

/**
 * create a route and define it as root.
 * Upon boot we will automatically point browser hash
 * to the defined route
 * @param route - {string}
 * @param type - {(Lightning.Component|Function()*)}
 */
export const root = (url, type, config) => {
  rootHash = url.replace(/\/+$/, '')
  route(url, type, config)
}

/**
 * Define the widgets that need to become visible per route
 * @param url
 * @param widgets
 */
export const widget = (url, widgets = []) => {
  if (!widgetsPerRoute.has(url)) {
    if (!isArray(widgets)) {
      widgets = [widgets]
    }
    widgetsPerRoute.set(url, widgets)
  } else {
    console.warn(`Widgets already exist for ${url}`)
  }
}

const create = type => {
  const page = stage.c({ type, visible: false })
  // if the app has widgets we make them available
  // as an object on the app instance
  if (widgetsHost) {
    page.widgets = getWidgetReferences()
  }

  return page
}

/**
 * The actual loading of the component
 * @param {String} route - the route blueprint, used for data provider look up
 * @param {String} hash - current hash we're routing to
 * */
const load = async ({ route, hash }) => {
  let expired = false
  // for now we maintain one instance of the
  // navigation register and create a local copy
  // that we hand over to the loader
  const routeReg = new Map(register)
  try {
    const payload = await loader({ hash, route, routeReg })
    if (payload && payload.hash === lastHash) {
      // in case of on() providing we need to reset
      // app state;
      if (app.state === 'Loading') {
        if (previousState === 'Widgets') {
          app._setState('Widgets', [activeWidget])
        } else {
          app._setState('')
        }
      }
      // Do page transition if instance
      // is not shared between the routes
      if (!payload.share) {
        await doTransition(payload.page, activePage)
      }
    } else {
      expired = true
    }
    // on expired we only cleanup
    if (expired) {
      Log.debug('[router]:', `Rejected ${payload.hash} because route to ${lastHash} started`)
      if (payload.create && !payload.share) {
        // remove from render-tree
        pagesHost.remove(payload.page)
      }
    } else {
      onRouteFulfilled(payload, routeReg)
      // resolve promise
      return payload.page
    }
  } catch (payload) {
    if (!expired) {
      if (payload.create && !payload.share) {
        // remove from render-tree
        pagesHost.remove(payload.page)
      }
      handleError(payload)
    }
  }
}

const loader = async ({ route, hash, routeReg: register }) => {
  let type = getPageByRoute(route)
  let isConstruct = isComponentConstructor(type)
  let sharedInstance = false
  let provide = false
  let page = null
  let isCreated = false

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
    page = type
    // if we have have a data route for current page
    if (providers.has(route)) {
      if (isPageExpired(type) || type[symbols.hash] !== hash) {
        provide = true
      }
    }
    let currentRoute = activePage && activePage[symbols.route]
    // if the new route is equal to the current route it means that both
    // route share the Component instance and stack location / since this case
    // is conflicting with the way before() and after() loading works we flag it,
    // and check platform settings in we want to re-use instance
    if (route === currentRoute) {
      sharedInstance = true
    }
  } else {
    page = create(type)
    pagesHost.a(page)
    // test if need to request data provider
    if (providers.has(route)) {
      provide = true
    }
    isCreated = true
  }

  // we store hash and route as properties on the page instance
  // that way we can easily calculate new behaviour on page reload
  page[symbols.hash] = hash
  page[symbols.route] = route

  const payload = {
    page,
    route,
    hash,
    register,
    create: isCreated,
    share: sharedInstance,
    event: [isCreated ? 'mounted' : 'changed'],
  }

  try {
    if (provide) {
      const { type: loadType } = providers.get(route)
      // update payload
      payload.loadType = loadType

      // update statistics
      send(hash, `${loadType}-start`, Date.now())
      await triggers[sharedInstance ? 'shared' : loadType](payload)
      send(hash, `${loadType}-end`, Date.now())

      if (hash !== lastHash) {
        return false
      } else {
        emit(page, 'dataProvided')
        // resolve promise
        return payload
      }
    } else {
      addPersistData(payload)
      return payload
    }
  } catch (e) {
    payload.error = e
    return Promise.reject(payload)
  }
}

/**
 * Will be called when a new navigate() request has completed
 * and has not been expired due to it's async nature
 * @param page
 * @param route
 * @param event
 * @param hash
 * @param register
 */
const onRouteFulfilled = ({ page, route, event, hash, share }, register) => {
  // clean up history if modifier is set
  if (hashmod(hash, 'clearHistory')) {
    history.length = 0
  } else if (activeHash && !isWildcard.test(route)) {
    updateHistory(activeHash)
  }

  // we only update the stackLocation if a route
  // is not expired before it resolves
  const location = getPageStackLocation(route)

  if (!isNaN(location)) {
    let stack = pages.get(route)
    stack[location] = page
    pages.set(route, stack)
  }

  if (event) {
    emit(page, event)
  }

  // only update widgets if we have a host
  if (widgetsHost) {
    updateWidgets(page)
  }

  // force refocus of the app
  app._refocus()

  // we want to clean up if there is an
  // active page that is not being shared
  // between current and previous route
  if (activePage && !share) {
    cleanUp(activePage, activePage[symbols.route], register)
  }

  // flag this navigation cycle as ready
  send(hash, 'ready')

  activePage = page
  activeRoute = route
  activeHash = hash

  Log.info('[route]:', route)
  Log.info('[hash]:', hash)
}

const triggerAfter = args => {
  // after() we execute the provider
  // and resolve immediately
  try {
    execProvider(args)
  } catch (e) {
    // we fail silently
  }
  return Promise.resolve()
}

const triggerBefore = args => {
  // before() we continue only when data resolved
  return execProvider(args)
}

const triggerOn = args => {
  // on() we need to place the app in
  // a Loading state and recover from it
  // on resolve
  previousState = app.state || ''
  app._setState('Loading')
  return execProvider(args)
}

const triggerShared = args => {
  return execProvider(args)
}

const triggers = {
  on: triggerOn,
  after: triggerAfter,
  before: triggerBefore,
  shared: triggerShared,
}

const hook = (route, handler) => {
  if (!routeHooks.has(route)) {
    routeHooks.set(route, handler)
  }
}

const emit = (page, events = [], params = {}) => {
  if (!isArray(events)) {
    events = [events]
  }
  events.forEach(e => {
    const event = `_on${ucfirst(e)}`
    if (isFunction(page[event])) {
      page[event](params)
    }
  })
}

const send = (hash, key, value) => {
  stats.send(hash, key, value)
}

const handleError = args => {
  if (!args.page) {
    console.error(args)
  } else {
    const hash = args.page[symbols.hash]
    // flag this navigation cycle as rejected
    send(hash, 'e', args.error)
    // force expire
    args.page[symbols.expires] = Date.now()
    if (pages.has('!')) {
      load({ route: '!', hash }).then(errorPage => {
        errorPage.error = { page: args.page, error: args.error }
        // on() loading type will force the app to go
        // in a loading state so on error we need to
        // go back to root state
        if (app.state === 'Loading') {
          app._setState('')
        }
        // make sure we delegate focus to the error page
        if (activePage !== errorPage) {
          activePage = errorPage
          app._refocus()
        }
      })
    } else {
      Log.error(args.page, args.error)
    }
  }
}

const updateHistory = hash => {
  const storeHash = getMod(hash, 'store')
  const regStore = register.get(symbols.store)
  let configPrevent = hashmod(hash, 'preventStorage')
  let configStore = true

  if ((isBoolean(storeHash) && storeHash === false) || configPrevent) {
    configStore = false
  }

  if (regStore && configStore) {
    const toStore = hash.replace(/^\//, '')
    const location = history.indexOf(toStore)
    // store hash if it's not a part of history or flag for
    // storage of same hash is true
    if (location === -1 || routerConfig.get('storeSameHash')) {
      history.push(toStore)
    } else {
      // if we visit the same route we want to sync history
      history.push(history.splice(location, 1)[0])
    }
  }
}

export const mustReuse = route => {
  const mod = routemod(route, 'reuseInstance')
  const config = routerConfig.get('reuseInstance')

  // route always has final decision
  if (isBoolean(mod)) {
    return mod
  }
  return !(isBoolean(config) && config === false)
}

export const boot = cb => {
  bootRequest = cb
}

const addPersistData = ({ page, route, hash, register = new Map() }) => {
  const urlValues = getValuesFromHash(hash, route)
  const pageData = new Map([...urlValues, ...register])
  const params = {}

  // make dynamic url data available to the page
  // as instance properties
  for (let [name, value] of pageData) {
    page[name] = value
    params[name] = value
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

const execProvider = args => {
  const { cb, expires } = providers.get(args.route)
  const params = addPersistData(args)
  /**
   * In the first version of the Router, a reference to the page is made
   * available to the callback function as property of {params}.
   * Since this is error prone (named url parts are also being spread inside this object)
   * we made the page reference the first parameter and url values the second.
   * -
   * We keep it backwards compatible for now but a warning is showed in the console.
   */
  if (incorrectParams(cb, args.route)) {
    // keep page as params property backwards compatible for now
    return cb({ page: args.page, ...params }).then(() => {
      args.page[symbols.expires] = Date.now() + expires
    })
  } else {
    return cb(args.page, { ...params }).then(() => {
      args.page[symbols.expires] = Date.now() + expires
    })
  }
}

/**
 * execute transition between new / old page and
 * toggle the defined widgets
 * @todo: platform override default transition
 * @param pageIn
 * @param pageOut
 */
const doTransition = (pageIn, pageOut = null) => {
  let transition = pageIn.pageTransition || pageIn.easing

  const hasCustomTransitions = !!(pageIn.smoothIn || pageIn.smoothInOut || transition)
  const transitionsDisabled = routerConfig.get('disableTransitions')

  if (pageIn.easing) {
    console.warn('easing() method is deprecated and will be removed. Use pageTransition()')
  }
  // default behaviour is a visibility toggle
  if (!hasCustomTransitions || transitionsDisabled) {
    pageIn.visible = true
    if (pageOut) {
      pageOut.visible = false
    }
    return Promise.resolve()
  }

  if (transition) {
    let type
    try {
      type = transition.call(pageIn, pageIn, pageOut)
    } catch (e) {
      type = 'crossFade'
    }

    if (isPromise(type)) {
      return type
    }

    if (isString(type)) {
      const fn = Transitions[type]
      if (fn) {
        return fn(pageIn, pageOut)
      }
    }

    // keep backwards compatible for now
    if (pageIn.smoothIn) {
      // provide a smooth function that resolves itself
      // on transition finish
      const smooth = (p, v, args = {}) => {
        return new Promise(resolve => {
          pageIn.visible = true
          pageIn.setSmooth(p, v, args)
          pageIn.transition(p).on('finish', () => {
            resolve()
          })
        })
      }
      return pageIn.smoothIn({ pageIn, smooth })
    }
  }

  return Transitions.crossFade(pageIn, pageOut)
}

/**
 * update the visibility of the available widgets
 * for the current page / route
 * @param page
 */
const updateWidgets = page => {
  const route = page[symbols.route]

  // force lowercase lookup
  const configured = (widgetsPerRoute.get(route) || []).map(ref => ref.toLowerCase())

  widgetsHost.forEach(widget => {
    widget.visible = configured.indexOf(widget.ref.toLowerCase()) !== -1
    if (widget.visible) {
      emit(widget, ['activated'], page)
    }
  })
  if (app.state === 'Widgets' && activeWidget && !activeWidget.visible) {
    app._setState('')
  }
}

const cleanUp = (page, route, register) => {
  const lazyDestroy = routerConfig.get('lazyDestroy')
  const destroyOnBack = routerConfig.get('destroyOnHistoryBack')
  const keepAlive = read('keepAlive', register)
  const isFromHistory = read(symbols.backtrack, register)
  let doCleanup = false

  if (isFromHistory && (destroyOnBack || lazyDestroy)) {
    doCleanup = true
  } else if (lazyDestroy && !keepAlive) {
    doCleanup = true
  }

  if (doCleanup) {
    // in lazy create mode we store constructor
    // and remove the actual page from host
    const stack = pages.get(route)
    const location = getPageStackLocation(route)

    // grab original class constructor if statemachine routed
    // else store constructor
    stack[location] = page._routedType || page.constructor
    pages.set(route, stack)

    // actual remove of page from memory
    pagesHost.remove(page)

    // force texture gc() if configured
    // so we can cleanup textures in the same tick
    if (routerConfig.get('gcOnUnload')) {
      stage.gc()
    }
  } else {
    // If we're not removing the page we need to
    // reset it's properties
    page.patch({
      x: 0,
      y: 0,
      scale: 1,
      alpha: 1,
      visible: false,
    })
  }
  send(page[symbols.hash], 'stop')
}

/**
 * Test if page passed cache-time
 * @param page
 * @returns {boolean}
 */
const isPageExpired = page => {
  if (!page[symbols.expires]) {
    return false
  }

  const expires = page[symbols.expires]
  const now = Date.now()

  return now >= expires
}

const getPageByRoute = route => {
  return getPageFromStack(route).item
}

/**
 * Returns the current location of a page constructor or
 * page instance for a route
 * @param route
 */
const getPageStackLocation = route => {
  return getPageFromStack(route).index
}

const getPageFromStack = route => {
  if (!pages.has(route)) {
    return false
  }

  let index = -1
  let item = null
  let stack = pages.get(route)
  if (!Array.isArray(stack)) {
    stack = [stack]
  }

  for (let i = 0, j = stack.length; i < j; i++) {
    if (isPage(stack[i], stage)) {
      index = i
      item = stack[i]
      break
    }
  }

  return { index, item }
}

/**
 * Simple route length calculation
 * @param route {string}
 * @returns {number} - floor
 */
const getFloor = route => {
  return stripRegex(route).split('/').length
}

/**
 * Test if a route is part regular expressed
 * and replace it for a simple character
 * @param route
 * @returns {*}
 */
const stripRegex = (route, char = 'R') => {
  // if route is part regular expressed we replace
  // the regular expression for a character to
  // simplify floor calculation and backtracking
  if (hasRegex.test(route)) {
    route = route.replace(hasRegex, char)
  }
  return route
}

/**
 * return all stored routes that live on the same floor
 * @param floor
 * @returns {Array}
 */
const getRoutesByFloor = floor => {
  const matches = []
  // simple filter of level candidates
  for (let [route] of pages.entries()) {
    if (getFloor(route) === floor) {
      matches.push(route)
    }
  }
  return matches
}

/**
 * return a matching route by provided hash
 * hash: home/browse/12 will match:
 * route: home/browse/:categoryId
 * @param hash {string}
 * @returns {string|boolean} - route
 */
const getRouteByHash = hash => {
  const getUrlParts = /(\/?:?[@\w%\s-]+)/g
  // grab possible candidates from stored routes
  const candidates = getRoutesByFloor(getFloor(hash))
  // break hash down in chunks
  const hashParts = hash.match(getUrlParts) || []
  // test if the part of the hash has a replace
  // regex lookup id
  const hasLookupId = /\/:\w+?@@([0-9]+?)@@/
  const isNamedGroup = /^\/:/

  // to simplify the route matching and prevent look around
  // in our getUrlParts regex we get the regex part from
  // route candidate and store them so that we can reference
  // them when we perform the actual regex against hash
  let regexStore = []

  let matches = candidates.filter(route => {
    let isMatching = true

    if (isWildcard.test(route)) {
      return false
    }

    // replace regex in route with lookup id => @@{storeId}@@
    if (hasRegex.test(route)) {
      const regMatches = route.match(hasRegex)
      if (regMatches && regMatches.length) {
        route = regMatches.reduce((fullRoute, regex) => {
          const lookupId = regexStore.length
          fullRoute = fullRoute.replace(regex, `@@${lookupId}@@`)
          regexStore.push(regex.substring(1, regex.length - 1))
          return fullRoute
        }, route)
      }
    }

    const routeParts = route.match(getUrlParts) || []

    for (let i = 0, j = routeParts.length; i < j; i++) {
      const routePart = routeParts[i]
      const hashPart = hashParts[i]

      // Since we support catch-all and regex driven name groups
      // we first test for regex lookup id and see if the regex
      // matches the value from the hash
      if (hasLookupId.test(routePart)) {
        const routeMatches = hasLookupId.exec(routePart)
        const storeId = routeMatches[1]
        const routeRegex = regexStore[storeId]

        // split regex and modifiers so we can use both
        // to create a new RegExp
        // eslint-disable-next-line
        const regMatches = /\/([^\/]+)\/([igm]{0,3})/.exec(routeRegex)

        if (regMatches && regMatches.length) {
          const expression = regMatches[1]
          const modifiers = regMatches[2]

          const regex = new RegExp(`^/${expression}$`, modifiers)

          if (!regex.test(hashPart)) {
            isMatching = false
          }
        }
      } else if (isNamedGroup.test(routePart)) {
        // we kindly skip namedGroups because this is dynamic
        // we only need to the static and regex drive parts
        continue
      } else if (hashPart && routePart.toLowerCase() !== hashPart.toLowerCase()) {
        isMatching = false
      }
    }
    return isMatching
  })

  if (matches.length) {
    // we give prio to static routes over dynamic
    matches = matches.sort(a => {
      return isNamedGroup.test(a) ? -1 : 1
    })
    return matches[0]
  }

  return false
}

/**
 * Extract dynamic values from location hash and return a namedgroup
 * of key (from route) value (from hash) pairs
 * @param hash {string} - the actual location hash
 * @param route {string} - the route as defined in route
 */
const getValuesFromHash = (hash, route) => {
  // replace the regex definition from the route because
  // we already did the matching part
  route = stripRegex(route, '')

  const getUrlParts = /(\/?:?[\w%\s-]+)/g
  const hashParts = hash.match(getUrlParts) || []
  const routeParts = route.match(getUrlParts) || []
  const getNamedGroup = /^\/:([\w-]+)\/?/

  return routeParts.reduce((storage, value, index) => {
    const match = getNamedGroup.exec(value)
    if (match && match.length) {
      storage.set(match[1], decodeURIComponent(hashParts[index].replace(/^\//, '')))
    }
    return storage
  }, new Map())
}

/**
 * Will be called before a route starts, can be overridden
 * via routes config
 * @param from - route we came from
 * @param to - route we navigate to
 * @returns {Promise<*>}
 */
let beforeEachRoute = async (from, to) => {
  return true
}

const handleHashChange = async override => {
  const hash = override || getHash()
  const route = getRouteByHash(hash)

  let result = (await beforeEachRoute(activeRoute, route)) || true

  // test if a local hook is configured for the route
  if (routeHooks.has(route)) {
    const handler = routeHooks.get(route)
    result = (await handler()) || true
  }

  if (isBoolean(result)) {
    // only if resolve value is explicitly true
    // we continue the current route request
    if (result) {
      return resolveHashChange(hash, route)
    }
  } else if (isString(result)) {
    navigate(result)
  } else if (isObject(result)) {
    navigate(result.path, result.params)
  }
}

const resolveHashChange = (hash, route) => {
  // add a new record for page statistics
  send(hash)

  // store last requested hash so we can
  // prevent a route that resolved later
  // from displaying itself
  lastHash = hash

  if (route) {
    // would be strange if this fails but we do check
    if (pages.has(route)) {
      let stored = pages.get(route)
      send(hash, 'route', route)

      if (!isArray(stored)) {
        stored = [stored]
      }

      stored.forEach((type, idx, stored) => {
        if (isPage(type, stage)) {
          load({ route, hash }).then(() => {
            app._refocus()
          })
        } else if (isPromise(type)) {
          type()
            .then(contents => {
              return contents.default
            })
            .then(module => {
              // flag dynamic as loaded
              stored[idx] = module

              return load({ route, hash })
            })
            .then(() => {
              app._refocus()
            })
        } else {
          const urlParams = getValuesFromHash(hash, route)
          const params = {}
          for (const key of urlParams.keys()) {
            params[key] = urlParams.get(key)
          }

          // invoke
          type.call(null, app, { ...params })
        }
      })
    }
  } else {
    if (pages.has('*')) {
      load({ route: '*', hash }).then(() => {
        app._refocus()
      })
    }
  }
}

const getMod = (hash, key) => {
  const config = modifiers.get(getRouteByHash(hash))
  if (isObject(config)) {
    return config[key]
  }
}

const hashmod = (hash, key) => {
  return routemod(getRouteByHash(hash), key)
}

const routemod = (route, key) => {
  if (modifiers.has(route)) {
    const config = modifiers.get(route)
    return config[key]
  }
}

const read = (flag, register) => {
  if (register.has(flag)) {
    return register.get(flag)
  }
  return false
}

const createRegister = flags => {
  const reg = new Map()
  // store user defined and router
  // defined flags in register
  ;[...Object.keys(flags), ...Object.getOwnPropertySymbols(flags)].forEach(key => {
    reg.set(key, flags[key])
  })
  return reg
}

export const navigate = (url, args, store = true) => {
  let hash = getHash()

  // for now we use one register instance and create a local
  // copy for the loader
  register.clear()

  if (!mustUpdateHash() && forcedHash) {
    hash = forcedHash
  }

  if (isObject(args)) {
    register = createRegister(args)
  } else if (isBoolean(args) && !args) {
    // if explicit set to false we don't want
    // to store the route
    store = args
  }

  // we only store complete routes, so we set
  // a special register flag
  register.set(symbols.store, store)

  if (hash.replace(/^#/, '') !== url) {
    if (!mustUpdateHash()) {
      forcedHash = url
      handleHashChange(url)
    } else {
      setHash(url)
    }
  } else if (read('reload', register)) {
    handleHashChange(hash)
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

  // is we still have routes in our history
  // we splice the last of and navigate to that route
  if (history.length) {
    // for now we only support history back
    const route = history.splice(history.length - 1, 1)
    return navigate(route[0], { [symbols.backtrack]: true }, false)
  } else if (routerConfig.get('backtrack')) {
    const hashLastPart = /(\/:?[\w%\s-]+)$/
    let hash = stripRegex(getHash())
    let floor = getFloor(hash)

    // test if we got deeplinked
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

const capture = ({ key }) => {
  // in Loading state we want to stop propagation
  // by returning undefined
  if (app.state === 'Loading') {
    return
  }

  // if not set we want to continue propagation
  // by explicitly returning false
  if (!routerConfig.get('numberNavigation')) {
    return false
  }
  key = parseInt(key)
  if (!isNaN(key)) {
    let match
    let idx = 1
    for (let route of pages.keys()) {
      if (idx === key) {
        match = route
        break
      } else {
        idx++
      }
    }
    if (match) {
      navigate(match)
    }
  }
  return false
}

// start translating url
export const start = () => {
  const bootKey = '@boot-page'
  const hasBootPage = pages.has('@boot-page')
  const hash = getHash()
  const params = getQueryStringParams(hash)

  // if we refreshed the boot-page we don't want to
  // redirect to this page so we force rootHash load
  const isDirectLoad = hash.indexOf(bootKey) !== -1
  const ready = () => {
    if (hasBootPage) {
      navigate('@boot-page', {
        [symbols.resume]: isDirectLoad ? rootHash : hash || rootHash,
        reload: true,
      })
    } else if (!hash && rootHash) {
      if (isString(rootHash)) {
        navigate(rootHash)
      } else if (isFunction(rootHash)) {
        rootHash().then(url => {
          navigate(url)
        })
      }
    } else {
      handleHashChange()
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
 * Data binding to a route will invoke a loading screen
 * @param {String} route - the route
 * @param {Function} cb - must return a promise
 * @param {Number} expires - seconds after first time active that data expires
 * @param {String} type - page loading type
 */
export const on = (route, cb, expires = 0, type = 'on') => {
  if (providers.has(route)) {
    console.warn(`provider for ${route} already exists`)
  } else {
    providers.set(route, {
      cb,
      expires: expires * 1000,
      type,
    })
  }
}

/**
 * Request data binding for a route before
 * the page loads (active page will stay visible)
 * @param route
 * @param cb
 * @param expires
 */
export const before = (route, cb, expires = 0) => {
  on(route, cb, expires, 'before')
}

/**
 * Request data binding for a route after the page has
 * been loaded
 * @param route
 * @param cb
 * @param expires
 */
export const after = (route, cb, expires = 0) => {
  on(route, cb, expires, 'after')
}

const getWidgetReferences = () => {
  return widgetsHost.get().reduce((storage, widget) => {
    const key = widget.ref.toLowerCase()
    storage[key] = widget
    return storage
  }, {})
}

const getWidgetByName = name => {
  name = ucfirst(name)
  return widgetsHost.getByRef(name) || false
}

/**
 * delegate app focus to a on-screen widget
 * @param name - {string}
 */
export const focusWidget = name => {
  const widget = getWidgetByName(name)
  if (name) {
    // store reference
    activeWidget = widget
    // somewhat experimental
    if (app.state === 'Widgets') {
      app.reload(activeWidget)
    } else {
      app._setState('Widgets', [activeWidget])
    }
  }
}

export const handleRemote = (type, name) => {
  if (type === 'widget') {
    focusWidget(name)
  } else if (type === 'page') {
    restoreFocus()
  }
}

/**
 * Resume Router's page loading process after
 * the BootComponent became visible;
 */
export const resume = () => {
  if (register.has(symbols.resume)) {
    const hash = register.get(symbols.resume).replace(/^#+/, '')
    if (getRouteByHash(hash) && hash) {
      navigate(hash, false)
    } else if (rootHash) {
      navigate(rootHash, false)
    }
  }
}

export const restore = () => {
  if (routerConfig.get('autoRestoreRemote')) {
    handleRemote('page')
  }
}

const hash = () => {
  return getHash()
}

const mustUpdateHash = () => {
  // we need support to either turn change hash off
  // per platform or per app
  const updateConfig = routerConfig.get('updateHash')
  return !((isBoolean(updateConfig) && !updateConfig) || (isBoolean(updateHash) && !updateHash))
}

export const restoreFocus = () => {
  activeWidget = null
  app._setState('')
}

export const getActivePage = () => {
  if (activePage && activePage.attached) {
    return activePage
  } else {
    return app
  }
}

export const getActiveRoute = () => {
  return activeRoute
}

export const getActiveHash = () => {
  return activeHash
}

export const getActiveWidget = () => {
  return activeWidget
}

// listen to url changes
window.addEventListener('hashchange', () => {
  handleHashChange()
})

// export API
export default {
  startRouter,
  navigate,
  root,
  resume,
  route,
  on,
  before,
  after,
  boot,
  step,
  restoreFocus,
  focusPage: restoreFocus,
  focusWidget,
  handleRemote,
  start,
  add: setupRoutes,
  widget,
  hash,
  getActivePage,
  getActiveWidget,
  getActiveRoute,
  getActiveHash,
  App: RoutedApp,
  restore,
}
