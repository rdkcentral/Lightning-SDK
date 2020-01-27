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

const ensureUrlWithProtocol = url => {
  if (/^\/\//.test(url)) {
    return window.location.protocol + url
  }
  if (!/^(?:https?:)/i.test(url)) {
    return window.location.origin + url
  }
  return url
}

const makeFullStaticPath = (pathname, path) => {
  // cleanup the pathname
  const match = /(.*)\//.exec(pathname)
  if (match) {
    pathname = match[1]
  }

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
