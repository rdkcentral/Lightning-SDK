const style = document.createElement('style')
document.head.appendChild(style)
style.sheet.insertRule(
  '@media all { *,body {margin:0; padding:0;} canvas { position: absolute; z-index: 2; } body { background: black;} }'
)

const startApp = () => {
  console.time('app')

  let appMetadata
  let settings

  sequence([
    () => getSettings().then(config => (settings = config)),
    () => getAppMetadata().then(metadata => (appMetadata = metadata)),
    () => loadJS('./lightning.js'),
    () => loadJS('./appBundle.js'),
    () => hasTextureMode().then(enabled => (settings.platformSettings.textureMode = enabled)),
    () =>
      settings.platformSettings.inspector === true
        ? loadJS('./dist/lightning-inspect.js').then(() => window.attachInspector(window.lng))
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
        },
      }
    })
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
