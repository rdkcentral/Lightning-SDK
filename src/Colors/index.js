import { mergeColors, calculateAlpha, isObject, isString, argbToHsva, hsvaToArgb } from './utils.js'

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
  let thisColor = null

  const generate = value => {
    if (thisColor) {
      return thisColor
    }
    //check if value has been normalized
    if (normalizedColors[value]) {
      thisColor = normalizedColors[value]
    } else {
      //calculate color
      thisColor = normalizeColorToARGB(value)
    }
    return thisColor
  }

  return {
    get: () => {
      return generate(color)
    },
    alpha: percentage => {
      return calculateAlpha(generate(color), Math.abs(percentage))
    },
    darker: percentage => {
      const hsv = argbToHsva(generate(color))
      hsv.v = hsv.v - (hsv.v / 100) * percentage
      return hsvaToArgb(hsv)
    },
    lighter: percentage => {
      const hsv = argbToHsva(generate(color))
      hsv.s = hsv.s - (hsv.s / 100) * percentage
      return hsvaToArgb(hsv)
    },
    saturation: percentage => {
      const hsv = argbToHsva(generate(color))
      hsv.s = percentage / 100
      return hsvaToArgb(hsv)
    },
    brightness: percentage => {
      const hsv = argbToHsva(generate(color))
      hsv.v = percentage / 100
      return hsvaToArgb(hsv)
    },
    hue: degrees => {
      const hsv = argbToHsva(generate(color))
      hsv.h = degrees
      return hsvaToArgb(hsv)
    },
    mix: (argb, p) => {
      return mergeColors(color, argb, p)
    },
  }
}
