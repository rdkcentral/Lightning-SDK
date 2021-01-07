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

import Settings from '../Settings'
import { defaultPlatform } from './defaults'

let getInfo = (namespace, key) => {
  const platform = { ...defaultPlatform, ...Settings.get('platform', 'platform') }
  return Promise.resolve(
    typeof platform[namespace][key] === 'function'
      ? platform[namespace][key]()
      : platform[namespace][key]
  )
}

let setInfo = (key, params) => {
  if (key in defaultPlatform) defaultPlatform[key] = params
}

export const initPlatform = config => {
  getInfo = config.getInfo
  setInfo = config.setInfo
}

const getOrSet = (key, params) => (params ? setInfo(key, params) : getInfo(key))

// public API
export default {
  Localization: {
    city(params) {
      return getOrSet('city', params)
    },
    zipCode(params) {
      return getOrSet('zipCode', params)
    },
    countryCode(params) {
      return getOrSet('countryCode', params)
    },
    language(params) {
      return getOrSet('language', params)
    },
    latlon(params) {
      return getOrSet('latlon', params)
    },
    locale(params) {
      return getOrSet('locale', params)
    },
  },
  User: {
    ageRating(params) {
      return getOrSet('ageRating', params)
    },
  },
  Device: {
    ip(params) {
      return getOrSet('ip', params)
    },
    household(params) {
      return getOrSet('household', params)
    },
    mac(params) {
      return getOrSet('mac', params)
    },
    operator(params) {
      return getOrSet('operator', params)
    },
    platform(params) {
      return getOrSet('platform', params)
    },
    packages(params) {
      return getOrSet('packages', params)
    },
    uid(params) {
      return getOrSet('uid', params)
    },
    stbType(params) {
      return getOrSet('stbType', params)
    },
    hdcp(params) {
      return getOrSet('hdcp', params)
    },
    resolution(params) {
      return getOrSet('resolution', params)
    },
    name(params) {
      return getOrSet('name', params)
    },
    network(params) {
      return getOrSet('network', params)
    },
  },
  Accesibility: {
    closedCaptions(params) {
      return getOrSet('closedCaptions', params)
    },
    voiceGuidance(params) {
      return getOrSet('voiceGuidance', params)
    },
  },
}
