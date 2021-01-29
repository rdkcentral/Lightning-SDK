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

import { initAdsHandler } from '../Advertising/adsHandler'
import { initEvents } from '../Events'
import { initLifecycle } from '../Lifecycle'
import { initMetrics } from '../Metrics'
import { initMediaPlayer } from '../MediaPlayer'
import { initProfile } from '../Profile'
import { initPlatform } from '../Platform'
import { initRouter } from '../Router'
import { initSettings } from '../Settings'
import { initStorage } from '../Storage'
import { initTV } from '../TV'
import { initUtils } from '../Utils'
import { initVideoPlayer } from '../VideoPlayer'

import Application from '../Application'
import isProbablyLightningComponent from '../helpers/isProbablyLightningComponent'

export let ApplicationInstance

export default (App, appSettings, platformSettings, appData) => {
  initLifecycle(App, platformSettings)
  initSettings(appSettings, platformSettings)
  initUtils(platformSettings)
  initStorage()

  // Initialize plugins
  if (platformSettings.plugins) {
    platformSettings.plugins.profile && initProfile(platformSettings.plugins.profile)
    platformSettings.plugins.platform && initPlatform(platformSettings.plugins.platform)
    platformSettings.plugins.metrics && initMetrics(platformSettings.plugins.metrics)
    platformSettings.plugins.mediaPlayer && initMediaPlayer(platformSettings.plugins.mediaPlayer)
    platformSettings.plugins.mediaPlayer && initVideoPlayer(platformSettings.plugins.mediaPlayer)
    platformSettings.plugins.ads && initAdsHandler(platformSettings.plugins.ads)
    platformSettings.plugins.router && initRouter(platformSettings.plugins.router)
    platformSettings.plugins.tv && initTV(platformSettings.plugins.tv)
    platformSettings.plugins.events && initEvents(platformSettings.plugins.events)
  }

  if (isProbablyLightningComponent(App)) {
    const app = Application(App, appData, platformSettings)
    ApplicationInstance = new app(appSettings)
    return ApplicationInstance
  } else {
    if (typeof App === 'function') {
      return App()
    } else {
      console.error('Expecting `App` to be a callback function or a Lightning Component')
    }
  }
}
