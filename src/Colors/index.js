import { mergeColors, calculateAlpha, isObject, isString, argbToHsva, hsvaToArgb } from './utils.js'

import { Log } from '../../index.js'

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

const addColors = (colorsToAdd, value) => {
  if (isObject(colorsToAdd)) {
    // clean up normalizedColors if they exist in the to be added colors
    Object.keys(colorsToAdd).forEach(color => cleanUpNormalizedColors(color))
    colors = Object.assign({}, colors, colorsToAdd)
  } else if (isString(colorsToAdd) && value) {
    cleanUpNormalizedColors(colorsToAdd)
    colors[colorsToAdd] = value
  }
}

const cleanUpNormalizedColors = color => {
  for (let c in normalizedColors) {
    if (c.indexOf(color) > -1) {
      delete normalizedColors[c]
    }
  }
}

export const initColors = file => {
  return new Promise((resolve, reject) => {
    if (typeof file === 'object') {
      addColors(file)
      resolve()
    }
    fetch(file)
      .then(response => response.json())
      .then(json => {
        addColors(json)
        resolve()
      })
      .catch(e => {
        Log.error(e)
        reject(e)
      })
  })
}

const normalizeColorToARGB = color => {
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

export default color => {
  return Color.generate(color)
}

const Color = {
  color: null,
  generate: function(value = this.color) {
    if (normalizedColors[value]) {
      this.color = normalizedColors[value]
    } else {
      this.color = normalizeColorToARGB(value)
    }
    return this
  },
  get() {
    return this.color
  },
  alpha: function(percentage) {
    this.color = calculateAlpha(this.color, Math.abs(percentage))
    return this
  },
  darker(percentage) {
    const hsv = argbToHsva(this.color)
    hsv.v = hsv.v - (hsv.v / 100) * percentage
    this.color = hsvaToArgb(hsv)
    return this
  },
  lighter(percentage) {
    const hsv = argbToHsva(this.color)
    hsv.s = hsv.s - (hsv.s / 100) * percentage
    this.color = hsvaToArgb(hsv)
    return this
  },
  saturation(percentage) {
    const hsv = argbToHsva(this.color)
    hsv.s = percentage / 100
    this.color = hsvaToArgb(hsv)
    return this
  },
  brightness(percentage) {
    const hsv = argbToHsva(this.color)
    hsv.v = percentage
    this.color = hsvaToArgb(hsv)
    return this
  },
  hue(degrees) {
    const hsv = argbToHsva(this.color)
    hsv.h = degrees
    this.color = hsvaToArgb(hsv)
    return this
  },
  mix(argb, p) {
    this.color = mergeColors(this.color, argb, p)
    return this
  },
}
