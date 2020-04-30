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
  if (config.path) {
    basePath = ensureUrlWithProtocol(makeFullStaticPath(document.location.pathname, config.path))
  }

  if (config.proxyUrl) {
    proxyUrl = ensureUrlWithProtocol(config.proxyUrl)
  }
}

export default {
  asset(relPath) {
    return basePath + '/' + relPath
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

const makeFullStaticPath = (pathname = '/', path) => {
  // if path is URL, we assume it's already the full static path, so we just return it
  if (/^(?:https?:)?(?:\/\/)/.test(path)) {
    return path
  }
  // cleanup the pathname
  pathname = /(.*)\//.exec(pathname)[1]

  // remove possible leading dot from path
  path = path.charAt(0) === '.' ? path.substr(1) : path
  // ensure path has leading slash
  path = path.charAt(0) !== '/' ? '/' + path : path

  return pathname + path
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

const detectProtocol = () => {
  return window.location.protocol
  // from old SDK (not sure if this is needed like this?)
  // return lng.Utils.isWeb && location.protocol === "https:" ? "https" : "http";
}
