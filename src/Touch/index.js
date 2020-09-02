import Vector from './Vector.js'

let enabled = false
let listeners
let stage

/**
 * Is user pressing `select / ok` button
 * @type {boolean}
 */
let touchStarted = false
let startCoord
let endCoord

/**
 * Element that initialized touchstart
 * @type {null}
 */
let touchedElement = null

/**
 * Simple event to position translation
 * platform can provide own translator
 * @param event
 * @param cb
 * @returns {*}
 */
let translate = (event, cb) => {
  const { touches, changedTouches } = event
  let touch = touches
  if (changedTouches.length) {
    touch = changedTouches
  }
  if (touch.length) {
    let { clientX, clientY } = touch[0]
    if (typeof cb === 'function') {
      cb.call(null, ~~clientX, ~~clientY, event)
    }
  }
  return cb
}

const start = (x, y, event) => {
  const child = getAt(x, y)
  touchStarted = true
  startCoord = new Vector(x, y)

  if (child) {
    touchedElement = child
    emit(child, '_handleTouchStart', event)
  }
}

const move = (x, y) => {
  const current = new Vector(x, y)
  const args = {
    start: startCoord,
    current,
    delta: current.subtract(startCoord),
  }
  if (touchedElement) {
    emit(touchedElement, '_handleTouchMove', args)
  } else {
    const child = getAt(x, y)
    if (child) {
      emit(child, '_handleTouchHover', args)
    }
  }
}

const end = (x, y) => {
  const child = getAt(x, y)
  endCoord = new Vector(x, y)

  if (child || touchedElement) {
    emit(child || touchedElement, '_handleTouchEnd', {
      delta: endCoord.subtract(startCoord),
    })
  }

  touchedElement = null
}

/**
 * Get child at coords
 * @param x
 * @param y
 * @returns {*}
 */
const getAt = (x, y) => {
  const children = collect(x, y)
  if (children.length) {
    const core = children.pop()
    return core.element
  }
  return null
}

/**
 * Collect all children at coords
 * @param x
 * @param y
 * @returns {Array}
 */
const collect = (x, y) => {
  return stage.getChildrenByPosition(x, y)
}

/**
 * Call touchHandlers events on instance
 * @param instance
 * @param event
 * @param args
 */
const emit = (instance, event, args) => {
  if (instance[event]) {
    instance[event](args)
  }
}

export const initTouch = config => {
  if (config.listeners) {
    listeners = config
  }
  if (config.translate) {
    translate = config.translate
  }
}

/**
 * Lightning app must enable touch support
 * @param {Stage} stageInstance
 */
const enable = stageInstance => {
  if (enabled) {
    return
  }
  stage = stageInstance
  // provide default listeners if not provided via platform
  if (!listeners) {
    listeners = {
      start: () => {
        document.addEventListener('touchstart', event => {
          return translate.call(null, event, start)
        })
      },
      end: () => {
        document.addEventListener('touchend', event => {
          return translate.call(null, event, end)
        })
      },
      move: () => {
        document.addEventListener(
          'touchmove',
          event => {
            translate.call(null, event, move)
            event.preventDefault()
          },
          { passive: false }
        )
      },
    }
  }
  listeners.start()
  listeners.end()
  listeners.move()

  enabled = true
}

export default {
  enable,
}
