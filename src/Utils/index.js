let basePath
let proxyUrl

export const initUtils = config => {
  if (config.path) {
    basePath = ensureUrlWithProtocol(
      // remove leading dot (./static) if configured
      getFullPath(config.path.charAt(0) === '.' ? config.path.substr(1) : config.path)
    )
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

const getFullPath = path => {
  return /(.*)\//.exec(document.location.pathname)[1] + path
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
