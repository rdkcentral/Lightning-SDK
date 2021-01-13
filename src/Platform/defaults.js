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

import { getLocale, getLanguage, getCountryCode, getLatLon } from './helpers'

export const defaultPlatform = {
  localization: {
    city: 'New York',
    zipCode: '27505',
    countryCode: () => getCountryCode('US'),
    language: () => getLanguage('en'),
    latlon: () => getLatLon([40.7128, 74.006]),
    locale: () => getLocale('en-US'),
  },
  profile: {
    ageRating: 'adult',
  },
  device: {
    ip: '127.0.0.1',
    household: 'b2244e9d4c04826ccd5a7b2c2a50e7d4',
    mac: '00:00:00:00:00:00',
    operator: 'Metrological',
    platform: 'Metrological',
    packages: [],
    uid: 'ee6723b8-7ab3-462c-8d93-dbf61227998e',
    type: 'STB',
    model: 'Metrological',
    hdcp: {
      enabled: true,
      negotiatedVersion: 'HDCP2.2',
      maxVersion: 'HDCP2.3'
    },
    // 
    hdr: Object.assign(['dolbyVision', 'hlg'], {hdr10: 'hdr10', hdr10Plus: 'hdr10Plus', dolbyVision: 'dolbyVision', hlg: 'hlg'}),
    audio:Object.assign(['stereo', 'dolbyDigital'], {stereo: 'stereo', dolbyDigital: 'dolbyDigital', dolbyDigitalPlus: 'dolbyDigtalPlus', dolbyAtmos: 'dolbyAtmos'}),
    resolution: [1920, 1080],
    name: 'Living Room',
    network: {
      state: 'Connected',
      type: 'WIFI',
    },
  },
  accessibility: {
    closedCaptions: {
      enabled: true,
      styles: {
        fontFamily: 'Monospace sans-serif',
        fontSize: 1,
        fontColor: '#ffffff',
        fontEdge: 'none',
        fontEdgeColor: '#7F7F7F',
        fontOpacity: 100,
        backgroundColor: '#000000',
        backgroundOpacity: 100,
        textAlign: 'center',
        textAlignVertical: 'middle',
      },
    },
    voiceGuidance: {
      enabled: true,
      speed: 5,
    },
  }
}
