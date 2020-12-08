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

export const hasRegex = /\{\/(.*?)\/([igm]{0,3})\}/g
export const isWildcard = /^[!*$]$/
export const hasLookupId = /\/:\w+?@@([0-9]+?)@@/
export const isNamedGroup = /^\/:/

/**
 * Test if a route is part regular expressed
 * and replace it for a simple character
 * @param route
 * @returns {*}
 */
export const stripRegex = (route, char = 'R') => {
  // if route is part regular expressed we replace
  // the regular expression for a character to
  // simplify floor calculation and backtracking
  if (hasRegex.test(route)) {
    route = route.replace(hasRegex, char)
  }
  return route
}
