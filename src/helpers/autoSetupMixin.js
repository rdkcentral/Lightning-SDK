export default (sourceObject, setup = () => {}) => {
  let ready = false

  const doSetup = () => {
    if (ready === false) {
      setup()
      ready = true
    }
  }

  return Object.keys(sourceObject).reduce((obj, key) => {
    if (typeof sourceObject[key] === 'function') {
      obj[key] = function() {
        doSetup()
        return sourceObject[key].apply(sourceObject, arguments)
      }
    } else if (typeof Object.getOwnPropertyDescriptor(sourceObject, key).get === 'function') {
      obj.__defineGetter__(key, function() {
        doSetup()
        return Object.getOwnPropertyDescriptor(sourceObject, key).get.apply(sourceObject)
      })
    } else if (typeof Object.getOwnPropertyDescriptor(sourceObject, key).set === 'function') {
      obj.__defineSetter__(key, function() {
        doSetup()
        return Object.getOwnPropertyDescriptor(sourceObject, key).set.sourceObject[key].apply(
          sourceObject,
          arguments
        )
      })
    } else {
      obj[key] = sourceObject[key]
    }
    return obj
  }, {})
}
