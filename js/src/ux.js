// Exposes the ux namespace for apps.

import Ui from "./Ui.js";
import App from "./App.js";

import tools from "./tools/tools.js";

const ux = {
    Ui,
    App,
    tools
};

if (typeof window !== "undefined") {
    window.ux = ux;
}

export default ux;