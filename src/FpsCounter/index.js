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
import Settings from '../Settings'
import Log from '../Log'
export default class FpsIndicator extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      color: 0xffffffff,
      texture: Lightning.Tools.getRoundRect(80, 80, 40),
      h: 80,
      w: 80,
      x: 100,
      y: 100,
      mount: 1,
      Background: {
        x: 3,
        y: 3,
        texture: Lightning.Tools.getRoundRect(72, 72, 36),
        color: 0xff008000,
      },
      Counter: {
        w: w => w,
        h: h => h,
        y: 10,
        text: {
          fontSize: 32,
          textAlign: 'center',
        },
      },
      Text: {
        w: w => w,
        h: h => h,
        y: 48,
        text: {
          fontSize: 15,
          textAlign: 'center',
          text: 'FPS',
        },
      },
    }
  }

  _setup() {
    this.config = {
      ...{
        log: false,
        interval: 500,
        threshold: 1,
      },
      ...Settings.get('platform', 'showFps'),
    }

    this.fps = 0
    this.lastFps = this.fps - this.config.threshold

    const fpsCalculator = () => {
      this.fps = ~~(1 / this.stage.dt)
    }
    this.stage.on('frameStart', fpsCalculator)
    this.stage.off('framestart', fpsCalculator)
    this.interval = setInterval(this.showFps.bind(this), this.config.interval)
  }

  _firstActive() {
    this.showFps()
  }

  _detach() {
    clearInterval(this.interval)
  }

  showFps() {
    if (Math.abs(this.lastFps - this.fps) <= this.config.threshold) return
    this.lastFps = this.fps
    // green
    let bgColor = 0xff008000
    // orange
    if (this.fps <= 40 && this.fps > 20) bgColor = 0xffffa500
    // red
    else if (this.fps <= 20) bgColor = 0xffff0000

    this.tag('Background').setSmooth('color', bgColor)
    this.tag('Counter').text = `${this.fps}`

    this.config.log && Log.info('FPS', this.fps)
  }
}
