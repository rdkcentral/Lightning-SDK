// Important: this is the source file of 'startApp' in es6
// Upon commit it's automatically built to an es5 version (and saved as support/startApp.js)

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
      settings.appSettings.version = appMetadata.version
      settings.appSettings.id = appMetadata.identifier
      const app = window[appMetadata.id](
        settings.appSettings,
        settings.platformSettings,
        settings.appData
      )
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
      return {
        appSettings: {},
        platformSettings: {
          path: './static',
          esEnv: 'es6',
        },
      }
    })
}

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

startApp()
