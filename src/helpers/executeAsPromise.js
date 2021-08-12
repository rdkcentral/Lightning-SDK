export default (method, args, context) => {
  let result
  if (method && typeof method === 'function') {
    try {
      result = method.apply(context, args)
    } catch (e) {
      result = e
    }
  } else {
    result = method
  }

  // if it looks like a duck .. ehm ... promise and talks like a promise, let's assume it's a promise
  if (
    result !== null &&
    typeof result === 'object' &&
    result.then &&
    typeof result.then === 'function'
  ) {
    return result
  }
  // otherwise make a promise
  else {
    return new Promise((resolve, reject) => {
      if (result instanceof Error) {
        reject(result)
      } else {
        resolve(result)
      }
    })
  }
}
