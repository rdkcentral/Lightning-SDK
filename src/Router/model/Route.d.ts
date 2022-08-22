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

import Router from "..";

export interface RouteProvider {
  type: 'on' | 'before' | 'after';
  request(page: Router.PageInstance, params: Router.PageParams): Promise<void>;
}

export default class Route implements Router.RouteDefinition {
  constructor(config?: Router.RouteDefinition);

  get path(): Router.RouteDefinition['path'];

  get component(): Router.RouteDefinition['component'];

  get options(): Router.RouteDefinition['options'];

  get widgets(): Router.RouteDefinition['widgets'];

  get cache(): Router.RouteDefinition['cache'];

  get hook(): Router.RouteDefinition['hook'];

  get beforeNavigate(): Router.RouteDefinition['beforeNavigate'];

  get provider(): RouteProvider | undefined;
}
