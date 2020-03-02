/* Voice
 * Lightning-SDK voice APIs
 */

let callback = null

let onIntent = intent => {
  if (callback) callback(intent)
}

export const initVoice = config => {
  if (config.onIntent) onIntent = config.onIntent.apply(this, callback)
}

// Public API
export default {
  listen(fn) {
    if (fn && typeof fn === 'function') callback = fn
  },
  close() {
    callback = null
  },
}
