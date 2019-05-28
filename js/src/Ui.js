import Mediaplayer from "./Mediaplayer.js";
import NoopMediaplayer from "./NoopMediaplayer.js";
import ScaledImageTexture from "./ScaledImageTexture.js";

export default class Ui extends lng.Application {

    constructor(options) {
        options.defaultFontFace = options.defaultFontFace || "RobotoRegular";
        super(options);
        this._options = options;
    }

    static _template() {
        return {
            Mediaplayer: {type: lng.Utils.isWeb ? Mediaplayer : NoopMediaplayer, textureMode: Ui.hasOption('texture')},
            AppWrapper: {}
        };
    }

    static set staticFilesPath(path) {
        this._staticFilesPath = path;
    }

    get useImageServer() {
        return !Ui.hasOption("noImageServer");
    }

    get mediaplayer() {
        return this.tag("Mediaplayer");
    }

    _active() {
        this.tag('Mediaplayer').skipRenderToTexture = this._options.skipRenderToTexture;
    }

    startApp(appClass) {
        this._setState("App.Loading", [appClass]);
    }

    stopApp() {
    }

    _handleBack() {
        if (lng.Utils.isWeb) {
            window.close();
        }
    }

    static loadFonts(fonts) {
        if (lng.Utils.isNode) {
            // Font loading not supported. Fonts should be installed in Linux system and then they can be picked up by cairo.
            return Promise.resolve();
        }

        const fontFaces = fonts.map(({family, url, descriptors}) => new FontFace(family, `url(${url})`, descriptors));
        fontFaces.forEach(fontFace => {
            document.fonts.add(fontFace);
        });
        return Promise.all(fontFaces.map(ff => ff.load())).then(() => {return fontFaces});
    }

    static getPath(relPath) {
        return this._staticFilesPath + "static-ux/" + relPath;
    }

    static getFonts() {
        return [
            {family: 'RobotoRegular', url: Ui.getPath('fonts/roboto-regular.ttf'), descriptors: {}},
            {family: 'Material-Icons', url: Ui.getPath('fonts/Material-Icons.ttf'), descriptors: {}}
        ]
    }

    static _states() {
        return [
            class App extends this {
                stopApp() {
                    this._setState("");
                }
                static _states() {
                    return [
                        class Loading extends this {
                            $enter(context, appClass) {
                                this._startApp(appClass);
                            }
                            _startApp(appClass) {
                                this._currentApp = {
                                    type: appClass,
                                    fontFaces: []
                                };

                                // Preload fonts.
                                const fonts = this._currentApp.type.getFonts();
                                Ui.loadFonts(fonts.concat(Ui.getFonts())).then((fontFaces) => {
                                    this._currentApp.fontFaces = fontFaces;
                                }).catch((e) => {
                                    console.warn('Font loading issues: ' + e);
                                });
                                this._done();
                            }
                            _done() {
                                this._setState("App.Started");
                            }
                        },
                        class Started extends this {
                            $enter() {
                                this.tag("AppWrapper").children = [{ref: "App", type: this._currentApp.type}];
                            }
                            $exit() {
                                this.tag("AppWrapper").children = [];
                            }
                        }
                    ]
                }
            }
        ]
    }

    _getFocused() {
        return this.tag("App");
    }

    _setFocusSettings(settings) {
        settings.clearColor = this.stage.getOption('clearColor');
        settings.mediaplayer = {
            consumer: null,
            stream: null,
            hide: false,
            videoPos: [0, 0, 1920, 1080]
        };
    }

    _handleFocusSettings(settings) {
        if (this._clearColor !== settings.clearColor) {
            this._clearColor = settings.clearColor;
            this.stage.setClearColor(settings.clearColor);
        }

        if (this.tag("Mediaplayer").attached) {
            this.tag("Mediaplayer").updateSettings(settings.mediaplayer);
        }
    }

    static getProxyUrl(url, opts = {}) {
        return this._getCdnProtocol() + "://cdn.metrological.com/proxy" + this.getQueryString(url, opts);
    }

    static getImage(url, opts = {}) {
        return {type: ScaledImageTexture, src: url, scalingOptions: opts};
    }

    static getImageUrl(url, opts = {}) {
        throw new Error("{src: Ui.getImageUrl(...)} is deprecated. Please use {texture: Ui.getImage(...)} instead.");
    }

    static getQrUrl(url, opts = {}) {
        return this._getCdnProtocol() + "://cdn.metrological.com/qr" + this.getQueryString(url, opts, "q");
    }

    static _getCdnProtocol() {
        return lng.Utils.isWeb && location.protocol === "https" ? "https" : "http";
    }

    static hasOption(name) {
        if (lng.Utils.isNode) {
            return false;
        }

        return new URL(document.location.href).searchParams.has(name);
    }

    static getOption(name) {
        if (lng.Utils.isNode) {
            return undefined;
        }

        return new URL(document.location.href).searchParams.get(name);
    }

    static getQueryString(url, opts, key = "url") {
        let str = `?operator=${encodeURIComponent(this.getOption('operator') || 'metrological')}`;
        const keys = Object.keys(opts);
        keys.forEach(key => {
            str += "&" + encodeURIComponent(key) + "=" + encodeURIComponent("" + opts[key]);
        });
        str += `&${key}=${encodeURIComponent(url)}`;
        return str;
    }


}

Ui._staticFilesPath = "./";
