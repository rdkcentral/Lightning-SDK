const style = document.createElement('style')

document.head.appendChild(style)
style.sheet.insertRule(
  '@media all { html {height: 100%; width: 100%;} *,body {margin:0; padding:0;} canvas { position: absolute; z-index: 2; } body { background: black; width: 100%; height: 100%;} }'
)

const startApp = () => {
  console.time('app')

  let appMetadata
  let settings

  sequence([
    () => getSettings().then(config => (settings = config)),
    () => getAppMetadata().then(metadata => (appMetadata = metadata)),
    () => injectFavicon(appMetadata),
    () => loadPolyfills(settings.platformSettings.esEnv),
    () => loadLightning(settings.platformSettings.esEnv),
    () => loadAppBundle(settings.platformSettings.esEnv),
    () => hasTextureMode().then(enabled => (settings.platformSettings.textureMode = enabled)),
    () =>
      settings.platformSettings.inspector === true
        ? loadLightningInspect(settings.platformSettings.esEnv).then(() =>
            window.attachInspector(window.lng)
          )
        : Promise.resolve(),
    () => {
      console.time('app2')
      const isSpark = eval('typeof lng !== "undefined" && lng.Utils.isSpark')
      if (isSpark) {
        eval('lng.Stage.platform = SparkPlatform')
      }
      settings.appSettings.version = appMetadata.version
      settings.appSettings.id = appMetadata.identifier
      if (isSpark) global.beginDrawing()
      const app = (isSpark ? eval(appMetadata.id) : window[appMetadata.id])(
        settings.appSettings,
        settings.platformSettings,
        settings.appData
      )
      if (isSpark) global.endDrawing()
      document.body.appendChild(app.stage.getCanvas())
    },
  ])
}

const getAppMetadata = () => {
  return fetch('./metadata.json')
    .then(response => {
      return response.json()
    })
    .then(metadata => {
      metadata.id = `APP_${metadata.identifier.replace(/[^0-9a-zA-Z_$]/g, '_')}`
      return metadata
    })
}

const getSettings = () => {
  return fetch('./settings.json')
    .then(response => {
      return response.json()
    })
    .catch(error => {
      console.warn('No settings.json found. Using defaults.')
      return {
        appSettings: {},
        platformSettings: {
          path: './static',
          esEnv: 'es6',
        },
      }
    })
}

// FIXME: these 3 functions could be refactored to a single one receiving 2 arguments (filename, esEnv)
const loadLightning = esEnv => {
  const filename = !esEnv || esEnv === 'es6' ? 'lightning.js' : 'lightning.' + esEnv + '.js'
  return loadJS('./lib/' + filename)
}

const loadAppBundle = esEnv => {
  const filename = !esEnv || esEnv === 'es6' ? './appBundle.js' : './appBundle.' + esEnv + '.js'
  return loadJS(filename)
}

const loadLightningInspect = esEnv => {
  const filename =
    !esEnv || esEnv === 'es6' ? 'lightning-inspect.js' : 'lightning-inspect.' + esEnv + '.js'
  return loadJS('./lib/' + filename)
}

const loadPolyfills = esEnv => {
  // load polyfills when esEnv is defined and it's not es6
  if (esEnv && esEnv !== 'es6') {
    return sequence([
      () => loadJS('./polyfills/babel-polyfill7.6.0.js'),
      () => loadJS('./polyfills/url.js'),
    ])
  }
  return Promise.resolve()
}

const loadJS = (url, id) => {
  return new Promise(resolve => {
    console.log('loadJS', url)
    const tag = document.createElement('script')
    tag.onload = resolve
    tag.src = url

    if (id) tag.id = id

    document.body.appendChild(tag)
  })
}

const sequence = steps => {
  return steps.reduce((promise, method) => {
    return promise.then(() => method())
  }, Promise.resolve(null))
}

const hasTextureMode = () => {
  return new Promise(resolve => {
    // yes, this could be a oneliner, but zebra es5 couldn't handle that (so 2 lines to be safe)
    const url = new URL(document.location.href)
    resolve(url.searchParams.has('texture'))
  })
}

const injectFavicon = metadata => {
  const link = document.createElement('link')
  link.rel = 'shortcut icon'
  link.type = 'image/png'

  // set to app icon if it exists, otherwise a transparent pixel
  link.href =
    metadata.icon ||
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  document.head.appendChild(link)
}

startApp()
