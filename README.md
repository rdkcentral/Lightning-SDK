# Lightning SDK

This SDK allows you to build Lightning-based apps. It contains [Lightning](https://github.com/WebPlatformForEmbedded/Lightning)
and a Mediaplayer and other specific utitilies for app development.

# Installation
First, create a new directory to develop your app in. 

Add a new package.json for your project:

```
{
  "author": "Metrological",
  "name": "your-app",
  "version": "1.0.0"
}
```

Run `npm i https://github.com/WebPlatformForEmbedded/Lightning-SDK.git --save`

Your application is expected to be in `src/App.js`, and it *must* extend ux.App:

```
class MyApp extends ux.App {
}
```

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

## Building
Releasing your app can be done using a couple of scripts in this package.
It may be handy to include these as shorthands in your app's package.json file:
```
"scripts": {
    "release-web": "node ./node_modules/wpe-lightning-sdk/scripts/release-web.js",
    "release-mpkg": "node ./node_modules/wpe-lightning-sdk/scripts/release-mpkg.js",
    "upload-app": "node ./node_modules/wpe-lightning-sdk/scripts/upload-app-metrological.js"
}
```

### Standalone web version
Run the `scripts/release-web.js` script from your application directory. It will create the dist/web folder that includes your
bundled app and a set of files that allow running it on ES6 and ES5 supporting browsers. Simply place it on a web server
and navigate to the index.html file and it should work.

### Metrological package.
Run the `scripts/release-mpkg.js` script from your application directory. It expects a *metadata.json* file containing 
configuration specific to the Metrological framework.

### Metrological upload.
Run the `scripts/upload-app-metrological.js` script from your application directory, this will run the package script as
stated above and upload the package to the Metrological dashboard. You need to provide an Api key as argument: 
 `npm run upload-app *api-key*`

### Example

Check [Lightning-examples](https://github.com/WebPlatformForEmbedded/Lightning-examples) for an example of a working
application development setup using this SDK.