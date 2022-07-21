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
import { RoutedApp } from "./base";

export let navigateQueue: Map<string, any /*Request*/>;

export function navigate(url: any, args?: any, store?: any): any;

export function step(level?: number): any;

export function getResumeHash(): any;

export function initRouter(config: any): any;

declare module '../../index.js' {
  namespace Lightning {
    interface Component {
      widgets: { [s in keyof Router.Widgets]: Router.Widgets[s] }
    }
  }
}

declare namespace Router {
  const step: any;
  export const startRouter: any;
  export { navigate };
  export const resume: any;
  export {
    step,
    step as go
  }
  export const back: any;
  export const activePage: any;
  export const getActivePage: any;
  export const getActiveRoute: any;
  export const getActiveHash: any;
  export const focusWidget: any;
  export const getActiveWidget: any;
  export const restoreFocus: any;
  export const isNavigating: any;
  export const getHistory: any;
  export const setHistory: any;
  export const getHistoryState: any;
  export const replaceHistoryState: any;
  export const getQueryStringParams: any;
  export const reload: any;
  export const symbols: any;
  export {
    RoutedApp as App
  }
  export const focusPage: any;
  export const root: any;
  // export const setupRoutes: any;
  // export const on: any;
  // export const before: any;
  // export const after: any;
  // - Deprecated and non-functional

  //
  // Types
  //
  /**
   * Widgets
   */
  export interface Widgets {
    [s: string]: unknown
  }

}

export default Router;
