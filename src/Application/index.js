/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
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

import Accessibility from '../Accessibility'
import Deepmerge from 'deepmerge'
import Lightning from '../Lightning'
import Locale from '../Locale'
import Metrics from '../Metrics'
import VersionLabel from '../VersionLabel'
import FpsCounter from '../FpsCounter'
import Log from '../Log'
import Settings from '../Settings'
import { initLanguage } from '../Language'
import Utils from '../Utils'
import Registry from '../Registry'
import { initColors } from '../Colors'

import packageInfo from '../../package.json'

export let AppInstance
export let AppData

const defaultOptions = {
  stage: { w: 1920, h: 1080, precision: 1, clearColor: 0x00000000, canvas2d: false },
  debug: false,
  defaultFontFace: 'RobotoRegular',
  keys: {
    8: 'Back',
    13: 'Enter',
    27: 'Menu',
    37: 'Left',
    38: 'Up',
    39: 'Right',
    40: 'Down',
    174: 'ChannelDown',
    175: 'ChannelUp',
    178: 'Stop',
    250: 'PlayPause',
    191: 'Search', // Use "/" for keyboard
    409: 'Search',
  },
}

const customFontFaces = []

const fontLoader = (fonts, store) =>
  new Promise((resolve, reject) => {
    fonts
      .map(({ family, url, urls, descriptors }) => () => {
        const src = urls
          ? urls.map(url => {
              return 'url(' + url + ')'
            })
          : 'url(' + url + ')'
        const fontFace = new FontFace(family, src, descriptors || {})
        store.push(fontFace)
        Log.info('Loading font', family)
        document.fonts.add(fontFace)
        return fontFace.load()
      })
      .reduce((promise, method) => {
        return promise.then(() => method())
      }, Promise.resolve(null))
      .then(resolve)
      .catch(reject)
  })

export default function(App, appData, platformSettings) {
  const { width, height } = platformSettings

  if (width && height) {
    defaultOptions.stage['w'] = width
    defaultOptions.stage['h'] = height
    defaultOptions.stage['precision'] = width / 1920
  }

  // support for 720p browser
  if (!width && !height && window.innerHeight === 720) {
    defaultOptions.stage['w'] = 1280
    defaultOptions.stage['h'] = 720
    defaultOptions.stage['precision'] = 1280 / 1920
  }

  return class Application extends Lightning.Application {
    constructor(options) {
      const config = Deepmerge(defaultOptions, options)
      // Deepmerge breaks HTMLCanvasElement, so restore the passed in canvas.
      if (options.stage.canvas) {
        config.stage.canvas = options.stage.canvas
      }
      super(config)
      this.config = config
    }

    static _template() {
      return {
        w: 1920,
        h: 1080,
      }
    }

    colorshift(type = false, config = {}) {
      Accessibility.colorshift(this, type, config)
    }

    _setup() {
      Promise.all([
        this.loadFonts((App.config && App.config.fonts) || (App.getFonts && App.getFonts()) || []),
        // to be deprecated
        Locale.load((App.config && App.config.locale) || (App.getLocale && App.getLocale())),
        App.language && this.loadLanguage(App.language()),
        App.colors && this.loadColors(App.colors()),
      ])
        .then(() => {
          Metrics.app.loaded()

          this.w = this.config.stage.w / this.config.stage.precision
          this.h = this.config.stage.h / this.config.stage.precision

          AppData = appData

          AppInstance = this.stage.c({
            ref: 'App',
            type: App,
            zIndex: 1,
            forceZIndexContext: !!platformSettings.showVersion || !!platformSettings.showFps,
          })

          this.childList.a(AppInstance)

          this._refocus()

          Log.info('App version', this.config.version)
          Log.info('SDK version', packageInfo.version)

          if (platformSettings.showVersion) {
            this.childList.a({
              ref: 'VersionLabel',
              type: VersionLabel,
              version: this.config.version,
              sdkVersion: packageInfo.version,
              zIndex: 1,
            })
          }

          if (platformSettings.showFps) {
            this.childList.a({
              ref: 'FpsCounter',
              type: FpsCounter,
              zIndex: 1,
            })
          }

          super._setup()
        })
        .catch(console.error)
    }

    _handleBack() {
      this.closeApp()
    }

    _handleExit() {
      this.closeApp()
    }

    closeApp() {
      Log.info('Signaling App Close')

      if (platformSettings.onClose && typeof platformSettings.onClose === 'function') {
        platformSettings.onClose(...arguments)
      } else {
        this.close()
      }
    }

    close() {
      Log.info('Closing App')

      Settings.clearSubscribers()
      Registry.clear()

      this.childList.remove(this.tag('App'))
      this.cleanupFonts()
      // force texture garbage collect
      this.stage.gc()
      this.destroy()
    }

    loadFonts(fonts) {
      return platformSettings.fontLoader && typeof platformSettings.fontLoader === 'function'
        ? platformSettings.fontLoader(fonts, customFontFaces)
        : fontLoader(fonts, customFontFaces)
    }

    cleanupFonts() {
      if ('delete' in document.fonts) {
        customFontFaces.forEach(fontFace => {
          Log.info('Removing font', fontFace.family)
          document.fonts.delete(fontFace)
        })
      } else {
        Log.info('No support for removing manually-added fonts')
      }
    }

    loadLanguage(config) {
      let file = Utils.asset('translations.json')
      let language = config

      if (typeof language === 'object') {
        language = config.language || null
        file = config.file || file
      }

      return initLanguage(file, language)
    }

    loadColors(config) {
      let file = Utils.asset('colors.json')
      if (config && (typeof config === 'string' || typeof config === 'object')) {
        file = config
      }
      return initColors(file)
    }

    set focus(v) {
      this._focussed = v
      this._refocus()
    }

    _getFocused() {
      return this._focussed || this.tag('App')
    }
  }
}
