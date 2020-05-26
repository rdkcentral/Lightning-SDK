let timeout = null

export default (cb, delay) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    cb()
  }, delay)
}
