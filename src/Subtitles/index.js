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

import { ApplicationInstance } from '../Launch'
import SubTitleDialog from './SubtitleDialog'

let subTitleDialog = null

// Public API
export default {
  /**
   * Show - Shows the Subtitle dialog
   * @returns {Promise<unknown>}
   */
  show() {
    return new Promise((resolve, reject) => {
      subTitleDialog = ApplicationInstance.stage.c({
        ref: 'SubTitleDialog',
        type: SubTitleDialog(),
        resolve,
        reject,
      })
      ApplicationInstance.childList.a(subTitleDialog)
    })
  },

  /**
   * Hide - Hides the subtitle dialog
   */
  hide() {
    ApplicationInstance.focus = null
    ApplicationInstance.children = ApplicationInstance.children.map(
      child => child !== subTitleDialog && child
    )
    subTitleDialog = null
  },

  /**
   * position - Positions the subtitle with x, y and mountX
   * @param obj
   */
  position(obj) {
    if (subTitleDialog !== null) {
      subTitleDialog.subTitleTextPosition = obj
    }
  },

  /**
   * text - Subtitle text
   * @param txt
   */
  text(txt) {
    if (subTitleDialog !== null) {
      subTitleDialog.subTitleText = txt
    }
  },

  /**
   * textProperties - Text Properties that are to be passed - textColor, wordWrapWidth, fontSize, lineHeight
   * @param obj
   */
  textProperties(obj) {
    if (subTitleDialog !== null) {
      subTitleDialog.subTitleTextProperties = obj
    }
  },

  /**
   * color - Sets the color of the subtitle
   * @param color
   */
  color(color) {
    if (subTitleDialog !== null) {
      subTitleDialog.subTitleColor = color
    }
  },

  /**
   * opacity - Sets the opacity of the subtitle
   * @param opacity
   */
  opacity(opacity) {
    if (subTitleDialog !== null) {
      subTitleDialog.subTitleOpacity = opacity
    }
  },

  /**
   * opacity - Sets the opacity of the subtitle container
   * @param opacity
   */
  containerOpacity(opacity) {
    if (subTitleDialog !== null) {
      subTitleDialog.subTitleContainerOpacity = opacity
    }
  },

  /**
   * txtSize - Sets the text size of the subtitle
   * @param size
   */
  txtSize(size) {
    if (subTitleDialog !== null) {
      subTitleDialog.subTitleTextSize = size
    }
  },

  /**
   * background - Sets the background color of the subtitle
   * @param color
   */
  background(color) {
    if (subTitleDialog !== null) {
      subTitleDialog.subTitleBackground = color
    }
  },

  /**
   * shadow - Sets the shadow color for the subtitle text
   * @param shadowColor
   */
  shadow(shadowColor) {
    if (subTitleDialog !== null) {
      subTitleDialog.subTitleTextShadowColor = shadowColor
    }
  },

  /**
   * font - Sets the fontFace of the subtitle
   * @param family
   */
  font(family) {
    if (subTitleDialog !== null) {
      subTitleDialog.subTitleFontFamily = family
    }
  },

  /**
   * alignment - Sets the alignment of the subtitle text
   * @param options
   */
  alignment(options) {
    if (subTitleDialog !== null) {
      subTitleDialog.subTitleTextAlignment = options
    }
  },
}
