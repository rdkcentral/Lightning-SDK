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

import Log from '../Log'

let entitlements = function(items) {
  return Promise.resolve(true)
}

let watched = function(watchedItems) {
  watchedItems.reduce((items, item) => {
    Log.info('Added ' + watchedItems.watchedOn + ': ' + watchedItems.contentId)
  })
  return Promise.resolve(true)
}

let watchNext = function(title, linkUrl, expires, contentId, images) {
  Log.info('Added to Dashboard: ' + title + ', ' + linkUrl)
  return Promise.resolve(true)
}

export const initDiscovery = config => {
  entitlements = config.entitlements
  watched = config.watched
  watchNext = config.watchNext
}

export default {
  entitlements: entitlements,
  watched: watched,
  watchNext: watchNext,
}
