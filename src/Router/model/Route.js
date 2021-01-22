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

import { isFunction } from '../utils/helpers'

export default class Route {
  constructor(config = {}) {
    // keep backwards compatible
    let type = ['on', 'before', 'after'].reduce((acc, type) => {
      return isFunction(config[type]) ? type : acc
    }, undefined)

    this._cfg = config
    if (type) {
      this._provider = {
        type,
        request: config[type],
      }
    }
  }

  get path() {
    return this._cfg.path
  }

  get component() {
    return this._cfg.component
  }

  get options() {
    return this._cfg.options
  }

  get widgets() {
    return this._cfg.widgets
  }

  get cache() {
    return this._cfg.cache
  }

  get hook() {
    return this._cfg.hook
  }

  get beforeNavigate() {
    return this._cfg.beforeNavigate
  }

  get provider() {
    return this._provider
  }
}
