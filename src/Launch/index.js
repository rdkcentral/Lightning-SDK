import { initUtils } from '../Utils'
import { initProfile } from '../Profile'
import { initMetrics } from '../Metrics'
import Application from '../Application'

export default (App, appSettings, platformSettings, appData) => {
  initUtils(platformSettings)

  // Initialize plugins
  if (platformSettings.plugins) {
    platformSettings.plugins.profile && initProfile(platformSettings.plugins.profile)
    platformSettings.plugins.metrics && initMetrics(platformSettings.plugins.metrics)
  }

  const app = Application(App, appData)
  return new app(appSettings)
}
