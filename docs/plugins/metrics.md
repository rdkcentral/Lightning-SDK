# Metrics

It is important to know how people use Apps. We can acquire this information by keeping track of a range of *metrics* and send these to a backend.

Because each operator might implement these tracking metrics in a different way, the Lightning SDK provides the *Metrics* plugin. This plugin is a *generic* interface for developers, independent of any operator or platform.

> Starting <i>v5.0.0</i> and up, the Metrics plugin is part of the <b>metrological-sdk</b>.<br /><br />For backwards compatibility reasons, the Lightning-SDK exports this plugin provided by the metrological-sdk. The code however is maintained <a href="https://github.com/Metrological/metrological-sdk" target="_blank">here</a>. More information on how to use this plugin can be found <a href="https://github.com/Metrological/metrological-sdk/blob/master/docs/plugins/metrics.md" target="_blank">here</a>.
