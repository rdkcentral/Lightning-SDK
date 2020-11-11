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
import Colors from '../Colors'

import { version as sdkVersion } from '../../package.json'

export let AppInstance
export let AppData

const defaultOptions = {
  stage: { w: 1920, h: 1080, clearColor: 0x00000000, canvas2d: false },
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

if (window.innerHeight === 720) {
  defaultOptions.stage['w'] = 1280
  defaultOptions.stage['h'] = 720
  defaultOptions.stage['precision'] = 0.6666666667
}

export default function(App, appData, platformSettings) {
  return class Application extends Lightning.Application {
    constructor(options) {
      const config = Deepmerge(defaultOptions, options)
      super(config)
      this.config = config
    }

    static _template() {
      return {
        w: 1920,
        h: 1080,
      }
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

          AppData = appData

          AppInstance = this.stage.c({
            ref: 'App',
            type: App,
            zIndex: 1,
            forceZIndexContext: !!platformSettings.showVersion || !!platformSettings.showFps,
          })

          this.childList.a(AppInstance)

          Log.info('App version', this.config.version)
          Log.info('SDK version', sdkVersion)

          if (platformSettings.showVersion) {
            this.childList.a({
              ref: 'VersionLabel',
              type: VersionLabel,
              version: this.config.version,
              sdkVersion: sdkVersion,
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
      Log.info('Closing App')

      Settings.clearSubscribers()
      Registry.clear()

      if (platformSettings.onClose && typeof platformSettings.onClose === 'function') {
        platformSettings.onClose(...arguments)
      } else {
        this.close()
      }
    }

    close() {
      Log.info('Closing App')
      this.childList.remove(this.tag('App'))

      // force texture garbage collect
      this.stage.gc()
      this.destroy()
    }

    loadFonts(fonts) {
      return new Promise((resolve, reject) => {
        fonts
          .map(({ family, url, descriptors }) => () => {
            const fontFace = new FontFace(family, 'url(' + url + ')', descriptors || {})
            document.fonts.add(fontFace)
            return fontFace.load()
          })
          .reduce((promise, method) => {
            return promise.then(() => method())
          }, Promise.resolve(null))
          .then(resolve)
          .catch(reject)
      })
    }

    loadLanguage(config) {
      let file = Utils.asset('translations.json')
      let language = null

      if (typeof config === 'object' && ('file' in config || 'language' in config)) {
        language = config.language || null
        file = config.file && config.file
      } else {
        language = config
      }

      return initLanguage(file, language)
    }

    loadColors(config) {
      let file = Utils.asset('colors.json')
      if (typeof config === 'object' && 'file' in config) {
        file = config.file
      }
      return Colors.add(file)
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
