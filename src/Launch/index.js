import { initUtils } from '../Utils'
import { initProfile } from '../Profile'
import Application from '../Application'

export default (App, appSettings, platformSettings, appData) => {
  initUtils(platformSettings)

  // Initialize plugin profile
  if (platformSettings.plugins) {
    platformSettings.plugins.profile && initProfile(platformSettings.plugins.profile)
  }

  const app = Application(App, appData)
  return new app(appSettings)
}
