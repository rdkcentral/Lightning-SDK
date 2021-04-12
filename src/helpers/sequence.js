export default steps => {
  return steps.reduce((promise, method) => {
    return promise
      .then(function() {
        return method(...arguments)
      })
      .catch(e => Promise.reject(e))
  }, Promise.resolve(null))
}
