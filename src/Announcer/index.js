/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the License)
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

import Speech from './Speech'
const fiveMinutes = 300 * 1000

function elmName(elm) {
  return elm.ref || elm.constructor.name
}

let focusTimer
export default (base, speak = Speech) =>
  class Announcer extends base {
    _firstEnable() {
      super._firstEnable && super._firstEnable()

      // Lightning only calls Focus Change on second focus
      this._focusChange()
      this.announcerTimeout = this.announcerTimeout || fiveMinutes
    }

    set announcerEnabled(val) {
      this._announcerEnabled = val
      this._focusChange()
    }

    get announcerEnabled() {
      return this._announcerEnabled
    }

    _updateClearFocusTimer() {
      clearTimeout(focusTimer)
      focusTimer = setTimeout(() => {
        this._lastFocusPath = undefined
      }, this.announcerTimeout)
    }

    _focusChange() {
      if (!this.announcerEnabled) {
        return
      }

      let focusPath = this.application.focusPath
      let lastFocusPath = this._lastFocusPath || []
      let loaded = focusPath.every(elm => !elm.loading)

      this._updateClearFocusTimer()

      if (!loaded) {
        return
      }
      let focusDiff = focusPath.filter(elm => !lastFocusPath.includes(elm))

      let toAnnounce = focusDiff.reduce((acc, elm) => {
        if (elm.announce) {
          acc.push([elmName(elm), 'Announce', elm.announce])
        } else {
          acc.push([elmName(elm), 'Title', elm.title || ''])
        }
        return acc
      }, [])

      focusDiff.reverse().reduce((acc, elm) => {
        if (elm.announceContext) {
          acc.push([elmName(elm), 'Context', elm.announceContext])
        } else {
          acc.push([elmName(elm), 'No Context', ''])
        }
        return acc
      }, toAnnounce)

      this._lastFocusPath = focusPath.slice(0)

      if (this.debug) {
        console.table(toAnnounce)
      }

      toAnnounce = toAnnounce.reduce((acc, a) => {
        let txt = a[2]
        txt && acc.push(txt)
        return acc
      }, [])

      if (toAnnounce.length) {
        speak(toAnnounce)
      }
    }
  }
