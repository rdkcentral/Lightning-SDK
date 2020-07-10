import Lightning from '../Lightning'
import Settings from '../Settings'

export const isFunction = v => {
  return typeof v === 'function'
}

export const isObject = v => {
  return typeof v === 'object' && v !== null
}

export const isBoolean = v => {
  return typeof v === 'boolean'
}

export const isPage = v => {
  if (v instanceof Lightning.Element || isLightningComponent(v)) {
    return true
  }
  return false
}

export const isLightningComponent = type => {
  return type.prototype && 'isComponent' in type.prototype
}

export const isArray = v => {
  return Array.isArray(v)
}

export const ucfirst = v => {
  return `${v.charAt(0).toUpperCase()}${v.slice(1)}`
}

export const isString = v => {
  return typeof v === 'string'
}

export const getConfigMap = () => {
  const routerSettings = Settings.get('platform', 'router')
  const isObj = isObject(routerSettings)

  return [
    'backtrack',
    'gcOnUnload',
    'destroyOnHistoryBack',
    'lazyCreate',
    'lazyDestroy',
    'reuseInstance',
    'autoRestoreRemote',
  ].reduce((config, key) => {
    config.set(key, isObj ? routerSettings[key] : Settings.get('platform', key))
    return config
  }, new Map())
}
