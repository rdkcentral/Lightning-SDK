import Lightning from '../Lightning'

export const isFunction = v => {
  return typeof v === 'function'
}

export const isObject = v => {
  return typeof v === 'object'
}

export const isPage = (v, stage) => {
  if (v instanceof Lightning.Element || isClass(v, stage)) {
    return true
  }
  return false
}

export const isConstructor = (type, stage) => {
  try {
    stage.c({ type })
  } catch (e) {
    return false
  }
  return true
}

export const isArray = v => {
  return Array.isArray(v)
}

// not es5 compatible
export const isClass = v => {
  return isFunction(v) && /^\s*class\s+/i.test(v.toString())
}

export const ucfirst = v => {
  return `${v.charAt(0).toUpperCase()}${v.slice(1)}`
}
