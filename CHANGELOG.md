# Changelog

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
