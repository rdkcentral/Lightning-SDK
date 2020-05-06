const settings = {}
const subscribers = {}

export const initSettings = (appSettings, platformSettings) => {
  settings['app'] = appSettings
  settings['platform'] = platformSettings
  settings['user'] = {}
}

const publish = (key, value) => {
  subscribers[key].forEach(subscriber => subscriber(value))
}

// todo: support key for nested settings with dot notation? e.g. stage.useImageworker from 'app' settings
export default {
  get(type, key) {
    return settings[type] && settings[type][key]
  },
  has(type, key) {
    return settings[type] && key in settings[type]
  },
  set(key, value) {
    const type = 'user'
    settings[type][key] = value
    publish(key, value)
  },
  subscribe(key, callback) {
    subscribers[key] = subscribers[key] || []
    subscribers[key].push(callback)
  },
  clearSubscribers(key) {
    subscribers[key] = []
  },
}
