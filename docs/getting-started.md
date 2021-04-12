# Getting started

## Firebolt SDK in NPM

The easiest way to get up and running with a Firebolt App is by adding the Firebolt SDK as a NPM dependency in your app.

You can do this by cloning the `feature/firebolt` branch of the LightningSDK, found here:

[rdkcentral/LightningSDK/feature/firebolt](https://github.com/rdkcentral/Lightning-SDK/tree/feature/firebolt)

then go into the directory and enter `npm link` to make the SDK available to other projects.

Once this is done you can import the SDK into your project by changing to your project's directory and entering `npm link @fireboltjs/sdk`

Now you can use JavaScript `import` syntax to import needed Firebolt modules into your code.
