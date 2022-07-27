/**
 * Tests for the Router Lightning augmentations
 */

import { expectAssignable, expectNotAssignable, expectType } from "tsd";
import { Lightning, Router } from "../../index.js";

declare module '../../index.js' {
  namespace Router {
    interface AppWidgets {
      MyClockWidget: Lightning.components.BloomComponent
      MyMenuWidget: Lightning.components.ListComponent
    }
  }
}

function Component_widgets_Tests() {
  /// `this.widgets` / `this.params` should be available to Components that set `IsPage` to `true`
  class MyPage extends Lightning.Component<
    Lightning.Component.TemplateSpecLoose,
    { IsPage: true } & Lightning.Component.TypeConfig
  > {
    _init() {
      /// Expect `widgets` to be a WidgetContainer
      expectType<Router.WidgetContainer>(this.widgets);

      /// Expect the widgets in `widgets` to be of the correct types
      expectType<Lightning.components.BloomComponent>(this.widgets.myclockwidget);
      expectType<Lightning.components.ListComponent>(this.widgets.mymenuwidget);

      /// Should error on unknown widgets (including PascalCase forms of known widgets)
      // @ts-expect-error
      this.widgets.MyClockWidget
      // @ts-expect-error
      this.widgets.unknownwidget;

      /// Expect `params` to be the correct type
      expectType<Router.PageParams | undefined>(this.params);
    }
  }
  /// `this.widgets` / `this.params` should not be available if `IsPage` is not set to `true`
  class MyComponent1 extends Lightning.Component<
    Lightning.Component.TemplateSpecLoose,
    Lightning.Component.TypeConfig
  > {
    _init() {
      expectType<unknown>(this.widgets);
      expectType<unknown>(this.params);
    }
  }
  class MyComponent2 extends Lightning.Component<
    Lightning.Component.TemplateSpecLoose,
    { IsPage: false } & Lightning.Component.TypeConfig
  > {
    _init() {
      expectType<unknown>(this.widgets);
      expectType<unknown>(this.params);
    }
  }
}


function Component_override_Tests() {
  interface MyPageTypeConfig extends Lightning.Component.TypeConfig {
    IsPage: true;
    HistoryStateType: {
      param1: boolean;
      param2: number;
    }
  }

  /// Overrides with explicit TypeConfig / HistoryStateType
  class MyPage extends Lightning.Component<
    Lightning.Component.TemplateSpecLoose,
    MyPageTypeConfig
  > {
    /// historyState should be overridable
    override historyState(params: Router.HistoryState<MyPageTypeConfig>): Router.HistoryState<MyPageTypeConfig> {
      if (params) {
        /// Expect type of params to now be the same exact type as `HistoryStateType` in the `TypeConfig`
        expectType<MyPageTypeConfig['HistoryStateType']>(params);
      } else {
        /// Expect that `Router.HistoryState` for this Page is assingable
        expectAssignable<Router.HistoryState<MyPageTypeConfig>>({
            param1: true,
            param2: 123
        });

        /// Both params are required
        expectNotAssignable<Router.HistoryState<MyPageTypeConfig>>({
          param1: true
        });

        /// Adding an unknown param should not be assignable to the History State
        expectNotAssignable<Router.HistoryState<MyPageTypeConfig>>({
          param1: true,
          param2: 123,
          unknownParam: 'abc'
        });

        return {
          param1: false,
          param2: 321
        }
      }
    }

    /// pageTransition should be overridable
    override pageTransition(pageIn: Router.PageInstance, pageOut: Router.PageInstance | null): Router.PageTransition | Promise<void> {
      /// Should be able to assign all of the default transition types to `Router.PageTransition`
      expectAssignable<Router.PageTransition>('crossFade');
      expectAssignable<Router.PageTransition>('down');
      expectAssignable<Router.PageTransition>('fade');
      expectAssignable<Router.PageTransition>('left');
      expectAssignable<Router.PageTransition>('right');
      expectAssignable<Router.PageTransition>('up');

      /// Should not be able to assign an unknown transition string
      expectNotAssignable<Router.PageTransition>('unknownTransition');

      /// Should be able to return a promise
      return Promise.resolve();
    }

    /// Ensure all the event handler are overridable without errors
    override _onDataProvided(): void {
      // Nothing to test inside
    }

    override _onMounted(): void {
      // Nothing to test inside
    }

    override _onChanged(): void {
      // Nothing to test inside
    }

    override _onUrlParams(params: Router.PageParams): void {
      // Nothing to test inside
    }

    override _onActivated(page: Router.PageInstance): void {
      // Nothing to test inside
    }
  }

  /// `historyState` should work default to `Record<string, unknown>` if not specified in TypeConfig
  class MyPage2 extends Lightning.Component {
    /// Should be no errors with this override signature
    override historyState(params: Router.HistoryState): Router.HistoryState {
      if (params) {
        /// Expect params, at this point, to be a Record<string, unknown>
        expectType<Record<string, unknown>>(params);
      } else {
        /// Expect anything goes for assigning to default HistoryState
        expectAssignable<Router.HistoryState>({
          unknownParam1: false,
          unknownParam2: 321,
        });

        return {
          unknownParam1: true,
          unknownParam2: 123,
        };
      }
    }
  }
}
