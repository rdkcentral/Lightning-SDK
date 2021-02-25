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
    return key in metadata ? metadata[key] : fallback
  },
  appId() {
    return this.get('id')
  },
  safeAppId() {
    return this.get('safeId')
  },
  appName() {
    return this.get('name')
  },
  appVersion() {
    // Get only version and not the hashvalue
    return this.get('version') !== undefined ? this.get('version').split('-')[0] : undefined
  },
  appIcon() {
    return this.get('icon')
  },
  // Version from app store
  appFullVersion() {
    return this.get('version')
  },
}
