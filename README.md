# Lightning SDK

This SDK allows you to build Lightning-based apps. It contains [Lightning](https://github.com/WebPlatformForEmbedded/Lightning)
and a Mediaplayer and other specific utitilies for app development.

## Installation

Don't install this repository on its own; you should instead add a dependency in your application code. 


## Usage 
Add an index.html file. Import the DevLauncher from the SDK, and use it to launch your application for development 
purposes. Example index.html:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
</head>
<body>
<script type="module">
    import DevLauncher from "./node_modules/wpe-lightning-sdk/DevLauncher.js";
    import App from "./src/App.js";

    const launcher = new DevLauncher();
    launcher.launch(App, {debug: true}, {useInspector: false})
</script>
</body>
</html>
```

Notice that your application is expected to be in `src/App.js`, and it *must* extend ux.App:
```
class MyApp extends ux.App {
}
```

## Building
Releasing your app can be done using a couple of scripts in this package.
It may be handy to include these as shorthands in your app's package.json file:
```
"scripts": {
    "release-web": "node ./node_modules/wpe-lightning-sdk/scripts/release-web.js",
    "release-mpkg": "node ./node_modules/wpe-lightning-sdk/scripts/release-mpkg.js"
}
```

### Standalone web version
Run the `scripts/release-web.js` script from your application directory. It will create the dist/web folder that includes your
bundled app and a set of files that allow running it on ES6 and ES5 supporting browsers. Simply place it on a web server
and navigate to the index.html file and it should work.

### Metrological package.
Run the `scripts/release-mpkg.js` script from your application directory. It expects a *metadata.json* file containing 
configuration specific to the Metrological framework.

### Example

Check [Lightning-examples](https://github.com/WebPlatformForEmbedded/Lightning-examples) for an example of a working
application development setup using this SDK.