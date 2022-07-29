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
