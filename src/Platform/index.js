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

let platform = {}

let getProperty = (namespace, key) => {
  namespace = namespace.toLowerCase()
  platform = Deepmerge(defaultPlatform, Settings.get('platform', 'platform', {}), platform)

  return new Promise((resolve, reject) => {
    if (platform[namespace] && key in platform[namespace]) {
      resolve(
        typeof platform[namespace][key] === 'function'
          ? platform[namespace][key]()
          : platform[namespace][key]
      )
    } else {
      reject(namespace + '.' + key + ' not found')
    }
  })
}

let setProperty = (namespace, key, params) => {
  namespace = namespace.toLowerCase()

  platform = Deepmerge(defaultPlatform, Settings.get('platform', 'platform', {}), platform)
  return new Promise((resolve, reject) => {
    if (platform[namespace] && key in platform[namespace]) {
      platform[namespace][key] = params
      resolve(params)
    } else {
      reject(namespace + '.' + key + ' not found')
    }
  })
}

let hasProperty = (namespace, key) => {
  platform = Deepmerge(defaultPlatform, Settings.get('platform', 'platform', {}), platform)
  return Promise.resolve(platform[namespace] && key in platform[namespace])
}

function getVersion() {
  let ver = platform['device']['version']
  console.log(ver)
  ver.debug = 'Operator - Platform\n'
  ver.debug += new Date().toISOString() + '\n'
  ver.debug += ver.sdk.readable + '\n'
  ver.debug += ver.os.readable + '\n'
  ver.debug += 'Example Component - v1.0.0'
  return Promise.resolve(ver)
}

export const initPlatform = config => {
  getProperty = config.getProperty
  setProperty = config.setProperty
  hasProperty = config.hasProperty
}

const getOrSet = (namespace, key, params) =>
  typeof params !== 'undefined' ? setProperty(namespace, key, params) : getProperty(namespace, key)

// public API
export default {
  Localization: {
    city(params) {
      return getOrSet('localization', 'city', params)
    },
    zipCode(params) {
      return getOrSet('localization', 'zipCode', params)
    },
    countryCode(params) {
      return getOrSet('localization', 'countryCode', params)
    },
    language(params) {
      return getOrSet('localization', 'language', params)
    },
    latlon(params) {
      return getOrSet('localization', 'latlon', params)
    },
    locale(params) {
      return getOrSet('localization', 'locale', params)
    },
  },
  Profile: {
    ageRating(params) {
      return getOrSet('profile', 'ageRating', params)
    },
  },
  Device: {
    ip(params) {
      return getOrSet('device', 'ip', params)
    },
    household(params) {
      return getOrSet('device', 'household', params)
    },
    mac(params) {
      return getOrSet('device', 'mac', params)
    },
    operator(params) {
      return getOrSet('device', 'operator', params)
    },
    platform(params) {
      return getOrSet('device', 'platform', params)
    },
    packages(params) {
      return getOrSet('device', 'packages', params)
    },
    uid(params) {
      return getOrSet('device', 'uid', params)
    },
    type(params) {
      return getOrSet('device', 'type', params)
    },
    model(params) {
      return getOrSet('device', 'model', params)
    },
    version() {
      return getVersion()
    },
    hdcp(params) {
      return getOrSet('device', 'hdcp', params)
    },
    hdr(params) {
      return getOrSet('device', 'hdr', params)
    },
    audio(params) {
      return getOrSet('device', 'audio', params)
    },
    screenResolution(params) {
      return getOrSet('device', 'screenResolution', params)
    },
    videoResolution(params) {
      return getOrSet('device', 'videoResolution', params)
    },
    name(params) {
      return getOrSet('device', 'name', params)
    },
    network(params) {
      return getOrSet('device', 'network', params)
    },
  },
  Accessibility: {
    closedCaptions(params) {
      return getOrSet('accessibility', 'closedCaptions', params)
    },
    voiceGuidance(params) {
      return getOrSet('accessibility', 'voiceGuidance', params)
    },
  },
  get(namespacedKeyOrKeys = []) {
    return Array.isArray(namespacedKeyOrKeys)
      ? Promise.all(
          namespacedKeyOrKeys.map(key => {
            return getProperty.apply(this, key.split('.'))
          })
        ).then(values =>
          namespacedKeyOrKeys.reduce((result, key, index) => {
            result[key] = values[index]
            return result
          }, {})
        )
      : getProperty.apply(this, namespacedKeyOrKeys.split('.'))
  },
  set(namespacedKey, value) {
    return setProperty.apply(this, [...namespacedKey.split('.'), ...value])
  },
  has(namespacedKey) {
    return hasProperty.apply(this, namespacedKey.split('.'))
  },
}
