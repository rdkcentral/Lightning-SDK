import { mergeColors, calculateAlpha, isObject, isString } from './utils.js'

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

const normalizedColors = {
  //store for normalized colors
}

const calculateColor = (value, options) => {
  let targetColor = normalizeColor(value)
  if (!isNaN(options)) {
    options = { alpha: options }
  }
  if (options && isObject(options)) {
    if (!isNaN(options.darken)) {
      targetColor = mergeColors(targetColor, 0xff000000, 1 - options.darken)
    }

    if (!isNaN(options.lighten)) {
      targetColor = mergeColors(targetColor, 0xffffffff, 1 - options.lighten)
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

const normalizeColor = color => {
  let targetColor = colors[color]
  if (!targetColor) {
    targetColor = color
  }
  if (isString(targetColor) && /^#[0-9A-F]{6}$/i.test(targetColor.toUpperCase())) {
    targetColor = `0xff${targetColor.slice(1)}` * 1
  }
  return targetColor || 0xffffffff
}

const cleanUpNormalizedColor = color => {
  for (let c in normalizedColors) {
    if (c.indexOf(color) > -1) {
      normalizedColors[c] = undefined
      delete normalizedColors[c]
    }
  }
}

export default {
  get(value, options) {
    // create color tag for storage
    let tag = `${value}${options !== undefined ? JSON.stringify(options) : ''}`
    // check if value is not a number, or if options is not undefined
    if (isNaN(value) || options) {
      // check if tag is stored in colors;
      if (normalizedColors[tag]) {
        // return stored color
        return normalizedColors[tag]
      }
    }

    // calculate a new color
    const targetColor = calculateColor(value, options)

    // store calculated color if its not stored
    if (!normalizedColors[tag]) {
      normalizedColors[tag] = targetColor
    }
    return targetColor || 0
  },

  add(colors, value) {
    if (isObject(colors)) {
      // clean up normalizedColors if they exist in the to be added colors
      Object.keys(colors).forEach(color => cleanUpNormalizedColor(color))
      colors = Object.assign({}, colors, colors)
    } else if (isString(colors) && value) {
      cleanUpNormalizedColor(colors)
      colors[colors] = value
    }
  },
  mix(color1, color2, p) {
    color1 = this.get(color1)
    color2 = this.get(color2)
    return mergeColors(color1, color2, p)
  },
}
