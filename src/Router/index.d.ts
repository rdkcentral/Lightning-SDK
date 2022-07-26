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

/**
 * Router config
 */
interface RouteConfig {
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
   * Based on the `from` and `to` parameters that are passed by the Router to the hook, you can decide
   * to continue, stop or redirect the navigate.
   *
   * The hook must return a `Promise<boolean>`. If it resolves to `true`, the Router continues the process. If it
   * resolves to false, the process is aborted.
   *
   * See [Router Configuration - beforeEachRoute](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/configuration?id=beforeeachroute)
   * for more information.
   */
  beforeEachRoute?: ((from: string, to: string) => Promise<boolean>);

  /**
   * Global hook that will be called after every succesful `navigate()` request.
   *
   * @remarks
   * The parameter is the resolved request object.
   *
   * See [Router Configuration - afterEachRoute](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/configuration?id=aftereachroute)
   * for more information.
   */
  afterEachRoute?: ((request: any) => void); // TODO: Type request !!!

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
   * ???
   *
   * @param page
   * @param params
   */
  on?(page: InstanceType<Constructor>, params: PageParams): Promise<void>;

  /**
   * ???
   *
   * @param page
   * @param params
   */
  before?(page: InstanceType<Constructor>, params: PageParams): Promise<void>;

  /**
   * ???
   *
   * @param page
   * @param params
   */
  after?(page: InstanceType<Constructor>, params: PageParams): Promise<void>;

  /**
   * ???
   */
  cache?: number;

  /**
   * ???
   */
  widgets?: Array<keyof Router.WidgetContainer>;
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

export let navigateQueue: Map<string, any /*Request*/>;

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

/**
 * Augment Lightning to include `widgets` on all components
 */
declare module '../../index.js' {
  namespace Lightning {
    namespace Component {
      interface TypeConfig {
        IsPage: boolean;
      }
    }

    interface Component<
      TemplateSpecType,
      TypeConfig
    > {
      /**
       * Lightning SDK Router Widgets
       *
       * @remarks
       * Note: This structure is only available on Lightning SDK Router Pages.
       *
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
       *
       * See [Router Widgets](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/widgets?id=handling-focus)
       * for more information.
       */
      widgets: [TypeConfig['IsPage']] extends [true] ? Router.WidgetContainer : undefined;

      /**
       * Overridable history state push/pop method
       *
       * @remarks
       * See [Router History - historyState](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/history?id=historystate)
       * for more information.
       *
       * @param params If `params` are provided, this is a "pop" operation. Otherwise, it's a "push"
       */
      historyState?(params?: Router.HistoryState | null): Router.HistoryState | null | undefined
    }
  }
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
  export function startRouter(config: RouteConfig, instance?: Lightning.Component): void;

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
   *
   * @privateRemarks
   * TODO: Type the "history object"
   */
  export function getHistory(): any;

  /**
   * Replaces the Router's current history stack with a new one
   *
   * @remarks
   * See [Router History](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/history?id=router-history)
   * for more information.
   *
   * @privateRemarks
   * TODO: Type the "history object"
   *
   * @param history
   */
  export function setHistory(history: any[]): void;

  /**
   * Returns the history state object of a previous history stack entry
   *
   * @remarks
   * See [Router History](https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/history?id=router-history)
   * for more information.
   *
   * @param hash Hash of history state to return. If not provided, the last history state object on the stack is returned.
   */
  export function getHistoryState(hash?: string): HistoryState | null;

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
  export function replaceHistoryState(state?: HistoryState | null, hash?: string): void;

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
    RouteConfig,
    NavigateArgs,
    NamedNavigationPath,
    RouteDefinition,
    PageParams,
    QueryParams
  }

  /**
   * Interface containing a list of widgets and their types.
   *
   * @remarks
   * This interface is augmentable. Your application may add to it in order to
   * facilitate additional type safety in your code.
   *
   * The keys are the PascalCase widget names. The values are the widget Component instance types.
   *
   * Augmenting this will give the Router's widget APIs auto-complete and error checking.
   *
   * @example
   * Add the following somewhere in your project
   * ```ts
   * declare module "@lightingjs/sdk" {
   *   namespace Router {
   *     interface AppWidgets {
   *       Menu: Menu;
   *       DetailsMenu: Menu;
   *       PeopleMenu: Menu;
   *     }
   *   }
   * }
   * ```
   *
   */
  export interface AppWidgets {
    // This interface is augmentable
  }

  /**
   * @hidden
   */
  type IsAppWidgetsAugmented = {} extends AppWidgets ? false : true;

  /**
   * @hidden
   */
  type __Widgets = IsAppWidgetsAugmented extends true ? AppWidgets : { [s: string]: unknown };

  /**
   * Widgets structure
   *
   * @remarks
   * If {@link AppWidgets} is not augmented, then this will be allowed to be keyed by any string with
   * any `unknown` value type.
   *
   * @sealed
   */
  export interface Widgets extends __Widgets {
    // This interface is sealed. Augment `AppWidgets` if needed.
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
    // This interface is sealed. Augment `AppWidgets` if needed.
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
   * History state object
   *
   * @sealed
   */
  export interface HistoryState extends Record<string, unknown> {
    // Not to be augmented
  }
}

export default Router;
