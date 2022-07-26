import { expectAssignable } from 'tsd';
import { Lightning, Application, PlatformSettings } from '../../index.js';

class App extends Lightning.Component {}

function Application_Tests() {
  /// Test that its callable and returns the right type
  expectAssignable<Lightning.Application.Constructor>(Application(App, {}, {} as PlatformSettings));
}
