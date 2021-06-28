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

export default class BaseAudio {
  constructor() {}

  /**
   * Validate the audio parameter value
   * @param {string} mName The name of the audio parameter or normal param
   * @param {any} v The value of parameter
   * @param {Array} range The range of the parameter value
   * @return {Boolean} Valid value or not
   */
  _validate(mName, v, range) {
    if (isNaN(v)) {
      console.error(`${mName} must be a number`)
      return false
    }
    if (range) {
      if (v < range[0] || v > range[1]) {
        console.warn(`${mName} must be in range (${range})`)
        return false
      }
    }
    return true
  }

  skip() {
    console.warn('skip feature not supported')
    return this
  }

  volume() {
    console.warn('volume feature not supported')
    return this
  }

  loop() {
    console.warn('loop feature not supported')
    return this
  }

  play() {
    console.warn('play feature not supported')
  }

  pause() {
    console.warn('pause feature not supported')
  }

  resume() {
    console.warn('resume feature not supported')
  }

  stop() {
    console.warn('stop feature not supported')
  }

  delay() {
    console.warn('delay feature not supported')
    return this
  }

  effect(effectIdentifier, normalize = true) {
    console.warn('effect feature not supported')
    return this
  }

  compress() {
    console.warn('compress feature not supported')
    return this
  }

  filter() {
    console.warn('filter feature not supported')
    return this
  }

  IIRFilter() {
    console.warn('IIR filter feature not supported')
    return this
  }

  distortion() {
    console.warn('distortion feature not supported')
    return this
  }

  panner() {
    console.warn('panner feature not supported')
    return this
  }

  stereoPanner() {
    console.warn('stereo panner feature not supported')
    return this
  }

  equalizer() {
    console.warn('stereo panner feature not supported')
    return this
  }

  reset() {
    console.warn('reset feature not supported')
  }
}
