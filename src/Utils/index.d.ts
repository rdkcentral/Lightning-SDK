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
export function initUtils(config: any): void;

declare namespace Utils {
  /**
   * Generates a full URL to local App assets (such as images), based on the path that is configured
   * in [Platform Settings](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/settings?id=platform-settings).
   *
   * @param relPath
   */
  export function asset(relPath: string): string;
  /**
   * Generates a proxy URL. This is useful if you are using remote APIs that do not have CORS
   * (Cross-Origin Resource Sharing) configured correctly.
   *
   * @remarks
   * During development you must specify a proxyUrl as a Platform Setting in settings.json.
   * During production, the proxyUrl is automatically set (Metrological platform only).
   *
   * @param url
   * @param options Default: `{}`
   * @returns
   */
  export function proxyUrl(url: string, options?: Record<string, string | number | boolean>): string;

  /**
   * @param url
   * @param options Default: `{}`
   * @param type Default: `"url"`
   */
  export function makeQueryString(url: string, options?: Record<string, string | number | boolean>, type?: string): string;

  export {
    ensureUrlWithProtocol
  }
}

export default Utils;

export function ensureUrlWithProtocol(url: string): string;

export function makeFullStaticPath(pathname: string, path: string): string;

export function cleanUpPathName(pathname: string): string;
