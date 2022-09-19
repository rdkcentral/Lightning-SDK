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
import { expectType } from 'tsd';
import { Img } from '../../index.js';
import type ScaledImageTexture from '../../src/Img/ScaledImageTexture';


function Img_Tests() {
  /// Without options
  Img('http://example.com/image.jpg');
  expectType<ScaledImageTexture.Settings>(Img('http://example.com/image.jpg').contain(123, 123));
  expectType<ScaledImageTexture.Settings>(Img('http://example.com/image.jpg').cover(123, 123));
  expectType<ScaledImageTexture.Settings>(Img('http://example.com/image.jpg').exact(123, 123));
  expectType<ScaledImageTexture.Settings>(Img('http://example.com/image.jpg').landscape(123));
  expectType<ScaledImageTexture.Settings>(Img('http://example.com/image.jpg').original());
  expectType<ScaledImageTexture.Settings>(Img('http://example.com/image.jpg').portrait(123));

  /// With options
  expectType<ScaledImageTexture.Settings>(
    Img('http://example.com/image.jpg', {
      type: 'contain',
      w: 123,
      h: 123
    })
  );
}
