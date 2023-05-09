import { createEmitter } from '../../EventEmitter'

const eventEmitter = createEmitter()
let application = null
let settings = null
let applicationFire = null

export default {
  init(app, options) {
    settings = options
    this.attach(app)
  },
  attach(app) {
    application = app
    applicationFire = application.fire

    application.fire = (event, ...args) => {
      if (event === 'focuschange') {
        console.log('handle Announcer stuff')
      }
      applicationFire(event, ...args)
    }
  },
  detach() {
    application.fire = applicationFire
    application = null
  },
  on: eventEmitter.on,
  once: eventEmitter.once,
  off: eventEmitter.off,
}
