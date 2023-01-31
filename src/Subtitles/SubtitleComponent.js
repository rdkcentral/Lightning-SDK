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

import Lightning from '../Lightning'

export default class SubtitleComponent extends Lightning.Component {
  static _template() {
    return {
      visible: false,
      rect: true,
      color: 0x90000000,
      shader: { type: Lightning.shaders.RoundedRectangle, radius: 5 },
      Text: {
        y: 5,
        x: 20,
        text: {
          fontColor: 0xffffffff,
          fontSize: 38,
          lineHeight: 38 * 1.4,
          textAlign: 'center',
          wordWrap: true,
          maxLines: 3,
          shadow: true,
          shadowColor: 0xff333333,
        },
      },
    }
  }

  _init() {
    this.tag('Text').on('txLoaded', ({ _source }) => {
      this.w = _source.w + this.tag('Text').x * 2
      this.h = _source.h
      this.position()
    })
  }

  get textFormat() {
    const textTag = this.tag('Text').text
    return {
      fontFace: textTag.fontFace || 'sans-serif',
      fontSize: textTag.fontSize,
      lineHeight: textTag.lineHeight,
      textAlign: textTag.textAlign,
      wordWrap: true,
      maxLines: textTag.maxLines,
    }
  }

  show() {
    this.visible = true
  }

  hide() {
    this.visible = false
  }

  position() {
    this.x = this._calculateX(this.xPos)
    this.y = this._calculateY(this.yPos)
  }

  set viewportW(v) {
    this._viewportW = v
    this.x = this._calculateX(this.xPos)
  }

  get viewportW() {
    return this._viewportW || this.application.finalW
  }

  set viewportH(v) {
    this._viewportH = v
    this.y = this._calculateY(this.yPos)
  }

  get viewportH() {
    return this._viewportH || this.application.finalH
  }

  _calculateX(x) {
    if (x === 'center') {
      x = (this.viewportW - this.finalW) / 2
    } else if (x === 'left') {
      x = 60
    } else if (x === 'right') {
      x = this.viewportW - this.finalW - 60
    }
    return x
  }

  set xPos(v) {
    this._x = v
    this.x = this._calculateX(v)
  }

  get xPos() {
    return this._x || 'center'
  }

  _calculateY(y) {
    if (y === 'center') {
      return (this.viewportH - this.finalH) / 2
    } else if (y === 'top') {
      return 60
    } else if (y === 'bottom') {
      return this.viewportH - this.finalH - 60
    }
    return y
  }

  set yPos(v) {
    this._y = v
    this.y = this._calculateY(v)
  }

  get yPos() {
    return this._y || 'bottom'
  }

  set fontFamily(v) {
    this.tag('Text').text.fontFace = v
  }

  set fontSize(v) {
    this.tag('Text').text.fontSize = v
    this.tag('Text').text.lineHeight = v * 1.3
  }

  set fontColor(v) {
    this.tag('Text').color = v
  }

  set backgroundColor(v) {
    this.color = v
  }

  _defineBreakpoint(text, breakpoint) {
    if (breakpoint >= this.maxWidth) return this.maxWidth
    const textureDefaults = new Lightning.textures.TextTexture(this.stage).cloneArgs()
    const info = Lightning.textures.TextTexture.renderer(
      this.stage,
      this.stage.platform.getDrawingCanvas(),
      {
        ...textureDefaults,
        ...this.textFormat,
        ...{ wordWrapWidth: breakpoint },
        text,
      }
    )._calculateRenderInfo()

    if (info.width <= breakpoint && info.lines.length <= 2) {
      return breakpoint
    } else {
      return this._defineBreakpoint(text, breakpoint * 1.25)
    }
  }

  set text(v) {
    this.alpha = 0
    if (v && v.length) {
      const breakpoint = this._defineBreakpoint(v, 640)

      this.tag('Text').text.wordWrapWidth = breakpoint
      this.tag('Text').text = v
      this.alpha = 1
    }
  }

  set textAlign(v) {
    this._textAlign = v
    this.tag('Text').text.textAlign = v
  }

  set maxWidth(v) {
    this._maxWidth = v
  }

  get maxWidth() {
    return (this._maxWidth || 1200) - this.tag('Text').x * 2
  }

  set maxLines(v) {
    this.tag('Text').text.maxLines = v
  }
}
