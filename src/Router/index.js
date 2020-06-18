import {
  isFunction,
  isPage,
  isLightningComponent,
  isArray,
  ucfirst,
  isObject,
  isBoolean,
  isString,
} from './utils'
import Transitions from './transitions'
import Settings from '../Settings'
import Log from '../Log'

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
-------
@todo:

- data provider timeout
- add route mapping
- optional flag destroyOnHistoryBack
- custom before trigger
- manual expire
- route to same page (with force expire)
- lazy load widgets (?)
- fix on reuseInstance and now data provider

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
let register = new Map()

// widget that has focus
let activeWidget
let rootHash
let bootRequest
let history = []

// page that has focus
export let activePage
const hasRegex = /\{\/(.*?)\/([igm]{0,3})\}/g

/**
 * Setup Page router
 * @param {Lightning.Component} appInstance
 * @param routes
 * @param provider
 */
export const startRouter = ({ appInstance, routes, provider = () => {}, widgets = () => {} }) => {
  app = appInstance
  application = appInstance.application
  pagesHost = application.childList
  stage = application.stage

  // test if required to host pages in a different child
  if (app.pages) {
    pagesHost = app.pages.childList
  }

  // test if app uses widgets
  if (app.widgets) {
    widgetsHost = app.widgets.childList
  }

  // register step back handler
  application._handleBack = step.bind(null, -1)

  // register route data bindings
  provider()

  // register routes
  routes()

  // register widgets
  widgets()

  // register step back handler
  app._captureKey = capture.bind(null)
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
        if (!Settings.get('platform', 'lazyCreate')) {
          type = isLightningComponent(type) ? create(type) : type
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
      if (!Settings.get('platform', 'lazyCreate')) {
        type = isLightningComponent(type) ? create(type) : type
        pagesHost.a(type)
      }
    }

    // if lazy we just store the constructor
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
  const type = getPageByRoute(route)
  let routesShareInstance = false
  let provide = false
  let page = null

  // if page is instanceof Component
  if (!isLightningComponent(type)) {
    page = type
    // if we have have a data route for current page
    if (providers.has(route)) {
      // if page is expired or new hash is different
      // from previous hash when page was loaded
      // effectively means: page could be loaded
      // with new url parameters
      if (isPageExpired(type) || type[Symbol.for('hash')] !== hash) {
        provide = true
      }
    }

    let currentRoute = activePage && activePage[Symbol.for('route')]

    // if the new route is equal to the current route it means that both
    // route share the Component instance and stack location / since this case
    // is conflicting with the way before() and after() loading works we flag it,
    // and check platform settings in we want to re-use instance
    if (route === currentRoute) {
      routesShareInstance = true
    }
  } else {
    page = create(type)
    pagesHost.a(page)

    // update stack
    const location = getPageStackLocation(route)
    if (!isNaN(location)) {
      let stack = pages.get(route)
      stack[location] = page
      pages.set(route, stack)
    }

    // test if need to request data provider
    if (providers.has(route)) {
      provide = true
    }
  }

  // we store hash and route as properties on the page instance
  // that way we can easily calculate new behaviour on page reload
  page[Symbol.for('hash')] = hash
  page[Symbol.for('route')] = route

  // if routes share instance we only update
  // update the page data if needed
  if (routesShareInstance) {
    if (provide) {
      try {
        await updatePageData({ page, route, hash })
      } catch (e) {
        // show error page with route / hash
        // and optional error code
        handleError(e)
      }
    }
  } else {
    if (provide) {
      const { type: loadType } = providers.get(route)
      const properties = {
        page,
        old: activePage,
        route,
        hash,
      }
      try {
        if (triggers[loadType]) {
          await triggers[loadType](properties)
        } else {
          throw new Error(`${loadType} is not supported`)
        }
      } catch (e) {
        handleError(page, e)
      }
    } else {
      const p = activePage
      const r = p && p[Symbol.for('route')]

      let urlValues = getValuesFromHash(hash, route)
      // we iterate over dynamic values from the current url
      // and invoke the page setters so that dynamic data
      // is available before the page loads
      for (let [name, value] of urlValues) {
        page[name] = value
      }

      if (register.size) {
        const obj = {}
        for (let [k, v] of register) {
          obj[k] = v
        }
        page.persist = obj
      }

      doTransition(page, activePage).then(() => {
        // manage cpu/gpu memory
        if (p) {
          cleanUp(p, r)
        }

        // force focus calculation
        app._refocus()
      })
    }
  }

  // store reference to active page, probably better to store the
  // route in the future
  activePage = page

  Log.info('[route]:', route)
  Log.info('[hash]:', hash)

  return page
}

const triggerAfter = ({ page, old, route, hash }) => {
  return doTransition(page, old).then(() => {
    // if the current and previous route (blueprint) are equal
    // we're loading the same page again but provide it with new data
    // in that case we don't clean-up the old page (since we're re-using)
    if (old) {
      cleanUp(old, old[Symbol.for('route')])
    }

    // update provided page data
    return updatePageData({ page, route, hash })
  })
}

const triggerBefore = ({ page, old, route, hash }) => {
  return updatePageData({ page, route, hash })
    .then(() => {
      return doTransition(page, old)
    })
    .then(() => {
      if (old) {
        cleanUp(old, old[Symbol.for('route')])
      }
    })
}

const triggerOn = ({ page, old, route, hash }) => {
  // force app in loading state
  app._setState('Loading')

  if (old) {
    cleanUp(old, old[Symbol.for('route')])
  }

  // update provided page data
  return updatePageData({ page, route, hash })
    .then(() => {
      // @todo: fix zIndex for transition
      return doTransition(page)
    })
    .then(() => {
      // back to root state
      app._setState('')
    })
}

const handleError = (page, error) => {
  if (pages.has('!')) {
    load({ route: '!', hash: page[Symbol.for('hash')] }).then(errorPage => {
      errorPage.error = { page, error }

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
    Log.error(page, error)
  }
}

const triggers = {
  on: triggerOn,
  after: triggerAfter,
  before: triggerBefore,
}

export const boot = cb => {
  bootRequest = cb
}

const updatePageData = ({ page, route, hash }) => {
  const { cb, expires } = providers.get(route)
  let urlValues = getValuesFromHash(hash, route)
  let params = {}

  // we iterate over dynamic values from the current url
  // and invoke the page setters so that dynamic data
  // is available before the page loads
  for (let [name, value] of urlValues) {
    page[name] = value
    // store so we can add them as arguments to
    // data request callback
    params[name] = value
  }

  if (register.size) {
    const obj = {}
    for (let [k, v] of register) {
      obj[k] = v
    }
    page.persist = obj
  }

  return cb({ page, ...params }).then(() => {
    // set new expire time
    page[Symbol.for('expires')] = Date.now() + expires
  })
}

/**
 * execute transition between new / old page and
 * toggle the defined widgets
 * @todo: platform override default transition
 * @param pageIn
 * @param pageOut
 */
const doTransition = (pageIn, pageOut = null) => {
  const hasCustomTransitions = !!(pageIn.smoothIn || pageIn.smoothInOut || pageIn.easing)
  const transitionsDisabled = Settings.get('platform', 'disableTransitions')

  // for now a simple widget visibility toggle
  updateWidgets(pageIn)

  // default behaviour is a visibility toggle
  if (!hasCustomTransitions || transitionsDisabled) {
    pageIn.visible = true
    if (pageOut) {
      pageOut.visible = false
    }
    return Promise.resolve()
  }

  if (pageIn.easing && isString(pageIn.easing())) {
    const type = Transitions[pageIn.easing()]
    if (type) {
      return type(pageIn, pageOut)
    }
  }

  // if the new instance wants to control both in and out
  // transition we call the function and provide both instances
  // as an argument. It's the function's job to
  // resolve a promise when ready
  if (pageIn.smoothInOut) {
    return pageIn.smoothInOut(pageIn, pageOut)
  } else if (pageIn.smoothIn) {
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

  return Transitions.crossFade(pageIn, pageOut)
}

/**
 * update the visibility of the available widgets
 * for the current page / route
 * @param page
 */
const updateWidgets = page => {
  // grab active route
  const route = page[Symbol.for('route')]
  // force lowercase lookup
  const configured = (widgetsPerRoute.get(route) || []).map(ref => ref.toLowerCase())
  // iterate over all available widgets and turn visibility
  // if they're configured for the current route
  widgetsHost.forEach(widget => {
    widget.visible = configured.indexOf(widget.ref.toLowerCase()) !== -1
  })
}

const cleanUp = (page, route) => {
  let doCleanup = false
  const lazyDestroy = Settings.get('platform', 'lazyDestroy')
  const destroyOnBack = Settings.get('platform', 'destroyOnHistoryBack')
  const keepAlive = read('keepAlive')
  const isFromHistory = read('backtrack')

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
    if (Settings.get('platform', 'gcOnUnload')) {
      stage.gc()
    }
  }
}

/**
 * Test if page passed cache-time
 * @param page
 * @returns {boolean}
 */
const isPageExpired = page => {
  if (!page[Symbol.for('expires')]) {
    return false
  }

  const expires = page[Symbol.for('expires')]
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

  // to simplify the route matching and prevent look around
  // in our getUrlParts regex we get the regex part from
  // route candidate and store them so that we can reference
  // them when we perform the actual regex against hash
  let regexStore = []

  let matches = candidates.filter(route => {
    let isMatching = true
    const isNamedGroup = /^\/:/

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

const handleHashChange = override => {
  const hash = override || getHash()
  const route = getRouteByHash(hash)

  if (route) {
    // would be strange if this fails but we do check
    if (pages.has(route)) {
      let stored = pages.get(route)
      if (!isArray(stored)) {
        stored = [stored]
      }
      let n = stored.length
      while (n--) {
        const type = stored[n]
        if (isPage(type, stage)) {
          load({ route, hash }).then(() => {
            app._refocus()
          })
        } else {
          const urlParams = getValuesFromHash(hash, route)
          const params = {}
          for (const key of urlParams.keys()) {
            params[key] = urlParams.get(key)
          }
          // invoke
          type.call(null, { application, ...params })
        }
      }
    }
  } else {
    if (pages.has('*')) {
      load({ route: '*', hash }).then(() => {
        app._refocus()
      })
    }
  }
}

const hashmod = (hash, key) => {
  return routemod(getRouteByHash(hash), key)
}

const routemod = (route, key) => {
  if (modifiers.has(route)) {
    const config = modifiers.get(route)
    if (config[key] && config[key] === true) {
      return true
    }
  }
  return false
}

const read = flag => {
  if (register.has(flag)) {
    return register.get(flag)
  }
  return false
}

const createRegister = flags => {
  const reg = new Map()
  Object.keys(flags).forEach(key => {
    reg.set(key, flags[key])
  })
  return reg
}

export const navigate = (url, args, store) => {
  let storeHash = true
  register.clear()

  if (isObject(args)) {
    register = createRegister(args)
    if (isBoolean(store) && !store) {
      storeHash = false
    }
  } else if (isBoolean(args) && !args) {
    // if explicit set to false we don't want
    // to store the route
    storeHash = !!args
  }

  const hash = getHash()
  // add current hash to history
  if (hash && storeHash && !hashmod(hash, 'preventStorage')) {
    const toStore = hash.substring(1, hash.length)
    const location = history.indexOf(toStore)

    // store hash if it's not a part of history or flag for
    // storage of same hash is true
    if (location === -1 || Settings.get('app', 'storeSameHash')) {
      history.push(toStore)
    } else {
      // if we visit the same route we want to sync history
      history.push(history.splice(location, 1)[0])
    }
  }

  if (hash.replace(/^#/, '') !== url) {
    setHash(url)
  } else if (hashmod(url, 'reload')) {
    handleHashChange(hash)
  }

  // clean up history if modifier is set
  if (hashmod(url, 'clearHistory')) {
    history.length = 0
  }
}

/**
 * Directional step in history
 * @param direction
 */
export const step = (direction = 0) => {
  if (!direction) {
    return
  }

  // is we still have routes in our history
  // we splice the last of and navigate to that route
  if (history.length) {
    // for now we only support history back
    const route = history.splice(history.length - 1, 1)
    navigate(route[0], { backtrack: true }, false)
  } else {
    const hashLastPart = /(\/:?[\w%\s-]+)$/
    let hash = stripRegex(getHash())
    let floor = getFloor(hash)

    // if we're passed the first floor and our history is empty
    // we can (for now) safely assume that the current got deeplinked
    // via an external source. We strip of trailing route parts
    // and test if we have a configured route for it, and navigate to it.
    if (floor > 1) {
      while (floor--) {
        // strip of last part
        hash = hash.replace(hashLastPart, '')
        // if we have a configured route
        // we navigate to it
        if (getRouteByHash(hash)) {
          return navigate(hash, { backtrack: true }, false)
        }
      }
    }
  }
  return false
}

const capture = ({ key }) => {
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
  const ready = () => {
    // if defined force to root hash
    if (!getHash() && rootHash) {
      navigate(rootHash)
    } else {
      handleHashChange()
    }
  }
  if (isFunction(bootRequest)) {
    bootRequest().then(() => {
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
  if (widgetsHost.getByRef(name)) {
    return widgetsHost.getByRef(name)
  }
  return false
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

const hash = () => {
  return getHash()
}

export const restoreFocus = () => {
  app._setState('Pages')
}

export const getActivePage = () => {
  if (activePage && activePage.attached) {
    return activePage
  } else {
    return app
  }
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
  route,
  on,
  before,
  after,
  boot,
  step,
  restoreFocus,
  getActivePage,
  focusWidget,
  start,
  widget,
  hash,
}
