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

const style = document.createElement('style')

document.head.appendChild(style)
style.sheet.insertRule(
  '@media all { html {height: 100%; width: 100%;} *,body {margin:0; padding:0;} canvas { position: absolute; z-index: 2; } body { width: 100%; height: 100%;} }'
)

let app
let canvas
let appMetadata
let settings

const startApp = () => {
  console.time('app')
  sequence([
    () => getSettings().then(config => (settings = config)),
    () => getAppMetadata().then(metadata => (appMetadata = metadata)),
    () => injectFavicon(appMetadata),
    () => loadPolyfills(settings.platformSettings.esEnv),
    () => loadLightning(settings.platformSettings.esEnv),
    () => loadAppBundle(settings.platformSettings.esEnv),
    () =>
      hasTextureMode(settings.platformSettings).then(
        enabled => (settings.platformSettings.textureMode = enabled)
      ),
    () =>
      settings.platformSettings.inspector === true
        ? loadLightningInspect(settings.platformSettings.esEnv).then(() =>
            window.attachInspector(window.lng)
          )
        : Promise.resolve(),
    () => {
      let bundle = window[appMetadata.safeId]
      // support rollup and esbuild
      if (typeof bundle !== 'function') {
        bundle = bundle.default
      }

      console.time('app2')
      //Adding complete metadata info to app settings
      Object.assign(settings.appSettings, appMetadata)
      //To align with the production response, adding the 'identifier' as 'id'
      settings.appSettings.id = appMetadata.identifier
      //Deleting the identifier as it is no longer required
      delete settings.appSettings.identifier
      app = bundle(settings.appSettings, settings.platformSettings, settings.appData)
      canvas = app.stage.getCanvas()
      document.body.appendChild(canvas)
    },
  ])
}

const getAppMetadata = () => {
  return fetchJson('./metadata.json').then(metadata => {
    metadata.safeId = `APP_${metadata.identifier.replace(/[^0-9a-zA-Z_$]/g, '_')}`
    return metadata
  })
}

const getSettings = () => {
  return new Promise(resolve => {
    let settings
    fetchJson('./settings.json')
      .then(json => (settings = json))
      .catch(() => {
        console.warn('No settings.json found. Using defaults.')
        settings = {
          appSettings: {},
          platformSettings: {
            path: './static',
            esEnv: 'es6',
          },
        }
      })
      .then(() => {
        settings.platformSettings = settings.platformSettings || {}
        settings.platformSettings.onClose = () => {
          // clean up video
          const videoElements = document.getElementsByTagName('video')
          if (videoElements.length) {
            videoElements[0].src = ''
          }
          // signal to close app
          app.close && app.close()

          // clear canvas
          if (canvas) {
            const stage = app.stage

            // maybe move this to a plugin so we can customize it per platform
            if (stage.gl) {
              stage.gl.clearColor(0.0, 0.0, 0.0, 0.0)
              stage.gl.clear(stage.gl.COLOR_BUFFER_BIT)
            } else {
              stage.c2d.clearRect(0, 0, canvas.width, canvas.height)
            }
          }

          // cleanup
          setTimeout(() => {
            if (canvas) {
              canvas.remove()
            }
            // detach app bundle from window scope
            window[appMetadata.id] = null

            // remove script tag
            removeJS('appbundle')

            // reset vars
            app = null
            canvas = null
            appMetadata = null
            settings = null

            // show notice to refresh
            console.log('👋 App closed!\nRefresh the page to restart the App')
          })
        }

        resolve(settings)
      })
  })
}

// FIXME: these 3 functions could be refactored to a single one receiving 2 arguments (filename, esEnv)
const loadLightning = esEnv => {
  const filename = !esEnv || esEnv === 'es6' ? 'lightning.js' : 'lightning.' + esEnv + '.js'
  return loadJS('./lib/' + filename)
}

const loadAppBundle = esEnv => {
  const filename = !esEnv || esEnv === 'es6' ? './appBundle.js' : './appBundle.' + esEnv + '.js'
  return loadJS(filename, 'appbundle')
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
      () => loadJS('./polyfills/babel-polyfill.js'),
      () => loadJS('./polyfills/url.js'),
      () => loadJS('./polyfills/fetch.js'),
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

const removeJS = id => {
  const scriptEl = document.getElementById(id)
  if (scriptEl) {
    scriptEl.remove()
  }
}

const fetchJson = file => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status === 200) resolve(JSON.parse(xhr.responseText))
        else reject(xhr.statusText)
      }
    }
    xhr.open('GET', file)
    xhr.send(null)
  })
}

const sequence = steps => {
  return steps.reduce((promise, method) => {
    return promise.then(() => method())
  }, Promise.resolve(null))
}

const hasTextureMode = platformSettings => {
  return new Promise(resolve => {
    if (platformSettings.textureMode === true) resolve(true)
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
