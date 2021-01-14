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

let entitlements = function() {
  return Promise.resolve(true);
}

let watched = function(watchedItems) {
  watchedItems.reduce( (items, item) => { Log.info('Added ' + watchedItems.watchedOn + ": " + watchedItems.contentId )})
  return true
}

/*
Params (TODO: move to docs)
  titles - either a String or localized map, e.g.:
  {
    "en-US": "Finish watching \"The Crazy Nasty Honey Badger\"",
    "es": "Terminar de mirar \"The Crazy Nasty Honey Badger\""
  }
  linkUrl - String, e.g. "https://www.youtube.com/watch?v=b8fjxn8Kgg4"
  expires -   ISO8601 Date/Time string, e.g. "2021-01-01T18:25:43.511Z"
  contentId - canonical ID of the content
  images - single url as a string, or a localized map with aspect ratios, e.g.
  {
    "3x4": {
        "en-US": "https://i.ytimg.com/vi/4r7wHMg5Yjg/maxresdefault.jpg",
        "es": "https://i.ytimg.com/vi/4r7wHMg5Yjg/maxresdefault.jpg"
    },
    "16x9": {
        "en": "https://i.ytimg.com/vi/4r7wHMg5Yjg/maxresdefault.jpg"
    }
  }
*/
let watchNext = function(title, linkUrl, expires, contentId, images) {
  Log.info('Added to Dashboard: ' + title + ', ' + linkUrl)
  return Promise.resolve(true)
}

export const initAdvertising = config => {
  entitlements = config.entitlements
  watched = config.watched
  watchNext = config.watchNext
}

export default {
  entitlements: entitlements,
  watched: watched,
  watchNext: watchNext
}