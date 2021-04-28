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

let entitlements = function(entitlements) {
  return Transport.send('discovery', 'entitlements', { entitlements: entitlements })
}

let watched = function(watchedItems) {
  return Transport.send('discovery', 'watched', { watchedItems: watchedItems })
}

let watchNext = function(title, linkUrl, expires, contentId, images) {
  return Transport.send('discovery', 'watchNext', {
    title: title,
    linkUrl: linkUrl,
    expires: expires,
    contentId: contentId,
    images: images,
  })
}

export default {
  entitlements: entitlements,
  watched: watched,
  watchNext: watchNext,
}
