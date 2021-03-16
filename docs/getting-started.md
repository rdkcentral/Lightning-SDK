# Getting started

## Lightning-CLI

The easiest way to get up and running with a Lightning App is by installing the _[Lightning CLI](https://github.com/rdkcentral/Lightning-CLI)_ globally on your system.

The Lightning CLI provides a set of development tools, that enable you to:

- quickly create a new blueprint Lightning App
- build and run Lightning Apps in your browser
- upload a new release of your App to the Metrological Backoffice

Install the Lightning-CLI (globally):

```
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

Lightning application can setup the fonts used across the application by implementing getFonts() method inside Application main component and returning the array of fonts to be used.

Example:

```js
    getFonts() {
        return [
            {family: 'Roboto', url: Utils.asset('fonts/Roboto-Regular.ttf'), descriptors: {}},
            {family: 'Roboto', url: Utils.asset('fonts/Roboto-Bold.ttf'), descriptors: {weight: 'bold'}}
        ]
    }

```
We can also setup the fallback font files in case if the provided primary font files are not available. This can be done by providing the array of fonts for each family.

Example:

```js
{
    family: 'ChunkFive',
    urls: [
        Utils.asset('fonts/ChunkFivePrint.ttf'),
        Utils.asset('fonts/Pacifico.ttf'),
        Utils.asset('fonts/GreatVibes-Regular.ttf'),
        ],
    descriptors: { weight: 'bold' }
},
```
In the above example,

* *ChunkFivePrint.ttf* will be loaded, if it is available.
* *Pacifico.ttf* will be loaded, if *ChunkFivePrint.ttf* is not available.
* *GreatVibes-Regular.ttf* will be loaded, if both *ChunkFivePrint.ttf* & *Pacifico.ttf* are not available.


