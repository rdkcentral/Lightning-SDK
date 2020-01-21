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
