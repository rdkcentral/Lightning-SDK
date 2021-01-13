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

let getEntitlements = function() {
  return {		
    entitlementId: 'http://entitlements/some/canonical/id',		
    startTime: '2021-01-01T18:25:43.511Z',		
    endTime: '2021-12-31T12:59:59.911Z'		
  },		
  {		
    entitlementId: 'http://entitlements/some/canonical/id2',		
    startTime: '2021-04-23T18:25:43.511Z',		
    endTime: '2022-04-23T18:25:43.511Z'		
  }	
}

let setEntitlements = function() {
  return true;
}

let watched = function(watchedItems) {
  watchedItems.reduce( (items, item) => { Log.info('Added ' + watchedItems.watchedOn + ": " + watchedItems.contentId )})
  return true
}

let dashBoardTile = function(name, imageUrl, linkUrl) {
  Log.info('Added to Dashboard: ' + name + ', ' + imageUrl + ', ' + linkUrl)
}

export const initAdvertising = config => {
  getEntitlements = config.getEntitlements
  setEntitlements = config.setEntitlements
  watched = config.watched
  dashBoardTile = config.dashBoardTile
}

function entitlements(params) {
  if (params) {
    return setEntitlements(params)
  }
  else {
    return getEntitlements()
  }
}

export default {
  entitlements: entitlements,
  watched: watched,
  dashBoardTile: dashBoardTile
}