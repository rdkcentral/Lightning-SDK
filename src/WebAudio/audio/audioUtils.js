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

import { isArray } from './../utils'

/**
 * Create distortion curve
 * @uses Algorithm from https://stackoverflow.com/questions/22312841/
 * @param {number} amount The amount of distortion
 * @param {number} samples The number of samples in audio
 */
export const creatDistortionCurve = (amount, samples) => {
  const curve = new Float32Array(samples)
  const deg = Math.PI / 180
  let x
  for (let i = 0; i < samples; ++i) {
    x = (i * 2) / samples - 1
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x))
  }
  return curve
}

/**
 *  Validator for filter coefficients
 * @param {string} name The name of the control
 * @param {Array} coefficients The coefficients array
 * @return valid coefficients or not
 */
export const validateCoeff = (name, coefficients) => {
  if (!coefficients || !isArray(coefficients)) {
    console.error(`${name} coefficients must be an array`)
    return false
  }
  if (coefficients.length < 1 || coefficients.length > 20) {
    console.error(
      `The number of ${name} coefficients provided (${coefficients.length}) is outside the range [1, 20].`
    )
    return false
  }
  return true
}

/**
 * Used to set the parameters on given node
 * @param {AudioNode} node The AudioNode
 * @param {Object} nodeParams The node parameters instance
 */
export const setNodeParams = (node, nodeParams) => {
  nodeParams.params.forEach(param => {
    if (nodeParams[param]) {
      if (nodeParams.isReadonly(param)) {
        node[param].value = nodeParams[param]
      } else {
        node[param] = nodeParams[param]
      }
    }
  })
}
