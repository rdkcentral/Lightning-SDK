import lng from "./node_modules/wpe-lightning/src/lightning.mjs";
import ux from "./js/src/ux.js";

export default class DevLauncher {

    launch(appType, lightningOptions, options = {}) {
        this._appType = appType;
        this._start(lightningOptions);
    }

    _start(options = {}) {
        this._addStyles();
        this._openFirewall();
        this._lightningOptions = this._getLightningOptions(options.lightningOptions);
        this._startApp();
    }

    _startApp() {
        const bootstrap = new ux.Ui(this._lightningOptions);
        bootstrap.startApp(this._appType);
        const canvas = bootstrap.stage.getCanvas();
        document.body.appendChild(canvas);
        window.ui = bootstrap;
    }

    _addStyles() {
        const style = document.createElement('style');
        style.innerText = `
*,body{
    margin:0;
    padding:0;
}

canvas {
    position: absolute;
    z-index: 2;
}

body {
    background: black;
}`;
        document.head.appendChild(style);
    }

    _openFirewall() {
        // Fetch app store to ensure that proxy/image servers firewall is opened.
        fetch(`http://widgets.metrological.com/${encodeURIComponent(ux.Ui.getOption('operator') || 'metrological')}/nl/test`).then(() => {});
    }

    _getLightningOptions(customOptions = {}) {
        let options = {stage: {w: 1920, h: 1080, clearColor: 0x00000000, canvas2d: false}, debug: false, keys: this._getNavigationKeys()};

        const config = options.stage;
        if (ux.Ui.hasOption("720") || window.innerHeight === 720) {
            config['w'] = 1280;
            config['h'] = 720;
            config['precision'] = 0.6666666667;
        } else {
            config['w'] = 1920;
            config['h'] = 1080;

            config.useImageWorker = true;
        }

        options = lng.tools.ObjMerger.merge(options, customOptions);

        return options;
    }

    _getNavigationKeys() {
        return {
            8: "Back",
            13: "Enter",
            27: "Menu",
            37: "Left",
            38: "Up",
            39: "Right",
            40: "Down",
            174: "ChannelDown",
            175: "ChannelUp",
            178: "Stop",
            250: "PlayPause",
            191: "Search", // Use "/" for keyboard
            409: "Search"
        };
    }

}