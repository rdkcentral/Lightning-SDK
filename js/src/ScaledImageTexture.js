export default class ScaledImageTexture extends lng.textures.ImageTexture {

    constructor(stage) {
        super(stage);

        this._scalingOptions = undefined;
    }

    set scalingOptions(options) {
        if (!lng.Utils.equalValues(this._scalingOptions, options)) {
            this._scalingOptions = options;
            this._changed();
        }
    }

    _getSourceLoader() {
        let src = this._src;
        if (this.stage.getOption('srcBasePath')) {
            var fc = src.charCodeAt(0);
            if ((src.indexOf("//") === -1) && ((fc >= 65 && fc <= 90) || (fc >= 97 && fc <= 122) || fc == 46)) {
                // Alphabetical or dot: prepend base path.
                src = this.stage.getOption('srcBasePath') + src;
            }
        }

        if (this.stage.application.useImageServer) {
            src = this._getImageServerSrc(src);
        } else {
            this.resizeMode = ScaledImageTexture._convertScalingOptions(this._scalingOptions);
        }

        const platform = this.stage.platform;
        return function(cb) {
            return platform.loadSrcTexture({src: src, hasAlpha: this._hasAlpha}, cb);
        }
    }

    static _convertScalingOptions(options) {
        const opts = lng.Utils.clone(options);
        switch(options.type) {
            case "crop":
                opts.type = "cover";
                break;
            case "fit":
            case "parent":
            case "exact":
            case "height":
            case "portrait":
            case "width":
            case "landscape":
            case "auto":
            default:
                opts.type = "contain";
                break;
        }
        opts.w = opts.w || opts.width || 0;
        opts.h = opts.h || opts.height || 0;
        return opts;
    }

    _getImageServerSrc(src) {
        if (this._scalingOptions && (this._precision !== 1)) {
            const opts = lng.Utils.clone(this._scalingOptions)
            if (opts.width) {
                opts.width = Math.round(opts.width * this._precision);
            }

            if (opts.height) {
                opts.height = Math.round(opts.height * this._precision);
            }
            src = ScaledImageTexture.getImageUrl(src, opts);
        } else {
            src = ScaledImageTexture.getImageUrl(src, this._scalingOptions);
        }
        return src;
    }

    static getImageUrl(url, opts = {}) {
        return this._getCdnProtocol() + "://cdn.metrological.com/image" + this.getQueryString(url, opts);
    }

    static _getCdnProtocol() {
        return lng.Utils.isWeb && location.protocol === "https" ? "https" : "http";
    }

    static getQueryString(url, opts, key = "url") {
        let str = `?operator=${encodeURIComponent('metrological')}`;
        const keys = Object.keys(opts);
        keys.forEach(key => {
            str += "&" + encodeURIComponent(key) + "=" + encodeURIComponent("" + opts[key]);
        });
        str += `&${key}=${encodeURIComponent(url)}`;
        return str;
    }

    getNonDefaults() {
        const obj = super.getNonDefaults();
        if (this._src) {
            obj.src = this._src;
        }
        return obj;
    }

}

