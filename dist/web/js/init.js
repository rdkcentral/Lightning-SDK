function startApp() {
    var useInterval = ux.Ui.getOption("useInterval");
    if (useInterval) {
        console.log('use interval instead of request animation frame');

        var interval = parseInt(useInterval);

        // Work-around for requestAnimationFrame bug.
        var lastFrameTime = 0;
        window.requestAnimationFrame = function(callback) {
            var currentTime = Date.now();
            var targetTime = Math.max(lastFrameTime + interval, currentTime);

            return window.setTimeout(function() {
                lastFrameTime = Date.now();
                callback();
            }, targetTime - currentTime);
        };
    }

    var navigationKeys = {
        8: "Back",
        13: "Enter",
        27: "Back",
        10009: "Back",
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

    const memoryPressure = parseInt(ux.Ui.getOption('memoryPressure')) || 16e6;
    console.log('GPU memory pressure: ' + memoryPressure);

    var options = {
        stage: {
            w: 1920,
            h: 1080,
            clearColor: ux.Ui.getOption('transparentBg') === "0" ? 0xFF000000 : 0x00000000,
            defaultFontFace: 'RobotoRegular',
            memoryPressure: memoryPressure,
            canvas2d: ux.Ui.hasOption('c2d')
        }, debug: false, keys: navigationKeys
    };

    const config = options.stage;
    if (ux.Ui.hasOption("720") || window.innerHeight === 720) {
        config['w'] = 1280;
        config['h'] = 720;
        config['precision'] = 0.6666666667;
    } else {
        config['w'] = 1920;
        config['h'] = 1080;
    }

    config.useImageWorker = ux.Ui.getOption('useImageWorker') !== "0";

    try {
        var bootstrap = new ux.Ui(options);
        bootstrap.startApp(appBundle);
    } catch (e) {
        alert("error " + e)
    }

    var canvas = bootstrap.stage.getCanvas();
    document.body.appendChild(canvas);

    window.app = bootstrap;
}

function isSupportingES6() {
    "use strict";

    var features = [
        "const foo = (test = 1) => {};",
        "class Temp {get a() {return 1;}}; class Temp2 extends Temp {get b() {return 2;}};",
        "const template = `bka ${1}\n${2}`;",
        "let t = 1;",
        "const data = {a: 1, n: 2}; const {a, b} = data;",
        "const c = 1; const data2 = {c};",
        "const obj1 = {a: 1}; const obj2 = {b:1, ...obj1};"
    ];
    try {
        eval(features.join(" "));
        return true;
    } catch(e) {
        console.log('No ES6 support, fallback to babelified version.');
        return false;
    }
}

function loadScript(src) {
    return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.onload = function() {
            resolve();
        };
        script.onerror = function(e) {
            reject(new Error("Script load error for " + src + ": " + e));
        };
        script.src = src;
        document.head.appendChild(script);
    });
}


// Fetch app store to ensure that proxy/image servers firewall is opened.
fetch('http://widgets.metrological.com/metrological/nl/test').then(function(){
});

const supportsEs6 = isSupportingES6();
const folder = supportsEs6 ? "src" : "src.es5";
function loadJsFile(filename) {
    return loadScript("js/" + folder + "/" + filename);
}

const loadPolyfill = supportsEs6 ? Promise.resolve() : loadScript("js/polyfills/babel-polyfill-6.23.0.js");

loadPolyfill.then(function() {
    return loadJsFile("lightning.js").then(function() {
        return loadJsFile("ux.js").then(function() {
            return Promise.all([
                loadJsFile("appBundle.js")
            ]);
        });
    });
}).catch(function(e) {
    console.error(e);
}).then(function() {
    startApp();
});