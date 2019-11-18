import Utils from '../Utils'
import Application from '../Application'

export default (App, appSettings, platformSettings) => {
    
    Utils.setPath(platformSettings.path)
    // todo
    // platformSettings.plugins.metrics && Metrics.init(environment.plugins.metrics)
    
    const app = Application(App)
    return new app(appSettings)
}