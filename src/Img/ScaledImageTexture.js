/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
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

import Lightning from '../Lightning'

export default class ScaledImageTexture extends Lightning.textures.ImageTexture {
  constructor(stage) {
    super(stage)
    this._scalingOptions = undefined
  }

  set options(options) {
    this.resizeMode = this._scalingOptions = options
  }

  _getLookupId() {
    return `${this._src}-${this._scalingOptions.type}-${this._scalingOptions.w}-${this._scalingOptions.h}`
  }

  getNonDefaults() {
    const obj = super.getNonDefaults()
    if (this._src) {
      obj.src = this._src
    }
    return obj
  }
}
