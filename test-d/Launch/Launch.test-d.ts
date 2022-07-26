import { expectType } from 'tsd';
import { Lightning, Launch, PlatformSettings } from '../../index.js';

class App extends Lightning.Component {}

function Launch_Tests() {
  /// Test that its callable and returns the right type
  expectType<Lightning.Application>(Launch(App, {} as Lightning.Application.Options, {} as PlatformSettings, {}));
}
