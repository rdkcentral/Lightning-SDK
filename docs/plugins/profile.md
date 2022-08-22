# Profile

Occasionally, your App requires profile information about the current user. This information is usually provided by the operator or platform.

Because each operator or platform might implement user profile information in a different way, the Lightning SDK provides the *Profile* plugin. This plugin is a generic interface for developers, independent of any operator or platform.

You can also use the Profile plugin to *update* profile information.

> Starting <i>v5.0.0</i> and up, the Profile plugin is part of the <b>metrological-sdk</b>.<br /><br />For backwards compatibility reasons, the Lightning-SDK exports this plugin provided by the metrological-sdk. The code however is maintained <a href="https://github.com/Metrological/metrological-sdk" target="_blank">here</a>. More information on how to use this plugin can be found <a href="https://github.com/Metrological/metrological-sdk/blob/master/docs/plugins/profile.md" target="_blank">here</a>.
