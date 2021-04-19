/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Log from '../Log'
import { mergeColors, calculateAlpha, isObject, isString, argbToHSLA, hslaToARGB } from './utils.js'

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
      .catch(() => {
        const error = 'Colors file ' + file + ' not found'
        Log.error(error)
        reject(error)
      })
  })
}

const normalizeColorToARGB = color => {
  let targetColor = normalizedColors[color] || colors[color] || color
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
  if (!normalizedColors[color]) {
    normalizedColors[color] = targetColor
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
    const hsl = argbToHSLA(this.color)
    hsl.l = hsl.l * (1 - percentage)
    this.color = hslaToARGB(hsl)
    return this
  },
  lighter(percentage) {
    const hsl = argbToHSLA(this.color)
    hsl.l = hsl.l + (1 - hsl.l) * percentage
    this.color = hslaToARGB(hsl)
    return this
  },
  saturation(percentage) {
    const hsl = argbToHSLA(this.color)
    hsl.s = percentage
    this.color = hslaToARGB(hsl)
    return this
  },
  lightness(percentage) {
    const hsl = argbToHSLA(this.color)
    hsl.l = percentage
    this.color = hslaToARGB(hsl)
    return this
  },
  hue(degrees) {
    const hsl = argbToHSLA(this.color)
    hsl.h = degrees
    this.color = hslaToARGB(hsl)
    return this
  },
  mix(argb, p) {
    this.color = mergeColors(this.color, argb, p)
    return this
  },
}
