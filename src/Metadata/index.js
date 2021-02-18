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
let metadata = {}

export const initMetadata = metadataObj => {
  metadata = metadataObj
}

export default {
  get(key, fallback = undefined) {
    const val = metadata[key]
    return val !== undefined ? val : fallback
  },

  getAppId() {
    return this.get('id')
  },

  getAppName() {
    return this.get('name')
  },

  getAppVersion() {
    let ver = this.get('version')
    // Get only version and not the hashvalue
    let version = ver.split('-')
    return version[0]
  },

  getAppIcon() {
    return this.get('icon')
  },
  // Version from app store
  getAppFullVersion() {
    return this.get('version')
  },
}
