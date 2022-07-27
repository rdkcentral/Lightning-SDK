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
import { Lightning, PlatformSettings } from '../../index.js';
/**
 * Application's Top-Level Component Instance (after the Root Application class returned
 * by `Application()` is instantiated)
 *
 * @remarks
 * Not be confused with `ApplicationInstance` from `Launch`.
 */
export let AppInstance: Lightning.Application | undefined;

export interface AppData {
  // Provided empty for consistent convention and to to allow augmentation
}

/**
 * Custom App Specific Data
 */
export let AppData: AppData | undefined;

/**
 * Font face
 *
 * @remarks
 * Used for return value of the `getFonts()` static method is called by the SDK from the Application's Top-Level Component.
 *
 * @example
 * ```ts
 * import { Router, FontFace } from '@lightningjs/sdk';
 *
 * export default class App extends Router.App {
 *   static getFonts(): FontFace[] {
 *     return [
 *       {family: 'Light', url: Utils.asset('fonts/Inter-Light.ttf'), descriptors: {}},
 *       {family: 'Regular', url: Utils.asset('fonts/Inter-Regular.ttf'), descriptors: {}},
 *       {family: 'Black', url: Utils.asset('fonts/Inter-Black.ttf'), descriptors: {}},
 *       {family: 'SemiBold', url: Utils.asset('fonts/Inter-SemiBold.ttf'), descriptors: {}},
 *       {family: 'Bold', url: Utils.asset('fonts/Inter-Bold.ttf'), descriptors: {}}
 *     ];
 *   }
 * }
 * ```
 */
export interface FontFace {
  /**
   * Font family
   */
  family: string;
  /**
   * URL to font
   */
  url: string;
  /**
   * Font descriptors
   */
  descriptors?: FontFaceDescriptors;
}

/**
 * Set up Lightning Application
 *
 * @remarks
 * Use {@link Launch} instead to launch a Lightning app.
 *
 * @param App Application's Top-Level Component (will live as a child of the Root Application class returned by this)
 * @param appData Custom App Specific Data
 * @param platformSettings Platform Settings
 */
export default function(
  App: Lightning.Component.Constructor,
  appData: AppData | undefined,
  platformSettings: PlatformSettings
): typeof Lightning.Application<Lightning.Application.TemplateSpecLoose>;
