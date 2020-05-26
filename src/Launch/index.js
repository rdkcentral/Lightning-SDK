import { initUtils } from '../Utils'
import { initProfile } from '../Profile'
import { initMetrics } from '../Metrics'
import { initSettings } from '../Settings'
import { initMediaPlayer } from '../MediaPlayer'
import { initStorage } from '../Storage'
import { initAds } from '../Ads'
import Application from '../Application'

export let AppInstance

export default (App, appSettings, platformSettings, appData) => {
  initSettings(appSettings, platformSettings)

  initUtils(platformSettings)
  initStorage()

  // Initialize plugins
  if (platformSettings.plugins) {
    platformSettings.plugins.profile && initProfile(platformSettings.plugins.profile)
    platformSettings.plugins.metrics && initMetrics(platformSettings.plugins.metrics)
    platformSettings.plugins.mediaPlayer && initMediaPlayer(platformSettings.plugins.mediaPlayer)
    platformSettings.plugins.ads && initAds(platformSettings.plugins.ads)
  }

  const app = Application(App, appData, platformSettings)
  AppInstance = new app(appSettings)
  return AppInstance
}
