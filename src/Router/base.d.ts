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
import { Lightning } from "../../index.js";

declare namespace RoutedApp {
  export interface TemplateSpec extends Lightning.Component.TemplateSpecStrong {
    // Provided empty for consistent convention and to to allow augmentation
    Pages: {},
    Loading: {
      Label: {}
    },
    Widgets: {}
  }

  export interface TemplateSpecLoose extends TemplateSpec {
    [s: string]: any
  }

  export interface EventMap extends Lightning.Component.EventMap {
    // Provided empty for consistent convention and to to allow augmentation
  }

  export interface SignalMap extends Lightning.Component.SignalMap {
    // Provided empty for consistent convention and to to allow augmentation
  }

  export interface TypeConfig extends Lightning.Component.TypeConfig {
    IsPage: false;
    EventMapType: EventMap;
    SignalMaptype: SignalMap;
  }
}

declare class RoutedApp<
  TemplateSpecType extends RoutedApp.TemplateSpecLoose = RoutedApp.TemplateSpecLoose,
  TypeConfigType extends RoutedApp.TypeConfig = RoutedApp.TypeConfig
> extends Lightning.Component<
  TemplateSpecType,
  TypeConfigType
> {
  /**
   * Gets the Pages host element
   */
  get pages(): Lightning.Element;

  /**
   * Gets the Widgets host element
   */
  // @ts-ignore
  get widgets(): Lightning.Element | undefined;

  /**
   * Implementable method that overrides the default bevhavior for when a user navigates back
   * while the history stack is empty.
   *
   * @remarks
   * Normally when the user navigates Back while the history stack is empty, the Router closes the app.
   * If this method is implemented, the Router will not do that and instead it will execute this method.
   *
   * See [Router Events - _handleAppClose](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/events?id=_handleappclose)
   * for more information.
   */
  _handleAppClose?(): void;
}

export { RoutedApp }
