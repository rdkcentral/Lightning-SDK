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

import Log from '../Log'

export let events = {
  navigateTo: {
    action: 'entity',
    data: {
      entityId: 'abc',
    },
    context: {
      source: 'voice',
    },
  },
}

export default {
  watched: function(params) {
    let watchedItems = params.watchedItems
    if (watchedItems && watchedItems.isArray && watchedItems.isArray())
      watchedItems.reduce((items, item) => {
        Log.info('Discovery', 'Added ' + item.watchedOn + ': ' + item.contentId)
      })
    else if (typeof watchedItems === 'object')
      Log.info('Discovery', 'Added ' + watchedItems.watchedOn + ': ' + watchedItems.contentId)

    return true
  },
  watchNext: function(params) {
    let title = params.title
    let linkUrl = params.linkUrl
    let expires = params.expires
    let contentId = params.contentId
    let images = params.images
    Log.info('Discovery', 'Added to Dashboard: ' + title + ', ' + linkUrl)
    return true
  },
  entitlements: function(params) {
    let entitlments = params.entitlements
    Log.info('Discovery', 'Synchronized user entitlements')
    return true
  },
}
