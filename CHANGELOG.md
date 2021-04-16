# Changelog

## v4.x.x

- Router updates
    - Added `afterEachRoute` hook
    - Added support to hook into route error
    - Added `bootComponent` as special route
    - Added `location.search` to query params object
    - Added query parameters to page `params()`
    - Added named navigation to the docs
    - Fixed reload of special routes, reload will now return to `root` page
    - Fixed trying to navigate to `Error` component while it's not configured
    - Fixed navigating to `bootComponent` hash directly
    - Fixed `bootComponent` now showing before `bootRequest`
    - Fixed always adding `request` object in queue

## v4.2.2

*6 april 2021*

- Fixed hashchange event listener only for routed apps
- Fixed referece to app id in closing sequence startApp.js

## v4.2.1

*9 march 2021*

- Fixed Router `navigate()` always adding new queue entry

## v4.2.0

*9 march 2021*

- Router updates
    - Root function can now resolve object
    - Fixed `preventStorage` setting
    - Fixed page cache
    - `location.hash` now gets set on `hashchange` disabled
    - Added support to prevent auto widget focus restore
    - Added `afterEachRoute()` support
    - Improved error notification
    - Exposed internal Symbols mapping
- Added Metadata plugin
- Added Colors plugin
- Added `loader` and `unloader` functionality to the VideoPlayer plugin

## v4.1.1

*3 march 2021*

- Fixed bug in Registry plugin (removing interval from reference list after first invocation)

## v4.1.0

*26 jan 2021*

- Added Purchase plugin

## v4.0.0

*22 jan 2021*

- Removed deprecated Image plugin methods
- Fixed Storage plugin to compile with webpack and esbuild
- Added support for experimental esbuild support
- Router Plugin refactor
  - Breaking changes
    - `page.dynamicRouteProperty = hashValue;` is no longer being set, now use `_onUrlParams(args)`. In the previous release on route: `home/browse/:section` and a `navigate()` to: `home/browse/adventure` the Router would set the page prop `page['section'] = 'adventure'` but this could lead to unwanted and error prone behaviour. This undocumented feature has now been removed.
  - New features
    - Added test Router.isNavigating()
    - Added Router history interaction
    - Added Router.getHistory()
    - Added Router.replaceHistoryState()
    - Added Router.getHistoryState()
    - Added hash reload support
    - Added named navigation support
    - Added error handling in bootRequest
  - Fixes
    - Fixed Page overlap when on navigate starts before transition finish
    - Fixed _onActivated() widget event documentation
    - Fixed navigating to same hash when navigating
    - Deprecated Router.setupRoutes() - method
  - Deprecations
    - Deprecated calling on() | before() | after() directly - data providers must be defined in route object: https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/dataproviding
    - Deprecated duplicate route definitions
- Removed SDK namespace replacement functionality from postinstall script

## v3.2.1

*14 dec 2020*

- Updated LocalCookie dependency to v1.1.1 (fixes persistance of cookies beyond browser session)

## v3.2.0

*20 nov 2020*

- Added _clear_ event to VideoPlayer plugin (`$videoPlayerClear`)
- Added _timestamp_ as parameter to VideoPlayer plugin events
- Fixed calculation of precision in VideoPlayer plugin, when no AppInstance is defined
- Fixed loading of language files for Language Plugin
- Fixed namespacing in Storage Plugin

## v3.1.1

*6 nov 2020*

- Added warning to postinstall script do manual upgrade of the Lightning-SDK when a mismatch in package names is detected
- Added _changelog_ and _current package version_ to the documentation

## v3.1.0

*30 oct 2020*

- Added option to pass arguments to platform `onClose`-method
- Added temporary workaround in postinstall script for npm 7.0.*-bug
- Added `get()` method to Language-plugin
- Added deprecation warnings to Locale plugin and MediaPlayer plugin
- Replaced `finally` with `then` in `startApp.js` (for better compatibility)
- Router updates
  - Added global `beforeEachRoute` hook
  - Added support for local `beforeNavigate` hook
  - Added support for URN
  - Fixed properly resolve request on shared page instances

## v3.0.0

*14 oct 2020*

Breaking changes
- Changed package name from `wpe-lightning-sdk` to `@lightningjs/sdk` (and published on NPM)
- Updated minimum requirement to Node.js 10

New features
- Added Registry Plugin
- Added VideoPlayer plugin
- Added Language Plugin
- Router
  - Fixed async loading behaviour that could result in stacked pages
  - Router internally now uses unique Symbols (could break if Symbol.for('route') is used in app)
  - Added Page view statistics
  - Wildcard routes not ending up in history
  - Add reuseInstance flag global and per route
  - Support for Dynamic component import
  - Widgets always hidden on Router boot
  - Documented _handleAppClose()

Deprecations
- Locale plugin is deprecated in favor of the Language plugin
- MediaPlayer plugin is deprecated in favor of the VideoPlayer plugin

## v2.6.0

*11 sep 2020*

- Added Pin Plugin
- Added zipCode to profile

## v2.5.0

*21 aug 2020*

- Added fallback value to `Settings.get()`
- Added access to AppData
- Removed black body background during development
- Added proper App-cleanup on close during development
- Various Router updates
  - support for querystring parameters
  - support for function as a value for `root` in router config
  - support for navigation without a hash update
  - fixes:
    - static routes take priority over dynamic matches (`settings/account` vs `settings/:type`)
    - remain focus on an active widget after an `on()`-resolve
- Added new TV plugin

## v2.4.0

*14 jul 2020*

- Added `image.quality` platform setting to tune down the image quality on STB's with lower GPU memory
- Added _Router_ plugin to SDK

## v2.3.1

*8 jul 2020*

- Added fix to MediaPlayer plugin to solve issue of video rollover (black screen on certain STBs)
- Added fix to MediaPlayer plugin to solve issue when opening same video asset twice (black screen)
- Added fix to Profile plugin to solve issue with always requesting the browser location (also in production)

## v2.3.0

*24 jun 2020*

- Added support for user defined Settings
- Added fetch polyfill for older ES5 environments
- Added SDK version to be displayed in Version-label (requires Lightning-CLI 1.6.1 and higher)
- Added fix for setting texture mode in `settings.json`

## v2.2.2

*4 jun 2020*

- Added fallback language (en) to Locale plugin when given language doesn't exist

## v2.2.1

*1 jun 2020*

- Hotfix for Media Player metrics

## v2.2.0

*6 may 2020*

- Removed close metric from App (is now handled by the Metrological App Store)
- Added default values for Profile plugin during local development, including the option to customize values via `settings.json`
- Added Frame per second (FPS) counter
- Fixed bug in the asset path of the Utils plugin when running the lightning App from a nested URL
- Improved documentation
- Cleaned up NPM dependencies and separated dev dependencies
- Removed legacy npm scripts
- Moved ES5-polyfills to external dependencies

## v2.1.0

*19 mar 2020*

- Fixed small issues in documentation
- Changed import of Lightning to enable IDE autocompletion (requires Lightning-CLI 1.4.0)

## v2.0.3

*17 feb 2020*

- Fixed issue with `Img.portrait()` method not returning a texture
