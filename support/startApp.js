'use strict';

function _newArrowCheck(innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
}

var _this = undefined;

var isSpark = eval('typeof lng !== "undefined" && lng.Utils.isSpark');

if (!isSpark) {
  var style = document.createElement('style');
  document.head.appendChild(style);
  style.sheet.insertRule('@media all { html {height: 100%; width: 100%;} *,body {margin:0; padding:0;} canvas { position: absolute; z-index: 2; } body { background: black; width: 100%; height: 100%;} }');
}

var startApp = function startApp() {
  var _this2 = this;

  _newArrowCheck(this, _this);

  console.time('app');
  var appMetadata;
  var settings;
  var seq = [function () {
    var _this3 = this;

    _newArrowCheck(this, _this2);

    return getSettings().then(function (config) {
      _newArrowCheck(this, _this3);

      return settings = config;
    }.bind(this));
  }.bind(this), function () {
    var _this4 = this;

    _newArrowCheck(this, _this2);

    return getAppMetadata().then(function (metadata) {
      _newArrowCheck(this, _this4);

      return appMetadata = metadata;
    }.bind(this));
  }.bind(this), function () {
    _newArrowCheck(this, _this2);

    return injectFavicon(appMetadata);
  }.bind(this), function () {
    _newArrowCheck(this, _this2);

    return loadPolyfills(settings.platformSettings.esEnv);
  }.bind(this), function () {
    _newArrowCheck(this, _this2);

    return loadLightning(settings.platformSettings.esEnv);
  }.bind(this), function () {
    _newArrowCheck(this, _this2);

    return loadAppBundle(settings.platformSettings.esEnv);
  }.bind(this), function () {
    var _this5 = this;

    _newArrowCheck(this, _this2);

    return hasTextureMode().then(function (enabled) {
      _newArrowCheck(this, _this5);

      return settings.platformSettings.textureMode = enabled;
    }.bind(this));
  }.bind(this), function () {
    var _this6 = this;

    _newArrowCheck(this, _this2);

    return settings.platformSettings.inspector === true ? loadLightningInspect(settings.platformSettings.esEnv).then(function () {
      _newArrowCheck(this, _this6);

      return window.attachInspector(window.lng);
    }.bind(this)) : Promise.resolve();
  }.bind(this), function () {
    _newArrowCheck(this, _this2);

    console.time('app2');

    if (isSpark) {
      eval('lng.Stage.platform = SparkPlatform');
    }

    settings.appSettings.version = appMetadata.version;
    settings.appSettings.id = appMetadata.identifier;
    if (isSpark) global.beginDrawing();
    var app = (isSpark ? eval(appMetadata.id) : window[appMetadata.id])(settings.appSettings, settings.platformSettings, settings.appData);
    if (isSpark) global.endDrawing();

    if (!isSpark) {
      document.body.appendChild(app.stage.getCanvas());
    }
  }.bind(this)];
  if (isSpark) seq.splice(2, 5); // Spark imports are in index.spark

  sequence(seq);
}.bind(undefined);

var getAppMetadata = function getAppMetadata() {
  var _this7 = this;

  _newArrowCheck(this, _this);

  return fetch('./metadata.json').then(function (response) {
    _newArrowCheck(this, _this7);

    return response.json();
  }.bind(this)).then(function (metadata) {
    _newArrowCheck(this, _this7);

    metadata.id = `APP_${metadata.identifier.replace(/[^0-9a-zA-Z_$]/g, '_')}`;
    return metadata;
  }.bind(this));
}.bind(undefined);

var getSettings = function getSettings() {
  var _this8 = this;

  _newArrowCheck(this, _this);

  return fetch('./settings.json').then(function (response) {
    _newArrowCheck(this, _this8);

    return response.json();
  }.bind(this)).catch(function (error) {
    _newArrowCheck(this, _this8);

    console.warn('No settings.json found. Using defaults.');
    return {
      appSettings: {},
      platformSettings: {
        path: './static',
        esEnv: 'es6'
      }
    };
  }.bind(this));
}.bind(undefined); // FIXME: these 3 functions could be refactored to a single one receiving 2 arguments (filename, esEnv)


var loadLightning = function loadLightning(esEnv) {
  _newArrowCheck(this, _this);

  var filename = !esEnv || esEnv === 'es6' ? 'lightning.js' : 'lightning.' + esEnv + '.js';
  return loadJS('./lib/' + filename);
}.bind(undefined);

var loadAppBundle = function loadAppBundle(esEnv) {
  _newArrowCheck(this, _this);

  var filename = !esEnv || esEnv === 'es6' ? './appBundle.js' : './appBundle.' + esEnv + '.js';
  return loadJS(filename);
}.bind(undefined);

var loadLightningInspect = function loadLightningInspect(esEnv) {
  _newArrowCheck(this, _this);

  var filename = !esEnv || esEnv === 'es6' ? 'lightning-inspect.js' : 'lightning-inspect.' + esEnv + '.js';
  return loadJS('./lib/' + filename);
}.bind(undefined);

var loadPolyfills = function loadPolyfills(esEnv) {
  var _this9 = this;

  _newArrowCheck(this, _this);

  // load polyfills when esEnv is defined and it's not es6
  if (esEnv && esEnv !== 'es6') {
    return sequence([function () {
      _newArrowCheck(this, _this9);

      return loadJS('./polyfills/babel-polyfill7.6.0.js');
    }.bind(this), function () {
      _newArrowCheck(this, _this9);

      return loadJS('./polyfills/url.js');
    }.bind(this)]);
  }

  return Promise.resolve();
}.bind(undefined);

var loadJS = function loadJS(url, id) {
  var _this10 = this;

  _newArrowCheck(this, _this);

  return new Promise(function (resolve) {
    _newArrowCheck(this, _this10);

    console.log('loadJS', url);
    var tag = document.createElement('script');
    tag.onload = resolve;
    tag.src = url;
    if (id) tag.id = id;
    document.body.appendChild(tag);
  }.bind(this));
}.bind(undefined);

var sequence = function sequence(steps) {
  var _this11 = this;

  _newArrowCheck(this, _this);

  return steps.reduce(function (promise, method) {
    var _this12 = this;

    _newArrowCheck(this, _this11);

    return promise.then(function () {
      _newArrowCheck(this, _this12);

      return method();
    }.bind(this));
  }.bind(this), Promise.resolve(null));
}.bind(undefined);

var hasTextureMode = function hasTextureMode() {
  var _this13 = this;

  _newArrowCheck(this, _this);

  return new Promise(function (resolve) {
    _newArrowCheck(this, _this13);

    // yes, this could be a oneliner, but zebra es5 couldn't handle that (so 2 lines to be safe)
    var url = new URL(document.location.href);
    resolve(url.searchParams.has('texture'));
  }.bind(this));
}.bind(undefined);

var injectFavicon = function injectFavicon(metadata) {
  _newArrowCheck(this, _this);

  var link = document.createElement('link');
  link.rel = 'shortcut icon';
  link.type = 'image/png'; // set to app icon if it exists, otherwise a transparent pixel

  link.href = metadata.icon || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  document.head.appendChild(link);
}.bind(undefined);

startApp();
