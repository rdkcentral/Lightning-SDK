import { isFunction, isPage, isConstructor, isArray, ucfirst } from './utils'
import { crossFade } from './transitions'
import { Settings } from 'wpe-lightning-sdk'

/*
rouThor
-------
@todo:

- data provider timeout
- page provide widgets
- cache widget object (not if pages provide own)
- add route mapping
- custom before trigger
- regex support
- error page

 */

// instance of Lightning.Application
let application
//instance of Lightning.Component
let app

let stage
let pages = new Map()
let providers = new Map()
let widgets
let host

// widget that has focus
let activeWidget
let rootHash
let bootRequest
let history = []

// page that has focus
export let activePage

/**
 * Setup Page router
 * @param {Lightning.Component} appInstance
 * @param routes
 * @param provider
 */
export const startRouter = ({ appInstance, routes, provider }) => {
  app = appInstance
  application = appInstance.application
  host = application.childList
  stage = application.stage

  // test if required to host pages in a different child
  if (app.pages) {
    host = app.pages.childList
  }

  // test if app uses widgets
  if (app.widgets) {
    widgets = app.widgets.childList
  }

  // register step back handler
  application._handleBack = step.bind(null, -1)

  // register route data bindings
  provider()

  // register routes
  routes()

  // register step back handler
  app._captureKey = capture.bind(null)
}

/**
 * create a new route
 * @param route - {string}
 * @param type - {(Lightning.Component|Function()*)}
 */
export const route = (route, type) => {
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
        if (!Settings.get('pltform', 'lazyCreate')) {
          type = isConstructor(type, stage) ? create(type) : type
          host.a(type)
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
        type = isConstructor(type, stage) ? create(type) : type
        host.a(type)
      }
    }

    // if lazy we just store the constructor
    pages.set(route, [type])
  }
}

/**
 * create a route and define it as root.
 * Upon boot we will automatically point browser hash
 * to the defined route
 * @param route - {string}
 * @param type - {(Lightning.Component|Function()*)}
 */
export const root = (url, type) => {
  rootHash = url
  route(url, type)
}

const create = type => {
  const page = stage.c({ type, visible: false })
  // if the app has widgets we make them available
  // as an object on the app instance
  if (widgets) {
    page.widgets = getWidgetReferences()
  }

  return page
}

/**
 * The actual loading of the component
 * @param {String} route - the route blueprint, used for data provider look up
 * @param {String} hash - current hash we're routing to
 * */
const load = ({ route, hash }) => {
  const type = getPageByRoute(route)
  let routesShareInstance = false
  let provide = false
  let page = null

  // if page is instanceof Component
  if (!isConstructor(type, stage)) {
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

    let currentRoute = activePage[Symbol.for('route')]

    // if the new route is equal to the current route it means that both
    // route share the Component instance and stack location / since this case
    // is conflicting with the way before() and after() loading works we flag it,
    // and check platform settings in we want to re-use instance
    if (route === currentRoute) {
      routesShareInstance = true
    }
  } else {
    page = create(type)
    host.a(page)

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

  // if routes share instance we only update
  // update the page data if needed
  if (routesShareInstance) {
    if (provide) {
      try {
        updatePageData({ page, route, hash }).then(() => {
          // ignore? Since we're re-using instance
        })
      } catch (e) {
        // show error page with route / hash
        // and optional error code
        console.log(e)
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
          triggers[loadType](properties)
        }
      } catch (e) {
        // show error page with route / hash
        // and optional error code
        console.log(e)
      }
    } else {
      const p = activePage
      const r = p && p[Symbol.for('route')]

      doTransition(page, activePage).then(() => {
        cleanUp(p, r)
      })
    }
  }

  // we store hash and route as properties on the page instance
  // that way we can easily calculate new behaviour on page reload
  page[Symbol.for('hash')] = hash
  page[Symbol.for('route')] = route

  // store reference to active page, probably better to store the
  // route in the future
  activePage = page

  if (Settings.get('platform', 'logRoute')) {
    console.log('[route]:', route)
    console.log('[hash]:', hash)
  }
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

  return cb({ page, ...params }).then(() => {
    // set new expire time
    page[Symbol.for('expires')] = Date.now + expires
  })
}

/**
 * execute transition between new / old page
 * @todo: platform override default transition
 * @param pageIn
 * @param pageOut
 */
const doTransition = (pageIn, pageOut = null) => {
  return crossFade(pageIn, pageOut)
}

const cleanUp = (page, route) => {
  if (!Settings.get('platform', 'lazyDestroy') || !page) {
    return
  }

  // in lazy create mode we store constructor
  // and remove the actual page from host
  const stack = pages.get(route)
  const location = getPageStackLocation(route)

  // grab original class constructor if statemachine routed
  // else store constructor
  stack[location] = page._routedType || page.constructor
  pages.set(route, stack)

  // actual remove of page from memory
  host.remove(page)

  // force texture gc() if configured
  // so we can cleanup textures in the same tick
  if (Settings.get('platform', 'gcOnUnload')) {
    stage.gc()
  }
}

/**
 * Test if page passed cache-time
 * @param page
 * @returns {boolean}
 */
const isPageExpired = page => {
  if (!page.has(Symbol.for('expires'))) {
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
  return route.split('/').length
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
  const getUrlParts = /(\/?:?[\w-]+)/g
  // grab possible candidates from stored routes
  const candidates = getRoutesByFloor(getFloor(hash))
  // break hash down in chunks
  const hashParts = hash.match(getUrlParts) || []

  let matches = candidates.filter(route => {
    let isMatching = true
    const isNamedGroup = /^\/:/
    const routeParts = route.match(getUrlParts) || []

    for (let i = 0, j = routeParts.length; i < j; i++) {
      const routePart = routeParts[i]
      const hashPart = hashParts[i]
      // we kindly skip namedGroups because this is dynamic
      // we only need to the static parts
      if (isNamedGroup.test(routePart)) {
        continue
      }

      // if the non-named groups don't match we let it fail
      if (routePart.toLowerCase() !== hashPart.toLowerCase()) {
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
  const getUrlParts = /(\/?:?[\w-]+)/g
  const hashParts = hash.match(getUrlParts) || []
  const routeParts = route.match(getUrlParts) || []
  const getNamedGroup = /^\/:([\w-]+)\/?/

  return routeParts.reduce((storage, value, index) => {
    const match = getNamedGroup.exec(value)
    if (match && match.length) {
      storage.set(match[1], hashParts[index].replace(/^\//, ''))
    }
    return storage
  }, new Map())
}

const handleHashChange = override => {
  const hash = override || document.location.hash
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
          load({ route, hash })
        } else {
          // invoke
          type.call(null, application)
        }
      }
    }
  } else {
    if (pages.has('*')) {
      load({ route: '*', hash })
    }
  }
}

export const navigate = (url, store = true) => {
  const hash = document.location.hash
  // add current hash to history
  if (hash && store) {
    const toStore = hash.substring(1, hash.length)
    if (history.indexOf(toStore) === -1 || Settings.get('app', 'storeSameHash')) {
      history.push(toStore)
    }
  }

  if (hash !== url) {
    document.location.hash = url
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
    navigate(route, false)
  } else {
    const hashLastPart = /(\/:?[\w-]+)$/
    let hash = document.location.hash
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
          return navigate(hash, false)
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
    if (!document.location.hash && rootHash) {
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
  return widgets.get().reduce((storage, widget) => {
    const key = widget.ref.toLowerCase()
    storage[key] = widget
    return storage
  }, {})
}

const getWidgetByName = name => {
  name = ucfirst(name)
  if (widgets.getByRef(name)) {
    return widgets.getByRef(name)
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
    app._setState('Widgets', [activeWidget])
  }
}

export const restoreFocus = () => {
  app._setState('Pages')
}

export const getActivePage = () => {
  return activePage
}

// listen to url changes
window.addEventListener('hashchange', () => {
  handleHashChange()
})

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
}
