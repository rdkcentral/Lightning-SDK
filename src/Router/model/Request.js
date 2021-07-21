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

import { isBoolean, isObject, symbols } from '../utils/helpers'
import { createRegister } from '../utils/register'
import Log from '../../Log'

export default class Request {
  constructor(hash = '', navArgs, storeCaller) {
    /**
     * Hash we navigate to
     * @type {string}
     * @private
     */
    this._hash = hash

    /**
     * Do we store previous hash in history
     * @type {boolean}
     * @private
     */
    this._storeCaller = storeCaller

    /**
     * Request and navigate data
     * @type {Map}
     * @private
     */
    this._register = new Map()

    /**
     * Flag if the instance is created due to
     * this request
     * @type {boolean}
     * @private
     */
    this._isCreated = false

    /**
     * Flag if the instance is shared between
     * previous and current request
     * @type {boolean}
     * @private
     */
    this._isSharedInstance = false

    /**
     * Flag if the request has been cancelled
     * @type {boolean}
     * @private
     */
    this._cancelled = false

    /**
     * if instance is shared between requests we copy state object
     * from instance before the new request overrides state
     * @type {null}
     * @private
     */
    this._copiedHistoryState = null

    // if there are arguments attached to navigate()
    // we store them in new request
    if (isObject(navArgs)) {
      this._register = createRegister(navArgs)
    } else if (isBoolean(navArgs)) {
      // if second navigate() argument is explicitly
      // set to false we prevent the calling page
      // from ending up in history
      this._storeCaller = navArgs
    }
    // @todo: remove because we can simply check
    // ._storeCaller property
    this._register.set(symbols.store, this._storeCaller)
  }

  cancel() {
    Log.debug('[router]:', `cancelled ${this._hash}`)
    this._cancelled = true
  }

  get url() {
    return this._hash
  }

  get register() {
    return this._register
  }

  get hash() {
    return this._hash
  }

  set hash(args) {
    this._hash = args
  }

  get route() {
    return this._route
  }

  set route(args) {
    this._route = args
  }

  get provider() {
    return this._provider
  }

  set provider(args) {
    this._provider = args
  }

  get providerType() {
    return this._providerType
  }

  set providerType(args) {
    this._providerType = args
  }

  set page(args) {
    this._page = args
  }

  get page() {
    return this._page
  }

  set isCreated(args) {
    this._isCreated = args
  }

  get isCreated() {
    return this._isCreated
  }

  get isSharedInstance() {
    return this._isSharedInstance
  }

  set isSharedInstance(args) {
    this._isSharedInstance = args
  }

  get isCancelled() {
    return this._cancelled
  }

  set copiedHistoryState(v) {
    this._copiedHistoryState = v
  }

  get copiedHistoryState() {
    return this._copiedHistoryState
  }
}
