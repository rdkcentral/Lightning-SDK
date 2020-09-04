export const isFunction = v => {
  return typeof v === 'function'
}

export const isObject = v => {
  return typeof v === 'object' && v !== null
}

export const isBoolean = v => {
  return typeof v === 'boolean'
}

export const isArray = v => {
  return Array.isArray(v)
}

export const isString = v => {
  return typeof v === 'string'
}

export const isPromise = (method, args) => {
  let result
  if (isFunction(method)) {
    try {
      result = method.apply(null)
    } catch (e) {
      result = e
    }
  } else {
    result = method
  }
  return isObject(result) && isFunction(result.then)
}
