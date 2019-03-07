import DevLauncher from './DevLauncher.mjs';
import App from "./js/src/app.mjs";

const launcher = new DevLauncher();
launcher.launch(App, {debug:false}, {useInspector: false});
