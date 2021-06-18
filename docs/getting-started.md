# Getting started

## Lightning-CLI

The easiest way to get up and running with a Lightning App is by installing the _[Lightning CLI](https://github.com/rdkcentral/Lightning-CLI)_ globally on your system.

The Lightning CLI provides a set of development tools, that enable you to:

- quickly create a new blueprint Lightning App
- build and run Lightning Apps in your browser
- upload a new release of your App to the Metrological Backoffice

Install the Lightning-CLI (globally):

```js
npm install -g @lightningjs/cli
```

Next the Lightning-CLI will be available as `lng <command> [options]`

## Creating a new Lightning App

The Lightning-SDK expects a certain file and folder structure to work properly.

You can use the Lightning-CLI command `lng create` to interactively scaffold a new project according to a predefined blueprint.

Once a new Lightning App project is created, you have to make sure all it's dependencies are installed (`npm install`). Note that the `create`-command normally does this for you.

Next you can run the `lng build` and `lng serve` commands to build the blueprint App and preview it in a webbrowser.

During development you might prefer using the `lng dev` command, which builds and launches your App, and then keeps watching for changes to automatically rebuild.

Whenever you want to review this documentation, you can run `lng docs` in the root of a project. This will open up the documention for the Lightning-SDK version used in that project.

## Fonts

Within a Lightning App you can use custom fonts. Custom fonts will automatically be loaded if you implement a `getFonts()` method on the main Application-class (in `App.js`), which returns an array of fonts.

```js
    getFonts() {
        return [
            {family: 'Roboto', url: Utils.asset('fonts/Roboto-Regular.ttf'), descriptors: {}},
            {family: 'Roboto', url: Utils.asset('fonts/Roboto-Bold.ttf'), descriptors: { weight: 'bold' }},
            {family: 'ComicSans', url: Utils.asset('fonts/comi.ttf'), descriptors: { weight: 'bold' }}
        ]
    }
```

Normally you would place fonts inside the `static` folder, and use the `Utils.asset` method to provide the correct reference to the font files.

Optionally it's possible to specify multiple font files for the same font family, as a backup when the primary font file is not available or not supported on the platform, by using the `urls` key and assigning it an array of font files.

```js
{
    family: 'ChunkFive',
    urls: [
        // primary font file
        Utils.asset('fonts/ChunkFivePrint.ttf'),
        // secondary font file if previous not available / supported
        Utils.asset('fonts/ChunkFivePrint.woff'),
        // used if previous not available / supported
        Utils.asset('fonts/Roboto.ttf'),
    ],
    descriptors: {}
},
```
