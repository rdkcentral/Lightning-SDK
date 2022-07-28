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
import { Lightning } from "../../index.js";
import { RoutedApp } from "./base";
import Request from "./model/Request";

export interface RouterPlatformSettings {
  /**
   * If set to `true`, pages are not created until you actually navigate to a route.
   *
   * @remarks
   * See [Router Settings](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/settings?id=router-settings)
   * for more information.
   *
   * @defaultValue `false`
   */
  lazyCreate?: boolean;

  /**
   * If set to `true`, pages from which you navigate are removed from the [Render Tree](https://lightningjs.io/docs/#/lightning-core-reference/RenderEngine/RenderTree)
   * (and thus from memory).
   *
   * @remarks
   * See [Router Settings](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/settings?id=router-settings)
   * for more information.
   *
   * @defaultValue `false`
   */
  lazyDestroy?: boolean;

  /**
   * If set to `true`, forces a texture garbage collect directly after destroying the page.
   *
   * @remarks
   * See [Router Settings](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/settings?id=router-settings)
   * for more information.
   *
   * @defaultValue `false`
   */
  gcOnUnload?: boolean;

  /**
   * If set to `true`, when the Back key is pressed on a deeplinked route, the Router will recursively remove the last part
   * of the hash, until it finds a valid path to navigate to.
   *
   * @remarks
   * See [Router Settings](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/settings?id=router-settings)
   * and [Deeplinking - Backtracking](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/deeplinking?id=backtracking)
   * for more information.
   *
   * @defaultValue `false`
   */
  backtracking?: boolean;

  /**
   * If set to `true` (default), a navigation to a hash with the same route blueprint as the current hash will cause the
   * current Page to be reused. Set to `false` to force a new Page to be created in this case.
   *
   * @remarks
   * This can also be set locally on individual Routes {@link RouteOptions.reuseInstance}.

   *
   * See [Router Settings](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/settings?id=router-settings)
   * for more information.
   *
   * @defaultValue `true`
   */
  reuseInstance?: boolean;

  /**
   * If set to `true` and {@link lazyDestroy} is set to `false`, a Page will only be removed from memory
   * after doing a step Back in history.
   *
   * @remarks
   * See [Router Settings](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/settings?id=router-settings)
   * and [Router History](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/history?id=back)
   * for more information.
   *
   * @defaultValue `false`
   */
  destroyOnHistoryBack?: boolean;

  /**
   * If you do not want the Router to update the hash on a navigate, you can set this to `false`.
   *
   * @remarks
   * See [Router Settings](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/settings?id=router-settings)
   * for more information.
   *
   * @defaultValue `true`
   */
  updateHash?: boolean;

  /**
   * If set to `true` (default), causes an unhandled key that is encountered while a Widget is in focus
   * to automatically drop focus back to the underlying Page. Set this to `false` to disable this behavior.
   *
   * @remarks
   * > The Router used to delegate focus back to the page instance on
   * > every unhandled key. This is barely useful in any situation
   * > so for now we offer the option to explicity turn that behaviour off
   * > so we don't don't introduce a breaking change.
   *
   * @defaultValue `true`
   */
  autoRestoreRemote?: boolean;
}

/**
 * Router config
 */
interface Config {
  /**
   * The root key indicates which route path must be used as entry point of your App if no location hash is
   * specified in the URL.
   *
   * @remarks
   * The value of root should be a String, or a function that returns a Promise that resolves to a String.
   * The value must match the path of one of the defined routes.
   *
   * See [Router Configuration - root](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/configuration?id=root)
   * for more information.
   */
  root: string | (() => Promise<string>);
  /**
   * An array of route definition items.
   *
   * @remarks
   * Each item represents a route path that the App should listen to. It specifies which Page component should be displayed
   * when that route is hit.
   *
   * See [Router Configuration - routes](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/configuration?id=routes)
   * for more information.
   */
  routes: RouteDefinition[];

  /**
   * Provides the ability to execute functionality before the Router loads the first page.
   *
   * @remarks
   * For example, this key can be applied to obtain API tokens.
   *
   * See [Router Configuration - boot](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/configuration?id=boot)
   * for more information.
   */
  boot?: ((qs: QueryParams) => Promise<void>);

  appInstance?: Lightning.Component;

  /**
   * If you do not want the Router to update the hash on a navigate, set this to `false`.
   */
  updateHash?: boolean;

  /**
   * Global hook that is invoked right after starting a navigate to a route.
   *
   * @remarks
   * Based on the `fromHash` and `toRequest` parameters that are passed by the Router to the hook, you can decide
   * to continue, stop or redirect the navigate.
   *
   * The hook must return a `Promise<boolean>`. If it resolves to `true`, the Router continues the process. If it
   * resolves to `false`, the process is aborted.
   *
   * See [Router Configuration - beforeEachRoute](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/configuration?id=beforeeachroute)
   * for more information.
   *
   * @param fromHash Hash navigating from
   * @param toRequest Request navigating to
   */
  beforeEachRoute?(fromHash: string, toRequest: Request): Promise<boolean>;

  /**
   * Global hook that will be called after every succesful `navigate()` request.
   *
   * @remarks
   * The parameter is the resolved request object.
   *
   * See [Router Configuration - afterEachRoute](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/configuration?id=aftereachroute)
   * for more information.
   */
  afterEachRoute?(request: Request): void;

  /**
   * @deprecated
   * Boot Component is now available as a [special router](https://rdkcentral.github.io/Lightning-SDK/#/plugins/router/configuration?id=special-routes)
   *
   * This property will be removed in a future release.
   */
  bootComponent?: Lightning.Component;
}

interface NavigateArgs {
  /**
   * If set to `true`, keeps the current page from which you are navigating in the history stack when the
   * [lazy destroy](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/settings?id=lazydestroy)
   * feature is enabled.
   *
   * @remarks
   * If you are navigating from one page to another while the [lazy destroy](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/settings?id=lazydestroy)
   * feature is configured, the page from which you navigate is removed from the history stack.
   *
   * Sometimes, you might want to keep the current page from which you are navigating alive, to go back to it’s original
   * state when necessary.
   *
   * See [Router Navigation - keepAlive](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/navigation?id=keepalive)
   * for more information.
   */
  keepAlive?: boolean;
  /**
   * If set to `true`, reloads the current page without a hash change.
   */
  reload?: boolean;

  [s: string]: unknown; // Anything is allowed because these aren't encoded into a URL
}

/**
 * Parameters from hash that end up in _onUrlParams and in other calls
 */
interface PageParams extends Record<string, string | undefined> {
  /**
   * Query parameters (after the route hash path)
   */
  [Router.symbols.queryParams]?: QueryParams;
  [Router.symbols.store]?: Record<string, unknown>;
}

/**
 * Query params
 */
interface QueryParams extends Record<string, string | undefined> {

}

/**
 * Object used for named navigation
 *
 * See [Router Navigation - Named Routes](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/navigation?id=named-routes)
 * for more information.
 */
interface NamedNavigationPath {
  /**
   * Named route to navigate to.
   *
   * @remarks
   * See [Router Navigation - Named Routes](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/navigation?id=named-routes)
   * for more information.
   */
  to: string;
  /**
   * Route params that are embedded in a route hash
   *
   * @remarks
   * If the named route is defined as `"player/:assetId/:playlistId"` and
   * the params are:
   * ```
   * {
   *   assetId: 123,
   *   playlistId: 321
   * }
   * ```
   *
   * The hash `"#player/123/321"` will be navigated to.
   */
  params?: Record<string, string | number | boolean>;
  /**
   * Query params that are appended to the end of the hash
   *
   * @remarks
   * If the named route is defined as `"guide"` and
   * the query is defined as:
   * ```
   * {
   *   filter: "sports",
   *   sort: "rating"
   * }
   * ```
   *
   * The hash `"#guide?filter=sports&sort=rating"` will be navigated to.
   */
  query?: Record<string, string | number | boolean>;
}

/**
 * Route Options
 *
 * @remarks
 * See [Route Options](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/configuration?id=route-options)
 * for more information.
 */
interface RouteOptions {
  /**
   * Indicates whether or not to prevent the route from storage in history.
   *
   * @defaultValue `false`
   */
  preventStorage?: boolean;

  /**
   * Indicates whether or not to reset the history of a route when that route is visited.
   *
   * @defaultValue `false`
   */
  clearHistory?: boolean;

  /**
   * Indicates whether or not to reuse the current Page instance.
   *
   * @remarks
   * This is the local version of the global platform setting {@link RouterPlatformSettings.reuseInstance}.
   *
   * See [Route Options - reuseInstance](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/configuration?id=reuseinstance)
   * for more information.
   *
   * @defaultValue `true`
   */
  reuseInstance?: boolean;
}

interface RouteDefinition<Constructor extends Router.PageConstructor = Router.PageConstructor> {
  /**
   * Path to associate with route.
   *
   * See [Router Configuration - Routes](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/configuration?id=routes)
   * for more information.
   */
  path: string;

  /**
   * Page to associate with route.
   *
   * @remarks
   * Can be a Lightning Component (i.e., a class that extends the Lightning.Component) or a function that returns
   * a dynamic import.
   *
   * See [Router Configuration - Component Property](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/configuration?id=component-property)
   * for more information.
   */
  component: Constructor | (() => Promise<{ default: Constructor }>);

  /**
   * "on" data provider callback
   *
   * @remarks
   * When implemented for a route and that route is navigated to the Router...
   * 1. Hides the current page (and destroys it to free up memory, if so configured)
   * 2. Sets the application component to the `"Loading"` state
   * 3. Calls the data provider callback and waits for it to resolve
   * 4. Shows the new Page attached to the route
   *
   * Note: This cannot be combined with the other data provider callbacks: {@link before}, {@link after}
   *
   * See [Data Providing - on](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/dataproviding?id=on)
   * for more information.
   *
   * @param page Instance of the route's defined Page
   * @param params Navigated page params
   */
  on?(page: InstanceType<Constructor>, params: PageParams): Promise<void>;

  /**
   * "before" data provider callback
   *
   * @remarks
   * When implemented for a route and that route is navigated to the Router...
   * 1. Calls the data provider callback
   * 2. Keeps the current page visible
   * 3. Waits for the callback to resolve
   * 4. Shows the new Page attached to the route (and destroys the previous one to free up memory, if so configured)
   *
   * Note: This cannot be combined with the other data provider callbacks: {@link on}, {@link after}
   *
   * See [Data Providing - before](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/dataproviding?id=before)
   * for more information.
   *
   * @param page Instance of the route's defined Page
   * @param params Navigated page params
   */
  before?(page: InstanceType<Constructor>, params: PageParams): Promise<void>;

  /**
   * "after" data provider callback
   *
   * @remarks
   * When implemented for a route and that route is navigated to the Router...
   * 1. Calls the data provider callback
   * 2. Keeps the current page visible
   * 3. Waits for the callback to resolve
   * 4. Shows the new Page attached to the route (and destroys the previous one to free up memory, if so configured)
   *
   * Note: This cannot be combined with the other data provider callbacks: {@link on}, {@link before}
   *
   * See [Data Providing - after](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/dataproviding?id=before)
   * for more information.
   *
   * @param page Instance of the route's defined Page
   * @param params Navigated page params
   */
  after?(page: InstanceType<Constructor>, params: PageParams): Promise<void>;

  /**
   * Number of millseconds that provided data stays valid when the same Page is visited more than once.
   *
   * @remarks
   * If the same route is hit within the specified cache time, the page is loaded with the cached data.
   * Otherwise, a new request will be made.
   *
   * Note: This only applies if the page still exists in memory.
   *
   * See [Data Providing](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/dataproviding?id=data-providing)
   * for more information.
   */
  cache?: number;

  /**
   * An array of lower-cased widget refs that should appear when this route is navigated to.
   *
   * @remarks
   * See [Router Widgets - Activating Widgets](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/widgets?id=activating-widgets)
   * for more information.
   */
  widgets?: Array<keyof Router.WidgetContainer>;

  /**
   * Route Options
   *
   * @remarks
   * See [Route Options](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/configuration?id=route-options)
   * for more information.
   */
  options?: RouteOptions

  /**
   * Local hook that you can specify for this specific route, and is invoked right before the
   * Router navigates to that route. It follows the same rules as the global hook
   * {@link Router.Config.beforeEachRoute}.
   *
   * @param fromHash Hash navigating from
   * @param toRequest Request navigating to
   */
  beforeNavigate?(fromHash: string, toRequest: Request): Promise<boolean>;

  /**
   * Local hook executed when the specific route is navigated to.
   *
   * @remarks
   * This is called after the {@link beforeNavigate} hook, if its specified.
   */
  hook?(app: Router.App, params: Record<string, string | undefined>): void;
}

/**
 * Lowercase possible strings
 */
type LowercaseString<PossibleString> =
  [PossibleString] extends [string]
    ?
      Lowercase<PossibleString>
    :
      PossibleString;

export let navigateQueue: Map<string, Request>;

/**
 * Navigate to Page (adding page to history stack)
 *
 * @remarks
 * See [Router Navigation - Navigate](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/navigation?id=navigate)
 * for more information.
 *
 * @param path Page path to navigate to
 * @param args Additional navigation parameters
 * @param store If set to `false`, prevents the calling page from being added to the history stack.
 */
export function navigate(path: string | NamedNavigationPath, store: boolean): void;
export function navigate(path: string | NamedNavigationPath, args?: NavigateArgs, store?: boolean): void;

/**
 * @deprecated Use {@link Router.go}
 */
export function step(level?: number): void;

export function getResumeHash(): string;

/**
 * This can be called from the platform / bootstrapper to override
 * the default getting and setting of the hash
 * @param config
 */
export function initRouter(config: {
  getHash?(): string,
  setHash?(hash: string): void
}): void;

type PageTransition = 'left' | 'right' | 'up' | 'down' | 'fade' | 'crossFade';

/**
 * Augment Lightning to add SDK specific things
 */
declare module '../../index.js' {
  namespace Lightning {
    namespace Component {
      interface TypeConfig {
        /**
         * Set to `true` to mark the Component as a Lightning SDK Router Page
         *
         * @remarks
         * Added by [Lightning SDK Router](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/index)
         */
        IsPage: boolean;
        /**
         * Set to customize the type used to store History State for the Page (Lightning SDK Router Pages only)
         *
         * @remarks
         * Note: This should only be set if {@link IsPage} is set to `true` for a Component.
         *
         * See [Router History - historyState](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/history?id=historystate)
         * for more information.
         *
         * Added by [Lightning SDK Router](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/index)
         */
        HistoryStateType: Record<string, unknown>;
      }
    }
    interface Component<
      TemplateSpecType,
      TypeConfig
    > {
      /**
       * Lightning SDK Router Widgets (Lightning SDK Router Pages only)
       *
       * @remarks
       * Note: This structure is only available on Lightning SDK Router Pages.
       *
       * See [Router Widgets - Interaction](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/widgets?id=interaction)
       * for more information.
       *
       * Added by [Lightning SDK Router](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/index)
       *
       * @example
       * To declare a Lightning Component as a Router Page, you must set `IsPage` to `true` in the Component's
       * `TypeConfig`:
       *
       * ```ts
       * interface MyPageTypeConfig extends Lightning.Component.TypeConfig {
       *   IsPage: true;
       * }
       *
       * export class MyPage extends Lightning.Component<MyPageTemplateSpec, MyPageTypeConfig> {
       *   _init() {
       *     this.widgets.mywidget; // Widgets now accessible!
       *   }
       * }
       * ```
       */
      widgets: [TypeConfig['IsPage']] extends [true] ? Router.WidgetContainer : unknown;

      /**
       * Page Params (Lightning SDK Router Pages only)
       *
       * @remarks
       * The same parameters passed to {@link _onUrlParams} but made available on the page.
       *
       * Added by [Lightning SDK Router](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/index)
       */
      params: [TypeConfig['IsPage']] extends [true] ? Router.PageParams | undefined : unknown;

      /**
       * Overridable method used to control how this Page transitions (Lightning SDK Router Pages only)
       *
       * @remarks
       * - If this method returns a default {@link PageTransition} string value, that default transition behavior will be
       *   used:
       *   - `"left"`
       *     - Put the new page on x:1920 and perform a transition to x:0. For the old page, perform a transition
       *       to x:-1920.
       *   - `"right"`
       *     - Put the new page on x:-1920 and perform a transition to x:0. For the old page, perform a transition
       *       to x:1920.
       *   - `"up"`
       *     - Put the new page on y:1080 and perform a transition to y:0. For the old page, perform a transition
       *       to y:-1080.
       *   - `"down"`
       *     - Put the new page on y:-1080 and perform a transition to y:0. For the old page, perform a transition
       *       to y:1080.
       *   - `"fade"`
       *     - For the new page, perform a transition from alpha:0 to alpha:1.
       *   - `"crossFade"`
       *     - For the new page, perform a transition from alpha:0 to alpha:1. For the old page, perform a transition from alpha:1 to alpha:0.
       * - If this method returns `Promise<void>`:
       *   - Executes a [Custom Page Transition](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/pagetransitions?id=custom-page-transitions)
       *
       * See [Page Transitions](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/pagetransitions)
       * for more information
       *
       * Added by [Lightning SDK Router](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/index)
       *
       * @param pageIn Page being transitioned in
       * @param pageOut Page being transitioned out (may be null)
       */
      pageTransition?(pageIn: Router.PageInstance, pageOut: Router.PageInstance | null): PageTransition | Promise<void>;

      /**
       * Overridable history state push/pop method (Lightning SDK Router Pages only)
       *
       * @remarks
       * Note: This method is only called if the Component is a Lightning SDK Router Page.
       *
       * See [Router History - historyState](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/history?id=historystate)
       * for more information.
       *
       * Added by [Lightning SDK Router](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/index)
       *
       * @example
       * ```ts
       * interface MyPageTypeConfig extends Lightning.Component.TypeConfig {
       *   IsPage: true;
       *   HistoryStateType: {
       *     listIndex: number
       *   }
       * }
       *
       * class MyRouterClass extends Lightning.Component<MyPageTemplateSpec, MyPageTypeConfig> {
       *   // ...
       *   override historyState(params: Router.HistoryState<MyPageTypeConfig>): Router.HistoryState<MyPageTypeConfig> {
       *     if (params) {
       *       this.selectedList.index = params.listIndex;
       *       this.selectedList.resetConfigIndex();
       *     } else {
       *       const list: InstanceType<ListBaseConstructor> | undefined = this.List.children[this._index] as InstanceType<ListBaseConstructor> | undefined;
       *       if (list) {
       *         return {listIndex: list.index}
       *       }
       *     }
       *   }
       * }
       * ```
       *
       * @param params If `params` are provided, this is a "pop" operation. Otherwise, it's a "push"
       */
      historyState?(params: Router.HistoryState<TypeConfig>): Router.HistoryState<TypeConfig>;

      /**
       * Implementable Page `dataProvided` event handler (Lightning SDK Router Pages only)
       *
       * @remarks
       * If you use [Data Providing](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/dataproviding?id=on-data-provided),
       * this callback on, before or after data providing callback has resolved.
       *
       * Note: This method is only called if the Component is a Lightning SDK Router Page.
       *
       * See [Router Events](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/events?id=router-events)
       * for more information.
       *
       * Added by [Lightning SDK Router](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/index)
       */
      _onDataProvided?(): void;

      /**
       * Implementable Page `mounted` event handler (Lightning SDK Router Pages only)
       *
       * @remarks
       * Invoked when the Router creates and mounts a new Page component.
       *
       * Note: This method is only called if the Component is a Lightning SDK Router Page.
       *
       * See [Router Events](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/events?id=router-events)
       * for more information.
       *
       * Added by [Lightning SDK Router](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/index)
       */
      _onMounted?(): void;

      /**
       * Implementable Page `changed` event handler (Lightning SDK Router Pages only)
       *
       * @remarks
       * Invoked when an existing Page instance is reused in navigation.
       *
       * Note: This method is only called if the Component is a Lightning SDK Router Page.
       *
       * See [Router Events](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/events?id=router-events)
       * for more information.
       *
       * Added by [Lightning SDK Router](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/index)
       */
      _onChanged?(): void;

      /**
       * Implementable Page `urlParams` event handler (Lightning SDK Router Pages only)
       *
       * @remarks
       * Invoked when a Page receives new URL params. This will always execute before {@link _onDataProvided}.
       *
       * Note: This method is only called if the Component is a Lightning SDK Router Page.
       *
       * See [Router Events](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/events?id=router-events)
       * for more information.
       *
       * Added by [Lightning SDK Router](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/index)
       */
      _onUrlParams?(params: Router.PageParams): void;

      /**
       * Implementable Widget `activated` event handler (Lightning SDK Router Widgets only)
       *
       * @remarks
       * Invoked when the Router changes the visibility of this Widget to true.
       *
       * Note: This method is only called if the Component is a Lightning SDK Router Widget.
       *
       * See [Router Events - _onActivated](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/events?id=_onactivatedpage)
       * for more information.
       *
       * Added by [Lightning SDK Router](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/index)
       *
       * @param page Instance of Page that activated this widget
       */
      _onActivated?(page: Router.PageInstance): void;
    }
  }
}

interface HistoryEntry {
  hash: string;
  state: Router.HistoryState;
}

declare namespace Router {
  /**
   * Start the Router
   *
   * @remarks
   * See [Router Configruation](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/configuration)
   * for more information.
   *
   * @param config
   * @param instance
   */
  export function startRouter(config: Config, instance?: Lightning.Component): void;

  export { navigate };

  /**
   * Resume Router's page loading process after the BootComponent becomoes visible.
   *
   * @remarks
   * See [Router Configuration - BootPage](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/configuration?id=bootpage)
   * for more information.
   */
  export function resume(): void;

  export {
    /**
     * @deprecated Use {@link Router.go}
     */
    step,
  }

  /**
   * Navigate backwards in the history stack
   *
   * @param level Number of steps to navigate back in the history stack. Must be negative!
   */
  export function go(level?: number): void;

  /**
   * Navigate to the last page in the history stack
   */
  export function back(): void;

  /**
   * @deprecated Use {@link getActivePage}
   */
  export function activePage(): Lightning.Component | null;

  /**
   * Returns the reference of the active Page instance
   */
  export function getActivePage(): Lightning.Component | null;

  /**
   * Returns the active route path blueprint
   */
  export function getActiveRoute(): string | undefined;

  /**
   * Returns the active hash
   */
  export function getActiveHash(): string | undefined;

  /**
   * Delegate focus to a widget
   *
   * @remarks
   * See [Router Widgets](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/widgets?id=handling-focus)
   * for more information.
   *
   * @param name Name of widget to delegate focus to
   */
  export function focusWidget(name: keyof Widgets): void;

  /**
   * Returns the instance of the widget that has focus.
   */
  export function getActiveWidget(): Lightning.Component | null;

  /**
   * @deprecated Use {@link focusPage}
   */
  export function restoreFocus(): void;

  /**
   * Returns `true` if the Router is busy processing a request.
   */
  export function isNavigating(): boolean;

  /**
   * Returns a copy of the Router’s current history stack
   *
   * @remarks
   * See [Router History](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/history?id=router-history)
   * for more information.
   */
  export function getHistory(): HistoryEntry[];

  /**
   * Replaces the Router's current history stack with a new one
   *
   * @remarks
   * See [Router History](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/history?id=router-history)
   * for more information.
   *
   * @param history
   */
  export function setHistory(history: HistoryEntry[]): void;

  /**
   * Returns the history state object of a previous history stack entry
   *
   * @remarks
   * See [Router History](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/history?id=router-history)
   * for more information.
   *
   * @param hash Hash of history state to return. If not provided, the last history state object on the stack is returned.
   */
  export function getHistoryState<CustomType extends object = Record<string, unknown>>(hash?: string): HistoryState<CustomType>;

  /**
   * Replaces the history state object of the last entry that was added to history. (if `hash` isn't provided)
   *
   * @remarks
   * If `hash` is provided, instead of the last entry, the state of the history entry matching the hash is replaced.
   *
   * See [Router History - replaceHistoryState](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/history?id=replacehistorystate)
   * for more information.
   *
   * @param state State object to replace (Default: `null`)
   * @param hash Optional hash
   */
  export function replaceHistoryState(state?: HistoryState, hash?: string): void;

  /**
   * Returns an object with the current query parameters specified
   *
   * @remarks
   * Returns `false` if there are none.
   */
  export function getQueryStringParams(hash?: string): QueryParams | false;

  /**
   * Force reload active hash
   */
  export function reload(): void;

  /**
   * Router symbols
   */
  export const symbols: {
    readonly route: unique symbol;
    readonly hash: unique symbol;
    readonly store: unique symbol;
    readonly fromHistory: unique symbol;
    readonly expires: unique symbol;
    readonly resume: unique symbol;
    readonly backtrack: unique symbol;
    readonly historyState: unique symbol;
    readonly queryParams: unique symbol;
  };

  export {
    RoutedApp as App
  }

  /**
   * Delegate focus to the active Page
   *
   * @remarks
   * See [Router Widgets - Handling Focus](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/widgets?id=handling-focus)
   * for more information.
   */
  export function focusPage(): void;

  /**
   * Navigate to root hash
   */
  export function root(): void;

  // export const setupRoutes: any;
  // export const on: any;
  // export const before: any;
  // export const after: any;
  // - Deprecated and non-functional

  //
  // Types
  //
  export {
    Config,
    NavigateArgs,
    NamedNavigationPath,
    RouteOptions,
    RouteDefinition,
    PageParams,
    QueryParams,
    PageTransition,
    HistoryEntry
  }

  /**
   * Interface containing a list of widgets and their types.
   *
   * @remarks
   * This interface is augmentable. Your application may add to it in order to
   * facilitate additional type safety in your code.
   *
   * The keys are the PascalCase widget refs. The values are the widget Component instance types.
   *
   * Augmenting this will give the Router's widget APIs auto-complete and error checking.
   *
   * @example
   * Add the following somewhere in your project
   * ```ts
   * declare module "@lightingjs/sdk" {
   *   namespace Router {
   *     interface CustomWidgets {
   *       Menu: Menu;
   *       DetailsMenu: Menu;
   *       PeopleMenu: Menu;
   *     }
   *   }
   * }
   * ```
   */
  export interface CustomWidgets {
    // This interface is augmentable
  }

  /**
   * @hidden
   */
  type IsCustomWidgetsAugmented = object extends Required<CustomWidgets> ? false : true;

  /**
   * @hidden
   */
  type __Widgets = IsCustomWidgetsAugmented extends true ? CustomWidgets : { [s: string]: unknown };

  /**
   * Widgets structure
   *
   * @remarks
   * If {@link CustomWidgets} is not augmented, then this will be allowed to be keyed by any string with
   * any `unknown` value type.
   *
   * @sealed
   */
  export interface Widgets extends __Widgets {
    // This interface is sealed. Augment `CustomWidgets` if needed.
  }

  /**
   * @privateRemarks
   * Lower-cased key version of Widgets used for the WidgetContainer
   * @hidden
   */
  type LowercaseWidgets = { [Key in keyof Widgets as LowercaseString<Key>]: Widgets[Key] };

  /**
   * Contains all the defined Widgets
   *
   * @remarks
   * Typically accessed from a Router page at `this.widgets`.
   *
   * @sealed
   */
  export interface WidgetContainer extends LowercaseWidgets {
    // This interface is sealed. Augment `CustomWidgets` if needed.
  }

  /**
   * Page instance
   */
  export type PageInstance = Lightning.Component<
    Lightning.Component.TemplateSpecLoose,
    Lightning.Component.TypeConfig & { IsPage: true }
  >;

  /**
   * Constructor for a Page
   */
  export type PageConstructor<T extends PageInstance = PageInstance> = new (...args: any[]) => T;

  /**
   * History state (including null/undefined types)
   *
   * @remarks
   * If passed a Component TypeConfig, then the HistoryStateType will be pulled from it.
   * Otherwise, the type passed to it is used directly as the history state type.
   *
   * @sealed
   */
  export type HistoryState<CustomType extends object = Record<string, unknown>> =
    [CustomType] extends [Lightning.Component.TypeConfig]
      ?
        CustomType['HistoryStateType'] | null | undefined
      :
        CustomType | null | undefined;
}

export default Router;
