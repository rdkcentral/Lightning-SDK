import DevLauncher from './DevLauncher.mjs';
import App from "./src/app.mjs";

const launcher = new DevLauncher();
launcher.launch(App, {debug:false}, {useInspector: false});
