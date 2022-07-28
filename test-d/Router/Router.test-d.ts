import { expectType, expectAssignable, expectNotAssignable, expectDeprecated, expectNotDeprecated } from 'tsd';
import { Router, Lightning } from '../../index.js'
import Request from '../../src/Router/model/Request.js';

function Router_Config_Tests() {
  /// Basic
  expectAssignable<Router.Config>({
    root: 'splash',
    routes: [
      {
        path: 'splash',
        component: {} as Router.PageConstructor
      },
      {} as Router.RouteDefinition,
      {} as Router.RouteDefinition
    ]
  });

  /// `root` and `routes` are required!
  expectNotAssignable<Router.Config>({
    root: 'splash',
  });
  expectNotAssignable<Router.Config>({
    routes: [],
  });

  /// `root` and `routes` type sanity check
  expectNotAssignable<Router.Config>({
    root: 123, // Must be a string!
    routes: [
      {} as Router.RouteDefinition
    ]
  });

  expectNotAssignable<Router.Config>({
    root: 'abc',
    routes: [
      {} // Must be RouteDefinition!
    ]
  });

  /// `boot` and `root` as promise returning callbacks
  expectAssignable<Router.Config>({
    root: () => {
      return Promise.resolve('splash')
    },
    boot: (qs) => {
      /// `qs` infers to param type
      expectType<Record<string, string | undefined>>(qs);
      return Promise.resolve();
    },
    routes: []
  });

  /// Supports custom `appInstance` any component
  expectAssignable<Router.Config>({
    root: 'splash',
    routes: [],
    appInstance: {} as Lightning.Component
  });

  /// `updateHash`
  expectAssignable<Router.Config>({
    root: 'splash',
    routes: [],
    updateHash: false
  });

  /// `beforeEachRoute`
  expectAssignable<Router.Config>({
    root: 'splash',
    routes: [],
    beforeEachRoute: async (from, to) => {
      expectType<string>(from);
      expectType<Request>(to);
      return true;
    }
  });

  /// `afterEachRoute`
  expectAssignable<Router.Config>({
    root: 'splash',
    routes: [],
    afterEachRoute: (request) => {
      expectType<Request>(request);
      return true;
    }
  });

  /// `bootComponent` deprecated
  const routeConfig = {} as Router.Config;
  expectDeprecated(routeConfig.bootComponent);
}

function Router_startRouter_Tests() {
  const routeConfig = {} as Router.Config;
  /// Supports just passing a `config`
  expectType<void>(Router.startRouter(routeConfig));
  // @ts-expect-error `config` can't be a number
  Router.startRouter(123);

  /// Supports passing a `config` and an app `instance`
  expectType<void>(Router.startRouter(routeConfig, {} as Lightning.Component));
  // @ts-expect-error `instance` can't be a number
  Router.startRouter(routeConfig, 123);
}

function Router_RouteDefinition_Tests() {
  class MyPage extends Lightning.Component<Lightning.Component.TemplateSpecLoose, { IsPage: true } & Lightning.Component.TypeConfig> {}

  /// Simple RouteDefintions can be assigned
  expectAssignable<Router.RouteDefinition>({
    path: 'myPath/:param1/:param2',
    component: MyPage
  });

  /// Non-Pages cannot be assigned
  expectNotAssignable<Router.RouteDefinition>({
    path: 'myPath/:param1/:param2',
    component: Lightning.components.ListComponent
  });

  /// Non-Pages can be assigned with `any`
  expectAssignable<Router.RouteDefinition>({
    path: 'myPath/:param1/:param2',
    component: Lightning.components.ListComponent as any
  });

  /// Can assign `on`
  expectAssignable<Router.RouteDefinition>({
    path: 'myPath/:param1/:param2',
    component: MyPage,
    async on(page, { param1, param2 }) {
      expectType<Router.PageInstance>(page);
      expectAssignable<MyPage>(page);
      expectType<string | undefined>(param1);
      expectType<string | undefined>(param2);
    }
  });

  /// Can assign `before`
  expectAssignable<Router.RouteDefinition>({
    path: 'myPath/:param1/:param2',
    component: MyPage,
    async before(page, { param1, param2 }) {
      expectType<Router.PageInstance>(page);
      expectAssignable<MyPage>(page);
      expectType<string | undefined>(param1);
      expectType<string | undefined>(param2);
    }
  });

  /// Can assign `after`
  expectAssignable<Router.RouteDefinition>({
    path: 'myPath/:param1/:param2',
    component: MyPage,
    async after(page, { param1, param2 }) {
      expectType<Router.PageInstance>(page);
      expectAssignable<MyPage>(page);
      expectType<string | undefined>(param1);
      expectType<string | undefined>(param2);
    }
  });

  /// Can assign `cache`
  expectAssignable<Router.RouteDefinition>({
    path: 'myPath/:param1/:param2',
    component: MyPage,
    cache: 1000
  });

  /// Can assign `widgets`
  expectAssignable<Router.RouteDefinition>({
    path: 'myPath/:param1/:param2',
    component: MyPage,
    widgets: ['anotherwidget', 'myclockwidget', 'mymenuwidget', 'mywidget']
  });
}

function Router_navigate_Tests() {
  // Many examples taken from documentation:
  // https://lightningjs.io/docs/#/lightning-sdk-reference/plugins/router/navigation?id=router-navigation

  const namedNavigatePath: Router.NamedNavigationPath = {} as Router.NamedNavigationPath;
  const navigateArgs: Router.NavigateArgs = {} as Router.NavigateArgs;

  /// Can do simple navigate by string or named route
  expectType<void>(
    Router.navigate('player/1638')
  );
  expectType<void>(
    Router.navigate(namedNavigatePath)
  );
  /// Can do navigate with args
  expectType<void>(
    Router.navigate('player/1638', navigateArgs)
  );
  expectType<void>(
    Router.navigate(namedNavigatePath, navigateArgs)
  );
  /// Can do navigate and set 2nd param to false (to prevent history)
  expectType<void>(
    Router.navigate('player/1638', false)
  );
  expectType<void>(
    Router.navigate(namedNavigatePath, false)
  );
  /// Can do navigate and set 3rd param to false (to prevent history)
  expectType<void>(
    Router.navigate('player/1638', navigateArgs, false)
  );
  expectType<void>(
    Router.navigate(namedNavigatePath, navigateArgs, false)
  );
}

function Router_NamedNavigationPath_Tests() {
  /// `to` is the mimimum property required
  expectAssignable<Router.NamedNavigationPath>({
    to: 'player',
  });
  expectNotAssignable<Router.NamedNavigationPath>({});

  /// Allow `params` to be specified
  expectAssignable<Router.NamedNavigationPath>({
    to: 'player',
    params: {
      unknownProp1: 123,
      unknownProp2: 'abc',
      unknownProp3: true,
    }
  });

  /// As well as `query`
  expectAssignable<Router.NamedNavigationPath>({
    to: 'player',
    params: {
      unknownProp1: 123,
      unknownProp2: 'abc',
      unknownProp3: true,
    },
    query: {
      unknownProp1: 123,
      unknownProp2: 'abc',
      unknownProp3: true,
    }
  });

  /// `params` must be a Record<string, string | number | boolean> (if defined)
  expectNotAssignable<Router.NamedNavigationPath>({
    to: 'player',
    params: {
      unknownProp4: {} // Not allowed
    }
  });
  expectType<Record<string, string | number | boolean> | undefined>({} as Router.NamedNavigationPath['params']);

  /// `query` must be a Record<string, string | number | boolean> (if defined)
  expectNotAssignable<Router.NamedNavigationPath>({
    to: 'player',
    query: {
      unknownProp4: {} // Not allowed
    }
  });
  expectType<Record<string, string | number | boolean> | undefined>({} as Router.NamedNavigationPath['params']);
}

function Router_NavigateArgs_Tests() {
  /// NavigateArgs allows keepAlive, reload and anything else.
  expectAssignable<Router.NavigateArgs>({
    keepAlive: true,
    reload: true,
    unknownProp1: 'abc',
    unknownProp2: 123,
    unknownProp3: false,
    unknownProp4: {}
  });

  /// NavigateArgs: keepAlive and reload must be booleans
  expectType<boolean | undefined>({} as Router.NavigateArgs['keepAlive']);
  expectNotAssignable<Router.NavigateArgs>({
    keepAlive: 'string',
  });
  expectType<boolean | undefined>({} as Router.NavigateArgs['reload']);
  expectNotAssignable<Router.NavigateArgs>({
    reload: 'string',
  });
}

function Router_resume_Tests() {
  /// Should return void with no params
  expectType<void>(Router.resume());

  /// Should error if there are any params
  // @ts-expect-error
  Router.resume('abc');
}


function Router_step_Tests() {
  /// `step` is an alias of `go`
  expectType<typeof Router.go>(Router.step);

  /// Should be deprecated
  expectDeprecated(Router.step);
}

function Router_go_Tests() {
  /// Works with no parameters
  expectType<void>(Router.go());

  /// Works with numeric parameters
  expectType<void>(Router.go(-1));
  expectType<void>(Router.go(-2));
  expectType<void>(Router.go(-3));

  /// Should not be deprecated
  expectNotDeprecated(Router.go);
}

function Router_back_Tests() {
  /// back() can be called with no parameters
  expectType<void>(Router.back());
}

function Router_activePage_Tests() {
  /// Returns the correct value but is deprecated
  expectType<Lightning.Component | null>(Router.activePage());

  /// Should be deprecated
  expectDeprecated(Router.activePage);
}

function Router_getActivePage_Tests() {
  /// Returns the correct value and is not deprecated
  expectType<Lightning.Component | null>(Router.getActivePage());

  /// Should not be deprecated
  expectNotDeprecated(Router.getActivePage);
}

function Router_getActiveRoute_Tests() {
  /// Returns the correct value and is not deprecated
  expectType<string | undefined>(Router.getActiveRoute());
}

function Router_getActiveHash_Tests() {
  /// Returns the correct value and is not deprecated
  expectType<string | undefined>(Router.getActiveHash());
}

declare module '../../index.js' {
  namespace Router {
    interface CustomWidgets {
      MyWidget: Lightning.Component
      AnotherWidget: Lightning.Component
    }
  }
}

function Router_focusWidget_Tests() {
  /// Works with augmented `CustomWidgets`
  expectType<void>(Router.focusWidget('MyWidget'));
  expectType<void>(Router.focusWidget('AnotherWidget'));

  /// Unknown widgets error (including lowercase forms of known widgets)
  // @ts-expect-error
  Router.focusWidget('mywidget');
  // @ts-expect-error
  Router.focusWidget('UnknownWidget');
}

function Router_getActiveWidget_Tests() {
  /// Returns the right value
  expectType<Lightning.Component | null>(Router.getActiveWidget());
  /// Param sanity check: Should not accept a parameter
  // @ts-expect-error
  Router.getActiveWidget(123);
}

function Router_restoreFocus_Tests() {
  /// Should be an alias of focusPage
  expectType<typeof Router['restoreFocus']>(Router.focusPage);
  /// Should be deprecated
  expectDeprecated(Router.restoreFocus);
}

function Router_focusPage_Tests() {
  /// Should return void and accept no params
  expectType<void>(Router.focusPage());

  /// Param sanity check: Should not accept a parameter
  // @ts-expect-error
  Router.getActiveWidget(123);

  /// Should not be deprecated
  expectNotDeprecated(Router.focusPage);
}

function Router_isNavigating_Tests() {
  /// Works as expected
  expectType<boolean>(Router.isNavigating());
}

function Router_getHistory_Tests() {
  /// Should return an array of HistoryEntry[]
  expectType<Router.HistoryEntry[]>(Router.getHistory());
}

function Router_setHistory_Tests() {
  /// Should return void, accepts an array of history objects
  expectType<void>(Router.setHistory([{ hash: '', state: {} }, { hash: '', state: {} }]));

  /// Should error if first param is not an array or if less than or more than one param is provided
  // @ts-expect-error
  Router.setHistory(123);
  // @ts-expect-error
  Router.setHistory();
  // @ts-expect-error
  Router.setHistory([], 'abc');
}

function Router_HistoryState_Tests() {
  type HistState = {
    myParam1: number,
    myParam2: string
  };
  interface CustomTypeConfig extends Lightning.Component.TypeConfig {
    HistoryStateType: HistState
  }

  /// Should be typed as `Record<string, unknown> | null | undefined` if no params are passed to it
  expectType<Record<string, unknown> | null | undefined>({} as Router.HistoryState);
  /// Should extract the `HistoryStateType` if a TypeConfig is passed
  expectType<HistState | null | undefined>({} as Router.HistoryState<CustomTypeConfig>);
  /// Otherwise, it should just pass through any other object type passed in
  expectType<HistState | null | undefined>({} as Router.HistoryState<HistState>);
}

function Router_getHistoryState_Tests() {
  /// Should return HistoryState | null, and accept an optional `hash` string
  expectType<Router.HistoryState | null>(Router.getHistoryState());
  expectType<Router.HistoryState | null>(Router.getHistoryState('abc'));

  /// Should error if first param isn't a string of if more than 1 param is provided
  // @ts-expect-error
  Router.getHistoryState(123);
  // @ts-expect-error
  Router.getHistoryState('abc', 123);
}

function Router_replaceHistoryState_Tests() {
  /// Should return void and work with no params, 1 param or 2 params
  expectType<void>(Router.replaceHistoryState());
  expectType<void>(Router.replaceHistoryState({} as Router.HistoryState));
  expectType<void>(Router.replaceHistoryState(null));
  expectType<void>(Router.replaceHistoryState({} as Router.HistoryState, 'hash'));

  /// Should error if params are of wrong type or more than 2
  // @ts-expect-error
  Router.replaceHistoryState(123);
  // @ts-expect-error
  Router.replaceHistoryState(null, 123);
  // @ts-expect-error
  Router.replaceHistoryState(null, 'hash', 'abc');
}

function Router_getQueryStringParams_Tests() {
  /// Should return correct type and work with no params or 1 param
  expectType<Router.QueryParams | false>(Router.getQueryStringParams());
  expectType<Router.QueryParams | false>(Router.getQueryStringParams('hash'));

  /// Should error if there are more than 1 param or type of param is incorrect
  // @ts-expect-error
  Router.getQueryStringParams(false);
  // @ts-expect-error
  Router.getQueryStringParams('hash', false);
}

function Router_reload_Tests() {
  /// Should return void with no params
  expectType<void>(Router.reload());

  /// Should error if there are any params
  // @ts-expect-error
  Router.reload('abc');
}

function Router_root_Tests() {
  /// Should return void with no params
  expectType<void>(Router.root());

  /// Should error if there are any params
  // @ts-expect-error
  Router.root('abc');
}
