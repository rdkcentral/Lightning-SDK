import { initUtils } from '../Utils'
import { initProfile } from '../Profile'
import { initMetrics } from '../Metrics'
import { initSettings } from '../Settings'
import Application from '../Application'

export default (App, appSettings, platformSettings, appData) => {
  initSettings(appSettings, platformSettings)

  initUtils(platformSettings)

  // Initialize plugins
  if (platformSettings.plugins) {
    platformSettings.plugins.profile && initProfile(platformSettings.plugins.profile)
    platformSettings.plugins.metrics && initMetrics(platformSettings.plugins.metrics)
  }

  const app = Application(App, appData)
  return new app(appSettings)
}
