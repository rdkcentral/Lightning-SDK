import Utils from '../Utils'
import { initProfile } from '../Profile'
import Application from '../Application'

export default (App, appSettings, platformSettings) => {
    
    Utils.setPath(platformSettings.path)

    // Initialize plugin profile
    platformSettings.plugins.profile && initProfile(platformSettings.plugins.profile)
    
    const app = Application(App)
    return new app(appSettings)
}