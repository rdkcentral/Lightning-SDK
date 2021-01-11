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
  user: {
    authenticationToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
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
    hdcp: 'HDR10',
    resolution: [1920, 1080], // maybe make this dynamically from the browser window?
    name: 'Living Room',
    network: {
      state: 'Connected',
      type: 'WIFI',
    },
  },
  accesibility: {
    closedCaptions: {
      enabled: true,
      styles: '?', // what kind of values could we have here?
    },
    voiceGuidance: {
      enabled: true,
      speed: 5,
    },
  },
  profile: {
    advertising: {
      config: {
        advertisingId: '26ccd5a7b2c2a50e7d4b2244e9d4c048',
        siteSection: '123',
        profile: '123'
      },
      policy: {
        adSkipTier: 'NOSKIP_NORMAL_SPEED',
        adSkipGracePeriodSeconds: 60
      },
      privacy: {
        limitTracking: false,
      },
      clearAdvertisingId: function() {}
    },
    personalization: {
      entitlements: [
        {
          entitlementId: 'http://entitlements/some/canonical/id',
          startTime: '2021-01-01T18:25:43.511Z',
          endTime: '2021-12-31T12:59:59.911Z'
        },
        {
          entitlementId: 'http://entitlements/some/canonical/id2',
          startTime: '2021-04-23T18:25:43.511Z',
          endTime: '2022-04-23T18:25:43.511Z'
        }
      ],
      watched: true, // success
      launchPadTile: true // success
    }
  }
}
