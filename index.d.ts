/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2022 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { FontFaceDefinition } from './src/Application/index.js';
import { RouterPlatformSettings } from './src/Router/index.js';
export const Ads: any; // export { default as Ads } from './src/Ads'
export type { AppData, FontFaceDefinition } from './src/Application/index.js';
export { default as Application } from './src/Application/index.js';
export const AudioPlayer: any; // export { default as AudioPlayer } from './src/AudioPlayer'
export const Colors: any; // export { default as Colors } from './src/Colors'
export { default as Img } from './src/Img/index.js';
export const Keyboard: any; // export { default as Keyboard } from './src/Keyboard'
export { default as Launch } from './src/Launch/index.js';
export { default as Lightning } from './src/Lightning/index.js';
export const Locale: any; // export { default as Locale } from './src/Locale'
export const Language: any; // export { default as Language } from './src/Language'
export const Log: any; // export { default as Log } from './src/Log'
export const MediaPlayer: any; // export { default as MediaPlayer } from './src/MediaPlayer'
export const Metrics: any; // export { default as Metrics } from './src/Metrics'
export const Pin: any; // export { default as Pin } from './src/Pin'
export const Profile: any; // export { default as Profile } from './src/Profile'
export const Purchase: any; // export { default as Purchase } from './src/Purchase'
export const Registry: any; // export { default as Registry } from './src/Registry'
export { default as Router } from './src/Router/index.js';
export const Settings: any; // export { default as Settings } from './src/Settings'
export const Storage: any; // export { default as Storage } from './src/Storage'
export const TV: any; // export { default as TV } from './src/TV'
export { default as Utils } from './src/Utils/index.js';
export const VideoPlayer: any; // export { default as VideoPlayer } from './src/VideoPlayer'
export const Metadata: any; // export { default as Metadata } from './src/Metadata'

/**
 * [Platform Settings](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/settings?id=platform-settings)
 */
export interface PlatformSettings {
  plugins?: {
    profile?: any;
    metrics?: any;
    mediaPlayer?: any;
    ads?: any;
    router?: any;
    tv?: any;
    purchase?: any;
    pin?: any;
  };
  /**
   * The target ECMAScript environment for the App.
   */
  esEnv?: 'es5' | 'es6';
  /**
   * If set to `true`, initializes the Lightning Inspector
   *
   * @remarks
   * The Lightning Inspector renders out a HTML structure inside the DOM to mimic the canvas.
   *
   * @defaultValue `false`
   */
  inspector?: boolean;

  /**
   * If set to `true`, shows a frames-per-second indicator on the top-left corner of the screen
   *
   * @defaultValue `false`
   */
  showFps?: boolean;
  /**
   * Custom font loader
   *
   * @param fontsToLoad
   * @param store Add loaded [FontFace](https://developer.mozilla.org/en-US/docs/Web/API/FontFace) instances to this array
   */
  fontLoader?(fontsToLoad: FontFaceDefinition[], store: FontFace[]): void;
  /**
   * If set to `true`, shows the active versions of Lightning Core and SDK on the bottom-right corner of the screen
   *
   * @defaultValue `false`
   */
  showVersion?: boolean;

  /**
   * If set to `true`, enables console logging in the Log plugin
   *
   * @remarks
   * See [Log](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/log)
   * for more information.
   *
   */
  log?: boolean;

  onClose?: any;

  /**
   * Indicates whether or not to render video as a texture on the active drawing
   * canvas. Can also be set by adding a queryparam ?texture.
   *
   * @remarks
   * Used by the [VideoPlayer](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/videoplayer?id=videoplayer)
   * plugin.
   *
   * @defaultValue `false`
   */
  textureMode?: boolean;

  /**
   * Path to the folder where the assets of the App are located. The path
   * is used by Utils.asset() to look up assets.
   *
   * @remarks
   * See [Utils](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/utils?id=utils)
   * for more information.
   */
  path?: string;
  /**
   * Router plugin settings
   *
   * @remarks
   * See [Router Settings](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/settings?id=router-settings)
   * for more information.
   */
  router?: RouterPlatformSettings;
  /**
   * Image plugin settings
   *
   * See [Image plugin](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/image?id=image)
   * for more information.
   */
  image?: {
    /**
     * Image plugin quality
     *
     * @remarks
     * Depending on this setting, the images that are returned by the image server will be smaller
     * than actually displayed on the screen. Lightning stretches the images to fit them within the
     * desired dimensions.
     *
     * The Platform Setting image.quality is a value between 1 and 100, where 1 means low quality and
     * 100 is the original image quality.
     *
     * See [Image plugin](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/image?id=image)
     * for more information.
     */
    quality?: number
  }
}
