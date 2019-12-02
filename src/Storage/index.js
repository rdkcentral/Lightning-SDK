import Settings from '../Settings'
import localCookie from 'localCookie'

let namespace
let lc

export const initStorage = () => {
  namespace = Settings.get('platform', 'appId')
  // todo: pass options (for example to force the use of cookies)
  lc = new localCookie()
}

const namespacedKey = key => (namespace ? [namespace, key].join('.') : key)

export default {
  get(key) {
    return JSON.parse(lc.getItem(namespacedKey(key)))
  },
  set(key, value) {
    try {
      lc.setItem(namespacedKey(key), JSON.stringify(value))
      return true
    } catch (e) {
      return false
    }
  },
  remove(key) {
    lc.removeItem(namespacedKey(key))
  },
  clear() {
    if (namespace) {
      lc.keys().forEach(key => {
        // remove the item if in the namespace
        key.indexOf(namespace + '.') === 0 ? lc.removeItem(key) : null
      })
    } else {
      lc.clear()
    }
  },
}
