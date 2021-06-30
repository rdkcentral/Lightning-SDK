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

import { hasRegex, hasLookupId, isNamedGroup, stripRegex } from './regex'
import { routes, routeExists, bootRequest, getRoutes } from './router'
import Request from '../model/Request'
import Route from '../model/Route'
import { objectToQueryString, isObject, isString } from './helpers'

/**
 * Simple route length calculation
 * @param route {string}
 * @returns {number} - floor
 */
export const getFloor = route => {
  return stripRegex(route).split('/').length
}

/**
 * return all stored routes that live on the same floor
 * @param floor
 * @returns {Array}
 */
const getRoutesByFloor = floor => {
  const matches = []
  // simple filter of level candidates
  for (let [route] of routes.entries()) {
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
 * @returns {boolean|{}} - route
 */
export const getRouteByHash = hash => {
  // @todo: clean up on handleHash
  hash = hash.replace(/^#/, '')

  const getUrlParts = /(\/?:?[@!*\w%\s:-]+)/g
  // grab possible candidates from stored routes
  const candidates = getRoutesByFloor(getFloor(hash))
  // break hash down in chunks
  const hashParts = hash.match(getUrlParts) || []

  // to simplify the route matching and prevent look around
  // in our getUrlParts regex we get the regex part from
  // route candidate and store them so that we can reference
  // them when we perform the actual regex against hash
  let regexStore = []

  let matches = candidates.filter(route => {
    let isMatching = true
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
    if (matches.indexOf(hash) !== -1) {
      const match = matches[matches.indexOf(hash)]
      return routes.get(match)
    } else {
      // we give prio to static routes over dynamic
      matches = matches.sort(a => {
        return isNamedGroup.test(a) ? -1 : 1
      })
      // would be strange if this fails
      // but still we test
      if (routeExists(matches[0])) {
        return routes.get(matches[0])
      }
    }
  }
  return false
}

export const getValuesFromHash = (hash = '', path) => {
  // replace the regex definition from the route because
  // we already did the matching part
  path = stripRegex(path, '')

  const getUrlParts = /(\/?:?[\w%\s:-]+)/g
  const hashParts = hash.match(getUrlParts) || []
  const routeParts = path.match(getUrlParts) || []
  const getNamedGroup = /^\/:([\w-]+)\/?/

  return routeParts.reduce((storage, value, index) => {
    const match = getNamedGroup.exec(value)
    if (match && match.length) {
      storage.set(match[1], decodeURIComponent(hashParts[index].replace(/^\//, '')))
    }
    return storage
  }, new Map())
}

export const getOption = (stack, prop) => {
  // eslint-disable-next-line
    if(stack && stack.hasOwnProperty(prop)){
    return stack[prop]
  }
  // we explicitly return undefined since we're testing
  // for explicit test values
}

/**
 * create and return new Route instance
 * @param config
 */
export const createRoute = config => {
  // we need to provide a bit of additional logic
  // for the bootComponent
  if (config.path === '$') {
    let options = {
      preventStorage: true,
    }
    if (isObject(config.options)) {
      options = {
        ...config.options,
        ...options,
      }
    }
    config.options = options
    // if configured add reference to bootRequest
    // as router after provider
    if (bootRequest) {
      config.after = bootRequest
    }
  }
  return new Route(config)
}

/**
 * Create a new Router request object
 * @param url
 * @param args
 * @param store
 * @returns {*}
 */
export const createRequest = (url, args, store) => {
  return new Request(url, args, store)
}

export const getHashByName = obj => {
  if (!obj.to && !obj.name) {
    return false
  }
  const route = getRouteByName(obj.to || obj.name)
  const hasDynamicGroup = /\/:([\w-]+)\/?/
  let hash = route

  // if route contains dynamic group
  // we replace them with the provided params
  if (hasDynamicGroup.test(route)) {
    if (obj.params) {
      const keys = Object.keys(obj.params)
      hash = keys.reduce((acc, key) => {
        return acc.replace(`:${key}`, obj.params[key])
      }, route)
    }
    if (obj.query) {
      return `${hash}${objectToQueryString(obj.query)}`
    }
  }
  return hash
}

const getRouteByName = name => {
  for (let [path, route] of routes.entries()) {
    if (route.name === name) {
      return path
    }
  }
  return false
}

export const keepActivePageAlive = (route, request) => {
  if (isString(route)) {
    const routes = getRoutes()
    if (routes.has(route)) {
      route = routes.get(route)
    } else {
      return false
    }
  }

  const register = request.register
  const routeOptions = route.options

  if (register.has('keepAlive')) {
    return register.get('keepAlive')
  } else if (routeOptions.keepAlive) {
    return routeOptions.keepAlive
  }

  return false
}
