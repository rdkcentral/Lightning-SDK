const settings = {}
const subscribers = {}

export const initSettings = (appSettings, platformSettings) => {
  settings['app'] = appSettings
  settings['platform'] = platformSettings
  settings['user'] = {}
}

const publish = (key, value) => {
  subscribers[key] && subscribers[key].forEach(subscriber => subscriber(value))
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
    settings['user'][key] = value
    publish(key, value)
  },
  subscribe(key, callback) {
    subscribers[key] = subscribers[key] || []
    subscribers[key].push(callback)
  },
  unsubscribe(key, callback) {
    if (callback) {
      const index = subscribers[key] && subscribers[key].findIndex(cb => cb === callback)
      index > -1 && subscribers[key].splice(index, 1)
    } else {
      if (key in subscribers) {
        subscribers[key] = []
      }
    }
  },
  clearSubscribers() {
    for (const key of Object.getOwnPropertyNames(subscribers)) {
      delete subscribers[key]
    }
  },
}
