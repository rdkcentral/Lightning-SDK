import { Lightning, Router } from '../../index.js'
import { expectAssignable } from 'tsd';

function RouterApp_Tests() {
  class MyApp extends Router.App {
    _init() {
      /// Pre-existing child Elements are accessible by ref
      expectAssignable<Lightning.Element>(this.getByRef('Loading')!.getByRef('Label')!);
      expectAssignable<Lightning.Element>(this.getByRef('Pages')!)
      expectAssignable<Lightning.Element>(this.getByRef('Widgets')!);
    }

    /// _handleAppClose should be overridable
    override _handleAppClose(): void {
      // Nothing to test here
    }
  }
}
