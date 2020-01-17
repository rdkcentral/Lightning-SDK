# Getting started

## Lightning-CLI

The easiest way to get up and running with a Lightning App is by installing the _[Lightning CLI](https://github.com/WebPlatformForEmbedded/Lightning-CLI)_ globally on your system.

The Lightning CLI provides a set of development tools, that enable you to:

- quickly create a new blueprint Lightning App
- build and run Lightning Apps in your browser
- upload a new release of your App to the Metrological Backoffice

Install the Lightning-CLI (globally):

```
npm install -g WebPlatformForEmbedded/Lightning-CLI
```

Next the Lightning-CLI will be available as `lng <command> [options]`

## Creating a new Lightning App

The Lightning-SDK expects a certain file and folder structure to work properly.

You can use the Lightning-CLI command `lng create` to interactively scaffold a new project according to a predefined blueprint.

Once a new Lightning App project is created, you have to make sure all it's dependencies are installed (`npm install`). Note that the `create`-command normally does this for you.

Next you can run the `lng build` and `lng serve` commands to build the blueprint App and preview it in a webbrowser.

During development you might prefer using the `lng dev` command, which builds and launches your App, and then keeps watching for changes to automatically rebuild.

Whenever you want to review this documentation, you can run `lng docs` in the root of a project. This will open up the documention for the Lightning-SDK version used in that project.
