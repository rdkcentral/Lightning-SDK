const hasListeners = listeners => {
  return Object.keys(listeners).length > 0
}
const combiner = (name, listeners, arg1, arg2, arg3) => {
  const collection = listeners[name]
  if (collection) {
    collection.forEach(listener => {
      listener(arg1, arg2, arg3)
    })
  }
}
const on = (name, listener, functions, listeners) => {
  const fn = functions[name]
  if (!fn) {
    functions[name] = listener
  } else {
    if (functions[name] !== combiner) {
      listeners[name] = [functions[name], listener]
      functions[name] = combiner
    } else {
      listeners[name].push(listener)
    }
  }
}
const once = (name, listener, functions, listeners) => {
  const wrapper = function(arg1, arg2, arg3) {
    listener(arg1, arg2, arg3)
    off(name, wrapper, functions, listeners)
  }
  wrapper._origin = listener
  on(name, wrapper, functions, listeners)
}
const has = (name, listener, functions, listeners) => {
  if (hasListeners(functions)) {
    const fn = functions[name]
    if (fn) {
      if (fn === combiner) {
        for (const l of listeners) {
          if (l === listener || l._origin == listener) {
            return true
          }
        }
      } else if (functions[name] === listener || functions[name]._origin === listener) {
        return true
      }
    }
  }
  return false
}
const off = (name, listener, functions, listeners) => {
  if (hasListeners(functions)) {
    const fn = functions[name]
    if (fn) {
      if (fn === combiner) {
        const collection = listeners[name]
        let index = collection.indexOf(listener)
        if (index > -1) {
          collection.splice(index, 1)
        }
        index = collection.map(l => l._origin).indexOf(listener)
        if (index > -1) {
          collection.splice(index, 1)
        }
        if (collection.length === 1) {
          functions[name] = collection[0]
          delete listeners[name]
        }
      } else if (functions[name] === listener || functions[name]._origin === listener) {
        delete functions[name]
      }
    }
  }
}
const allOff = (name, functions, listeners) => {
  if (hasListeners(listeners)) {
    delete functions[name]
    delete listeners[name]
  }
}
const emit = (name, arg1, arg2, arg3, functions, listeners) => {
  if (hasListeners(functions)) {
    const fn = functions[name]
    if (fn) {
      if (fn === combiner) {
        fn(name, listeners, arg1, arg2, arg3)
      } else {
        fn(arg1, arg2, arg3)
      }
    }
  }
}
const emitters = {}
export const defineEmitter = name => {
  name = name || 'root'
  if (emitters[name]) {
    console.error('Cluster already exists')
  }
  emitters[name] = createEmitter()
  return emitters[name]
}
export const removeEmitter = name => {
  if (!emitters[name]) {
    return
  }
  delete emitters[name]
}
export const getEmitter = name => {
  return emitters[name]
}
export const hasEmitter = name => emitters[name] !== undefined
export const createEmitter = function() {
  const functions = {}
  const listeners = {}
  const emitter = {
    on: (name, listener) => {
      on(name, listener, functions, listeners)
    },
    once: (name, listener) => {
      once(name, listener, functions, listeners)
    },
    has: (name, listener) => {
      has(name, listener, functions, listeners)
    },
    off: (name, listener) => {
      off(name, listener, functions, listeners)
    },
    allOff: name => {
      allOff(name, functions, listeners)
    },
    emit: (name, arg1, arg2, arg3) => {
      emit(name, arg1, arg2, arg3, functions, listeners)
    },
  }
  return emitter
}
export default {
  ...defineEmitter(),
}
