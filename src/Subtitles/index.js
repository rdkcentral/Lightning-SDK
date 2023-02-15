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

import { AppInstance } from '../Application'
import SubtitleComponent from './SubtitleComponent'

let subtitlesComponent
const getOrCreateSubtitlesComponent = () => {
  return subtitlesComponent
    ? subtitlesComponent
    : (subtitlesComponent =
        AppInstance.application.tag('Subtitles') ||
        AppInstance.application.childList.a(
          AppInstance.stage.c({
            ref: 'Subtitles',
            type: SubtitleComponent,
            forceZIndexContext: true,
            zIndex: 2,
          })
        ))
}

export default {
  show() {
    const subtitles = getOrCreateSubtitlesComponent()
    subtitles.show()
  },
  hide() {
    const subtitles = getOrCreateSubtitlesComponent()
    subtitles.hide()
  },
  styles(v) {
    Object.keys(v).forEach(key => {
      if (key in this && typeof this[key] === 'function') {
        this[key](v[key])
      }
    })
  },
  fontFamily(v) {
    const subtitles = getOrCreateSubtitlesComponent()
    subtitles.fontFamily = v
  },
  fontSize(v) {
    const subtitles = getOrCreateSubtitlesComponent()
    subtitles.fontSize = v
  },
  fontColor(v) {
    const subtitles = getOrCreateSubtitlesComponent()
    subtitles.fontColor = v
  },
  backgroundColor(v) {
    const subtitles = getOrCreateSubtitlesComponent()
    subtitles.backgroundColor = v
  },
  textAlign(v) {
    const subtitles = getOrCreateSubtitlesComponent()
    subtitles.textAlign = v
  },
  textAlignVertical(v) {
    const subtitles = getOrCreateSubtitlesComponent()
    subtitles.textAlignVertical = v
  },
  viewport(w, h) {
    const subtitles = getOrCreateSubtitlesComponent()
    subtitles.viewportW = w
    subtitles.viewportH = h
  },
  position(x, y) {
    const subtitles = getOrCreateSubtitlesComponent()
    subtitles.xPos = x
    subtitles.yPos = y
  },
  maxWidth(v) {
    const subtitles = getOrCreateSubtitlesComponent()
    subtitles.maxWidth = v
  },
  maxLines(v) {
    const subtitles = getOrCreateSubtitlesComponent()
    subtitles.maxLines = v
  },
  text(v) {
    const subtitles = getOrCreateSubtitlesComponent()
    subtitles.text = v
  },
  clear() {
    const subtitles = getOrCreateSubtitlesComponent()
    subtitles.text = ''
  },
  textFormat() {
    const subtitles = getOrCreateSubtitlesComponent()
    return subtitles.textFormat
  }
}
