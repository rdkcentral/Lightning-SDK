let basePath = null

export const initUtils = config => {
  if (config.path) {
    // remove leading dot (./static) if configured
    basePath = config.path.charAt(0) === '.' ? config.path.substr(1) : config.path
    // add full host path if missing
    if (!/^(?:https?:)?\/\//i.test(basePath)) {
      basePath = window.location.origin + basePath
    }
  }
}

export default {
  asset(relPath) {
    return basePath + '/' + relPath
  },
  proxyUrl(url, options = {}) {
    // possibly make proxy url configurable from bootstrapper?
    return detectProtocol() + '//cdn.metrological.com/proxy?' + makeQueryString(url, options)
  },
  makeQueryString() {
    return makeQueryString(...arguments)
  },
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
