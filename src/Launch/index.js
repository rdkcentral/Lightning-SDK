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

import { initUtils } from '../Utils'
import { initProfile } from 'metro-sdk'
import { initMetrics } from 'metro-sdk'
import { initSdkPlugin } from 'metro-sdk'
import { initSettings } from '../Settings'
import { initMediaPlayer } from '../MediaPlayer'
import { initVideoPlayer } from '../VideoPlayer'
import { initStorage } from '../Storage'
import { initAds } from '../Ads'
import { initRouter } from '../Router'
import { initTV } from '../TV'
import { initPurchase } from '../Purchase'
import { initPin } from '../Pin'
import { initMetadata } from 'metro-sdk'
import Application from '../Application'
import Settings from '../Settings'
import Log from '../Log'

export let ApplicationInstance

export default (App, appSettings, platformSettings, appData) => {
  initSettings(appSettings, platformSettings)
  initUtils(platformSettings)
  initMetadata(appSettings)
  initStorage()
  // Initialize plugins
  if (platformSettings.plugins) {
    platformSettings.plugins.profile && initProfile(platformSettings.plugins.profile)
    platformSettings.plugins.metrics && initMetrics(platformSettings.plugins.metrics)
    platformSettings.plugins.mediaPlayer && initMediaPlayer(platformSettings.plugins.mediaPlayer)
    platformSettings.plugins.mediaPlayer && initVideoPlayer(platformSettings.plugins.mediaPlayer)
    platformSettings.plugins.ads && initAds(platformSettings.plugins.ads)
    platformSettings.plugins.router && initRouter(platformSettings.plugins.router)
    platformSettings.plugins.tv && initTV(platformSettings.plugins.tv)
    platformSettings.plugins.purchase && initPurchase(platformSettings.plugins.purchase)
    platformSettings.plugins.pin && initPin(platformSettings.plugins.pin)
  }
  const app = Application(App, appData, platformSettings)
  ApplicationInstance = new app(appSettings)
  initSdkPlugin(ApplicationInstance, Log, Settings)
  return ApplicationInstance
}
