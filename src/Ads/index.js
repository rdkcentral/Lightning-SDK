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
import AdsPlayer from './player'
import { initAds as initAdsPlayer } from './player'

export const initAds = config => {
  if (config.getAds) {
    initAdsPlayer(config)
  }
}

let getAdvertisingId = function() {
  return '26ccd5a7b2c2a50e7d4b2244e9d4c048'
}

let resetAdvertisingId = function() {
  return true;
}

/*let getConfig = function() {
  return {		
    siteSection: '123',		
    profile: '123'		
  }
}
*/

let getPolicy = function() {
  return {		
    adSkipTier: 'NOSKIP_NORMAL_SPEED',		
    adSkipGracePeriodSeconds: 60		
  }
}

let getPrivacy = function() {
  return {		
    limitTracking: false,		
  }
}

let getAds = function() {
  return Promise.resolve({
    prerolls: [],
    midrolls: [],
    postrolls: []
  })
}

export const initAdvertising = config => {
  getAdvertisingId = config.getAdvertisingId || getAdvertisingId
  resetAdvertisingId = config.resetAdvertisingId || resetAdvertisingId
//  getConfig = config.getConfig || getConfig
  getPolicy = config.getPolicy || getPolicy
  getPrivacy = config.getPrivacy || getPrivacy
  getAds = config.getAds || getAds
}

export default {
  advertisingId() {
    return getAdvertisingId()
  },
  resetAdvertisingId() {		
    return resetAdvertisingId()
  },
//  config() {		
//    return getConfig()
//  },		
  policy() {		
    return getPolicy()
  },		
  privacy() {		
    return getPrivacy()
  },
  get: AdsPlayer.get,
  cancel: AdsPlayer.cancel,
  stop: AdsPlayer.stop
}