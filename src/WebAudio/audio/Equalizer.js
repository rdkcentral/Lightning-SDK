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

/**
 *@class Represents Equalizer
 */
export default class Equalizer {
  constructor(audioContext, filterBands) {
    this._audioCtx = audioContext
    this._filterNodes = new Map()
    this._createFilterBands(filterBands)
  }

  /**
   * Create filter nodes for each frequency band
   * @param {Array} filterBands An array of frequency bands
   */
  _createFilterBands(filterBands) {
    filterBands.forEach((band, index) => {
      switch (index) {
        case 0:
          this._filterNodes.set(band.name, this._createNode('lowshelf', band))
          break
        case filterBands.length - 1:
          this._filterNodes.set(band.name, this._createNode('highshelf', band))
          break
        default:
          this._filterNodes.set(band.name, this._createNode('peaking', band))
          break
      }
    })
  }

  /**
   * Create BiquadFilter node based on type
   * @param {String} type The type of filter
   * @param {Object} bandObj The band config object
   */
  _createNode(type, bandObj) {
    const node = this._audioCtx.createBiquadFilter()
    node.type = type
    node.frequency.value = bandObj.frequency
    node.Q.value = bandObj.q
    return node
  }

  /**
   * @return Returns the created filter nodes
   */
  get bandNodes() {
    return this._filterNodes
  }
}
