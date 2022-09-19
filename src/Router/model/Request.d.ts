/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2022 Metrological
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

import Router from "../index.js";
import Route, { RouteProvider } from "./Route.js";

export default class Request {
  /**
   * Constructor
   *
   * @param hash
   * @param navArgs
   * @param storeCaller
   */
  constructor(hash?: string, navArgs?: Router.NavigateArgs, storeCaller?: boolean);

  /**
   * Cancel the request
   */
  cancel(): void;

  /**
   * Alias of {@link hash}
   */
  get url(): string;

  get register(): Map<string, unknown>;

  /**
   * Hash of the request
   */
  get hash(): string;
  set hash(args: string);

  /**
   * The route of the request
   */
  get route(): Route | undefined;
  set route(args: Route | undefined);

  /**
   * The data provider method of the request
   */
  get provider(): RouteProvider['request'] | undefined;
  set provider(args: RouteProvider['request'] | undefined);

  /**
   * Gets the data provider type of the request
   */
  get providerType(): RouteProvider['type'] | undefined;

  /**
   * Sets the data provider type of the request
   */
  set providerType(args: RouteProvider['type'] | undefined);

  /**
   * Sets the page of the request
   */
  set page(args: Router.PageConstructor | undefined);

  /**
   * Gets the page of the request
   */
  get page(): Router.PageConstructor | undefined;

  /**
   * Flag if the instance is created due to this request
   *
   * @param args
   */
  set isCreated(args: boolean);
  get isCreated(): boolean;

  /**
   * Flag if the instance is shared between previous and current request
   */
  get isSharedInstance(): boolean;
  set isSharedInstance(args: boolean);

  /**
   * Flag if the request has been cancelled
   */
  get isCancelled(): boolean;

  /**
   * If instance is shared between requests we copy the state object
   * from instance before the new request overrides state
   */
  get copiedHistoryState(): Router.HistoryState | null;
  set copiedHistoryState(v: Router.HistoryState | null);
}
