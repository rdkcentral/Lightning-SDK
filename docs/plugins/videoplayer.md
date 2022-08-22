# VideoPlayer

A common feature of TV Apps is to play videos.

The *VideoPlayer* plugin offers a convenient interface for interacting with the video player of the STB. You can use it to open and play / pause videos. Additionally, it provides APIs that you can use to, for example, control the size of the video player.

The VideoPlayer plugin has a built-in integration with the [Metrics](metrics.md) plugin. It automatically sends statistics for various [media events](#events) (for example: canplay, play, pause, seeking, seeked).

> Although it is possible to implement a fully custom video playback solution, the use of the VideoPlayer plugin from
the SDK is highly recommended.

> Starting <i>v5.0.0</i> and up, the VideoPlayer plugin is part of the <b>metrological-sdk</b>.<br /><br />For backwards compatibility reasons, the Lightning-SDK exports this plugin provided by the metrological-sdk. The code however is maintained by <a href="https://github.com/Metrological/metrological-sdk" target="_blank">here</a>. More information on how to use this plugin can be found <a href="https://github.com/Metrological/metrological-sdk/blob/master/docs/plugins/videoplayer.md" target="_blank">here</a>.
