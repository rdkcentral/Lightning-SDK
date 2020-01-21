const settings = {}

export const initSettings = (appSettings, platformSettings) => {
  settings['app'] = appSettings
  settings['platform'] = platformSettings
}

// todo: support key for nested settings with dot notation? e.g. stage.useImageworker from 'app' settings
export default {
  get(type, key) {
    return settings[type] && settings[type][key]
  },
  has(type, key) {
    return settings[type] && key in settings[type]
  },
}
