import Lightning from '../Lightning'

export const isFunction = v => {
  return typeof v === 'function'
}

export const isObject = v => {
  return typeof v === 'object'
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
