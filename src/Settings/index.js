const settings = {}
let subscribers = []

export const initSettings = (appSettings, platformSettings) => {
  settings['app'] = appSettings
  settings['platform'] = platformSettings
}

const publish = (type, key, value) => {
  subscribers.forEach(subscriber => subscriber(type, key, value))
}

// todo: support key for nested settings with dot notation? e.g. stage.useImageworker from 'app' settings
export default {
  get(type, key) {
    return settings[type] && settings[type][key]
  },
  has(type, key) {
    return settings[type] && key in settings[type]
  },
  set(key, value, type = 'user') {
    if (type === 'app' || type === 'platform') {
      console.warn('Trying to set app or platform after launch is not allowed')
      return
    }
    settings[type] = settings[type] || {}
    settings[type][key] = value
    publish(type, key, value)
  },
  subscribe(callback) {
    subscribers.push(callback)
  },
  clearSubscribers() {
    subscribers = []
  },
}
