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
import { AppData, Lightning, PlatformSettings } from "../../index.js";

/**
 * Application Instance (after `Launch()` is called)
 */
export let ApplicationInstance: Lightning.Application | undefined;

/**
 * Launch a new Lightning app
 *
 * @param App Application's Top-Level Component (will live as a child of the Root Application instance returned by this)
 * @param appSettings Application Settings
 * @param platformSettings Platform Settings
 * @param appData Custom App Specific Data
 */
export default function (
  App: Lightning.Component.Constructor,
  appSettings: Lightning.Application.Options,
  platformSettings: PlatformSettings,
  appData?: AppData
): Lightning.Application<Lightning.Application.TemplateSpecLoose>;
