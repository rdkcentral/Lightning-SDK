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
import Deepmerge from 'deepmerge'

import Settings from '../Settings'
import { defaultPlatform } from './defaults'

let getInfo = (namespace, key) => {
  const platform = Deepmerge(defaultPlatform, Settings.get('platform', 'platform'))
  return Promise.resolve(
    typeof platform[namespace][key] === 'function'
      ? platform[namespace][key]()
      : platform[namespace][key]
  )
}

let setInfo = (key, params) => {
  if (key in defaultPlatform) defaultPlatform[key] = params
}

let addTileToLaunchPad = (name, imageUrl, linkUrl) => {
  // do nothing, this requires Transport Implementation
}

export const initPlatform = config => {
  getInfo = config.getInfo
  setInfo = config.setInfo
  addTileToLaunchPad = config.addTileToLaunchPad
}

const getOrSet = (key, params) => (params ? setInfo(key, params) : getInfo(key))

// public API
export default {
  Personalization: {
    setEntitlements(params) {
      setInfo('entitlements', params)
    },
    addEntitlement(params) {
      let entitlements = getInfo('entitlements')
      entitlements.push(params)
      setInfo('entitlements', params)
    },
    addToWatchHistory(params) {
      let history = getInfo('entitlements')
      history.push(params)
      setInfo('watchHistory', params)
    },
    addTileToLaunchPad (name, imageUrl, linkUrl) {
      addTileToLaunchPad(name, imageUrl, linkUrl)
    }
  },
  Advertising: {
    AdSkipTiers: Object.freeze({
      noSkipNormalSpeed: 'NOSKIP_NORMAL_SPEED',
      allowSkipHighSpeed: 'ALLOW_SKIP_HIGH_SPEED'
    }),
    adSkipTier() {
      return getInfo('adSkipTier')
    },
    limitAdTracking() {
      return getInfo('limitAdTracking')
    },
    advertisingId() {
      return getInfo('advertisingId')
    }
  }
}
