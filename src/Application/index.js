import Deepmerge from 'deepmerge'
import Lightning from '../Lightning'
import Locale from '../Locale'
import Metrics from '../Metrics'

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

export default function(App, appData) {
  Metrics.app.launch()
  return class Application extends Lightning.Application {
    constructor(options) {
      const config = Deepmerge(defaultOptions, options)
      super(config)
    }

    static _template() {
      return {
        w: 1920,
        h: 1080,
        rect: true,
        color: 0x00000000,
      }
    }

    _setup() {
      Promise.all([
        this.loadFonts((App.config && App.config.fonts) || (App.getFonts && App.getFonts()) || []),
        Locale.load((App.config && App.config.locale) || (App.getLocale && App.getLocale())),
      ])
        .then(() => {
          Metrics.app.loaded()
          this.childList.a({ ref: 'App', type: App, appData })
          super._setup()
        })
        .catch(console.error)
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

    _getFocused() {
      return this.tag('App')
    }
  }
}
