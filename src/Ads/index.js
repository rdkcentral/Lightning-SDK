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

import Ads from '../VideoPlayer/AdsPlayer'
import { initAdvertising } from '../Advertising'

export const initAds = config => {
  if (config.getAds) {
    initAdvertising(config)
  }
}

console.warn(
  [
    "The 'Ads'-plugin in the Lightning-SDK is deprecated and will be removed in future releases.",
    "Please consider using the new 'VideoPlayer'-plugin which can play ads directly, instead.",
    'https://rdkcentral.github.io/Lightning-SDK/#/plugins/videoplayer',
    "",
    "If ad playback is not needed, consider using the new 'Advertising' plugin which can fetch and parse ads.",
    'https://rdkcentral.github.io/Lightning-SDK/#/plugins/advertising'
  ].join('\n\n'))

export default {
  get: Ads.get,
  cancel: Ads.cancel,
  stop: Ads.stop
}
