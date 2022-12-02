/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
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

import { ApplicationInstance } from '../Launch'

export default {
  update(updatedKeyMap) {
    let defaultKeyMap = ApplicationInstance.stage.application.config.keys
    Object.keys(updatedKeyMap).forEach(keyInLatestObject => {
      const valueInUpdatedKeymap = updatedKeyMap[keyInLatestObject]
      let infoInDefaultObject = isKeyAvailableForThisValue(defaultKeyMap, valueInUpdatedKeymap)
      if (infoInDefaultObject) {
        defaultKeyMap[keyInLatestObject] = valueInUpdatedKeymap
        delete defaultKeyMap[infoInDefaultObject]
      } else {
        defaultKeyMap[keyInLatestObject] = valueInUpdatedKeymap
      }
    })
    function isKeyAvailableForThisValue(defaultKeyMap, value) {
      let defaultEntryForTheKey = Object.keys(defaultKeyMap).filter(keyInDefaultKeyMap => {
        const valueInDefaultObject = defaultKeyMap[keyInDefaultKeyMap]
        return value === valueInDefaultObject
      })
      return defaultEntryForTheKey.length ? defaultEntryForTheKey[0] : undefined
    }
    return defaultKeyMap
  },
}
