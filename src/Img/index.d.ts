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
import ScaledImageTexture from "./ScaledImageTexture.js";

interface PresetOptionsChain {
  /**
   * Resizes the image to the exact dimensions, ignoring the ratio.
   *
   * @param w
   * @param h
   */
  exact(w: number, h: number): ScaledImageTexture.Settings;
  /**
   * Resizes the image by width, maintaining the ratio.
   *
   * @param w
   */
  landscape(w: number): ScaledImageTexture.Settings;
  /**
   * Resizes the image by height, maintaining the ratio.
   *
   * @param h
   */
  portrait(h: number): ScaledImageTexture.Settings;
  /**
   * Resizes the image in such a way that it covers the entire area. Depending on the orientation
   * (portrait or landscape) of the source image and that of the desired output, it resizes the image
   * by width or by height.
   *
   * @param w
   * @param h
   */
  cover(w: number, h: number): ScaledImageTexture.Settings;
  /**
   * Resizes the image in such a way that it is contained within the available area. Depending on the
   * orientation (portrait or landscape) of the source image and that of the desired output, it resizes
   * the image by width or by height.
   *
   * @param w
   * @param h
   */
  contain(w: number, h: number): ScaledImageTexture.Settings;
  /**
   * Generates the image without resizing it (that is, it uses the original dimensions), while still
   * passing it through the proxy (and taking advantage of caching).
   */
  original(): ScaledImageTexture.Settings;
}

/**
 * Image plugin
 *
 * @remarks
 * The standard way of displaying images in Lightning is to just specify the src. This is the preferred way
 * for local assets (such as background, splash screen, logo and icons) of Lightning Apps.
 *
 * It is recommended that you optimize the local assets of your App by resizing them to the exact size and
 * quality in which you will use them. This positively affects the memory usage of your App.
 *
 * However, if you don’t have control over the images to be displayed in your App (for example, because they
 * originate from a remote API), you can use the Image plugin to resize and crop them.
 *
 * See [Image](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/image?id=image)
 * for more information.
 *
 * @param imageUrl
 * @param options
 */
declare function Img(imageUrl: string): PresetOptionsChain;
declare function Img(imageUrl: string, options: ScaledImageTexture.Options): ScaledImageTexture.Settings;

export default Img;
