# Lightning-sdk

SDK for building apps for the Lightning framework UX

## Building app distribution

Create a new repository and add Lightning-sdk as a dependency.
Add an AppDefinition.js file and an index.html with the following contents:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <script src="node_modules/wpe-lightning-sdk/node_modules/wpe-lightning/devtools/lightning-inspect.js"></script>
</head>
<body>
<script type="module">
    import DevLauncher from "./node_modules/wpe-lightning-sdk/DevLauncher.js";
    import AppDefinition from "./AppDefinition.js";

    /* Attach the inspector to create a fake DOM that shows where lightning elements can be found. */
    // attachInspector(lng);

    const launcher = new DevLauncher();
    launcher.launch(AppDefinition, {}, {useInspector: false})
</script>
</body>
</html>
```

Check [Lightning-examples](https://github.com/WebPlatformForEmbedded/Lightning-examples) for an example.