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

let basePath
let proxyUrl

export const initUtils = config => {
  basePath = ensureUrlWithProtocol(makeFullStaticPath(window.location.pathname, config.path || '/'))

  if (config.proxyUrl) {
    proxyUrl = ensureUrlWithProtocol(config.proxyUrl)
  }
}

export default {
  asset(relPath) {
    return basePath + relPath
  },
  proxyUrl(url, options = {}) {
    return proxyUrl ? proxyUrl + '?' + makeQueryString(url, options) : url
  },
  makeQueryString() {
    return makeQueryString(...arguments)
  },
  // since imageworkers don't work without protocol
  ensureUrlWithProtocol() {
    return ensureUrlWithProtocol(...arguments)
  },
}

export const ensureUrlWithProtocol = url => {
  if (/^\/\//.test(url)) {
    return window.location.protocol + url
  }
  if (!/^(?:https?:)/i.test(url)) {
    return window.location.origin + url
  }
  return url
}

export const makeFullStaticPath = (pathname = '/', path) => {
  // ensure path has traling slash
  path = path.charAt(path.length - 1) !== '/' ? path + '/' : path

  // if path is URL, we assume it's already the full static path, so we just return it
  if (/^(?:https?:)?(?:\/\/)/.test(path)) {
    return path
  }

  if (path.charAt(0) === '/') {
    return path
  } else {
    // cleanup the pathname (i.e. remove possible index.html)
    pathname = cleanUpPathName(pathname)

    // remove possible leading dot from path
    path = path.charAt(0) === '.' ? path.substr(1) : path
    // ensure path has leading slash
    path = path.charAt(0) !== '/' ? '/' + path : path
    return pathname + path
  }
}

export const cleanUpPathName = pathname => {
  if (pathname.slice(-1) === '/') return pathname.slice(0, -1)
  const parts = pathname.split('/')
  if (parts[parts.length - 1].indexOf('.') > -1) parts.pop()
  return parts.join('/')
}

const makeQueryString = (url, options = {}, type = 'url') => {
  // add operator as an option
  options.operator = 'metrological' // Todo: make this configurable (via url?)
  // add type (= url or qr) as an option, with url as the value
  options[type] = url

  return Object.keys(options)
    .map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent('' + options[key])
    })
    .join('&')
}
