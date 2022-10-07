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
import Subtitle from '../Subtitles'
import Utils from '../Utils'

export default () => {
  return class SubtitleDialog extends Lightning.Component {
    static getFonts() {
      return [{ family: 'Arial', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
    }
    static _template() {
      return {
        Banner: {
          zIndex: 100,
          x: 960,
          y: 750,
          mountX: 0.5,
          Wrapper: {
            color: 0xffb39f69,
            rect: true,
            w: 200,
            h: 200,
            alpha: 0.3,
            Title: {
              text: {
                text: 'Default Text',
                textColor: 0xffff0000,
                fontSize: 40,
                wordWrapWidth: 500,
                shadow: false,
                shadowColor: 0xffffffff,
                lineHeight: 30,
                fontFace: 'Arial',
              },
            },
          },
        },
      }
    }
    _init() {
      this.tag('Title').on('txLoaded', () => {
        this.tag('Wrapper').w = this.tag('Title').renderWidth
        this.tag('Wrapper').h = this.tag('Title').renderHeight
      })
    }

    /**
     * subTitleTextProperties - Subtitle text properties that are to be passed - textColor, wordWrapWidth, fontSize, lineHeight
     * @param txtOption
     */
    set subTitleTextProperties(txtOption) {
      this.tag('Title').text.textColor = txtOption.textColor ? txtOption.textColor : 0xff333333
      this.tag('Title').text.wordWrapWidth = txtOption.wordWrapWidth ? txtOption.wordWrapWidth : 500
      this.tag('Title').text.fontSize = txtOption.fontSize ? txtOption.fontSize : 30
      this.tag('Title').text.lineHeight = txtOption.lineHeight ? txtOption.lineHeight : 30
    }

    /**
     * subTitleText - Text to be passed
     * @param txt
     */
    set subTitleText(txt) {
      this.tag('Title').text.text = txt ? txt : ''
    }

    /**
     * subTitleTextPosition - Text position of the Subtitle text - x, y, mountX
     * @param options
     */
    set subTitleTextPosition(options) {
      this.tag('Banner').x = options.x
      this.tag('Banner').y = options.y
      this.tag('Banner').mountX = options.mountX
    }

    /**
     * subTitleColor - Sets Color of the Subtitle text
     * @param clr
     */
    set subTitleColor(clr) {
      this.tag('Title').text.textColor = clr ? clr : 0xff333333
    }

    /**
     * subTitleOpacity - Sets Opacity of the Subtitle
     * @param percent
     */
    set subTitleOpacity(percent) {
      percent = percent / 100
      this.tag('Title').alpha = percent ? percent : 0.5
    }

    /**
     * subTitleContainerOpacity - Sets Opacity of the Subtitle Container
     * @param percent
     */
    set subTitleContainerOpacity(percent) {
      percent = percent / 100
      this.tag('Wrapper').alpha = percent ? percent : 0.5
    }

    /**
     * subTitleTextSize - Sets text size
     * @param size
     */
    set subTitleTextSize(size) {
      this.tag('Title').text.fontSize = size ? size : 40
    }

    /**
     * subTitleBackground - Sets Subtitle background color
     * @param color
     */
    set subTitleBackground(color) {
      this.tag('Wrapper').color = color ? color : 0xfaf5f500
    }

    /**
     * subTitleFontFamily - Sets Subtitle FontFamily
     * @param family
     */
    set subTitleFontFamily(family) {
      this.tag('Title').text.fontFace = family ? family : 'Arial'
    }

    /**
     * subTitleTextShadowColor - Sets Subtitle Text shadow color
     * @param color
     */
    set subTitleTextShadowColor(color) {
      this.tag('Title').text.shadow = true
      this.tag('Title').text.shadowColor = color ? color : ''
    }

    _firstActive() {
      this.setSmooth('alpha', 1)
    }
    _inactive() {
      Subtitle.hide()
    }
  }
}
