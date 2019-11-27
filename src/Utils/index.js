let basePath = null

export const initUtils = config => {
  if (config.path) {
    basePath = config.path
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
  getOption(option) {
    // yes, this could be a oneliner, but zebra es5 couldn't handle that (so 2 lines to be safe)
    const url = new URL(document.location.href)
    return url.searchParams.has(option)
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
