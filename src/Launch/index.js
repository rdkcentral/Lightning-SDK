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

import { initUtils } from '../Utils'
import { initProfile } from '../Profile'
import { initMetrics } from '../Metrics'
import { initSettings } from '../Settings'
import { initMediaPlayer } from '../MediaPlayer'
import { initStorage } from '../Storage'
import Application from '../Application'

export default (App, appSettings, platformSettings, appData) => {
  initSettings(appSettings, platformSettings)

  initUtils(platformSettings)
  initStorage()

  // Initialize plugins
  if (platformSettings.plugins) {
    platformSettings.plugins.profile && initProfile(platformSettings.plugins.profile)
    platformSettings.plugins.metrics && initMetrics(platformSettings.plugins.metrics)
    platformSettings.plugins.mediaPlayer && initMediaPlayer(platformSettings.plugins.mediaPlayer)
  }

  const app = Application(App, appData, platformSettings)
  return new app(appSettings)
}
