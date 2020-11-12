import { mergeColors, calculateAlpha, limitWithinRange, isObject, isString } from './utils.js'

let colors = {
  white: '#ffffff',
  black: '#000000',
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
  yellow: '#feff00',
  cyan: '#00feff',
  magenta: '#ff00ff',
}

export const initColors = colors => {
  return new Promise((resolve, reject) => {
    if (typeof colors === 'object') {
      add(colors)
      resolve()
    }
    fetch(colors)
      .then(response => response.json())
      .then(json => {
        add(json)
        resolve()
      })
      .catch(e => {
        reject(e)
      })
  })
}

const normalizedColors = {
  //store for normalized colors
}

const calculateColor = (value, options) => {
  let targetColor = normalizeHexToARGB(value)
  if (!isNaN(options)) {
    options = { alpha: options }
  }
  if (options && isObject(options)) {
    if (!isNaN(options.darken)) {
      targetColor = mergeColors(targetColor, 0xff000000, 1 - limitWithinRange(options.darken, 0, 1))
    }

    if (!isNaN(options.lighten)) {
      targetColor = mergeColors(
        targetColor,
        0xffffffff,
        1 - limitWithinRange(options.lighten, 0, 1)
      )
    }

    if (!isNaN(options.opacity)) {
      options.alpha = options.opacity / 100
    }

    if (!isNaN(options.alpha)) {
      targetColor = calculateAlpha(targetColor, options.alpha)
    }
  }
  return targetColor || 0
}

const normalizeHexToARGB = color => {
  let targetColor = colors[color]
  if (!targetColor) {
    targetColor = color
  }
  const check = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i
  if (isString(targetColor) && check.test(targetColor)) {
    let hex = check.exec(targetColor)[1]
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(value => {
          return value + value
        })
        .join('')
    }
    targetColor = `0xff${hex}` * 1
  }
  return targetColor || 0xffffffff
}

const cleanUpNormalizedColor = color => {
  for (let c in normalizedColors) {
    if (c.indexOf(color) > -1) {
      delete normalizedColors[c]
    }
  }
}

const add = (colorsToAdd, value) => {
  if (isObject(colorsToAdd)) {
    // clean up normalizedColors if they exist in the to be added colors
    Object.keys(colorsToAdd).forEach(color => cleanUpNormalizedColor(color))
    colors = Object.assign({}, colors, colorsToAdd)
  } else if (isString(colorsToAdd) && value) {
    cleanUpNormalizedColor(colorsToAdd)
    colors[colorsToAdd] = value
  }
}

export default {
  get(value, options) {
    // create color tag for storage
    let tag = `${value}${options !== undefined ? JSON.stringify(options) : ''}`
    // check if tag is stored in colors;
    if (normalizedColors[tag]) {
      // return stored color
      return normalizedColors[tag]
    }

    // calculate a new color
    const targetColor = calculateColor(value, options)

    // store calculated color if its not stored
    if (!normalizedColors[tag]) {
      normalizedColors[tag] = targetColor
    }
    return targetColor || 0
  },
  add,
  mix(color1, color2, p) {
    color1 = this.get(color1)
    color2 = this.get(color2)
    return mergeColors(color1, color2, p)
  },
}
