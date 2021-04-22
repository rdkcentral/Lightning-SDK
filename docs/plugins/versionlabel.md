# VersionLabel

During debugging and QA, it is important to know the *exact* version of the App that is being tested.

The SDK contains a built-in *VersionLabel* which can be enabled or disabled via the [Platform Setting ](settings.md#platform-settings)`showVersion` in **settings.json**.

If `showVersion` is enabled, a subtle label containing the App version (as specified in **metadata.json**) and the Lightning SDK version is displayed as an overlay in the bottom right corner of the App.
