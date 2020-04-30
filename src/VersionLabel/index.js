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

export default class VersionLabel extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      color: 0xbb0078ac,
      h: 40,
      w: 100,
      x: w => w - 50,
      y: h => h - 50,
      mount: 1,
      Text: {
        w: w => w,
        h: h => h,
        y: 5,
        text: {
          fontSize: 22,
          textAlign: 'center',
        },
      },
    }
  }

  set version(version) {
    this.tag('Text').text = `v${version}`
    this.tag('Text').loadTexture()
    this.w = this.tag('Text').renderWidth + 40
  }
}
