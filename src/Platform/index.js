/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2021 Metrological
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
import Transport from '../Transport'

// public API
export default {
  Localization: {
    city(params) {
      return Transport.send('platform.localization', 'city', params)
    },
    zipCode(params) {
      return Transport.send('platform.localization', 'zipCode', params)
    },
    countryCode(params) {
      return Transport.send('platform.localization', 'countryCode', params)
    },
    language(params) {
      return Transport.send('platform.localization', 'language', params)
    },
    latlon(params) {
      return Transport.send('platform.localization', 'latlon', params)
    },
    locale(params) {
      return Transport.send('platform.localization', 'locale', params)
    },
  },
  Profile: {
    ageRating(params) {
      return Transport.send('platform.profile', 'ageRating', params)
    },
  },
  Device: {
    ip(params) {
      return Transport.send('platform.device', 'ip', params)
    },
    household(params) {
      return Transport.send('platform.device', 'household', params)
    },
    mac(params) {
      return Transport.send('platform.device', 'mac', params)
    },
    operator(params) {
      return Transport.send('platform.device', 'operator', params)
    },
    platform(params) {
      return Transport.send('platform.device', 'platform', params)
    },
    packages(params) {
      return Transport.send('platform.device', 'packages', params)
    },
    uid(params) {
      return Transport.send('platform.device', 'uid', params)
    },
    type(params) {
      return Transport.send('platform.device', 'type', params)
    },
    model(params) {
      return Transport.send('platform.device', 'model', params)
    },
    version() {
      return Transport.send('platform.device', 'version')
    },
    hdcp(params) {
      return Transport.send('platform.device', 'hdcp', params)
    },
    hdr(params) {
      return Transport.send('platform.device', 'hdr', params)
    },
    audio(params) {
      return Transport.send('platform.device', 'audio', params)
    },
    screenResolution(params) {
      return Transport.send('platform.device', 'screenResolution', params)
    },
    videoResolution(params) {
      return Transport.send('platform.device', 'videoResolution', params)
    },
    name(params) {
      return Transport.send('platform.device', 'name', params)
    },
    network(params) {
      return Transport.send('platform.device', 'network', params)
    },
  },
  Accessibility: {
    closedCaptions(params) {
      return Transport.send('platform.accessibility', 'closedCaptions', params)
    },
    voiceGuidance(params) {
      return Transport.send('platform.accessibility', 'voiceGuidance', params)
    },
  },
}
