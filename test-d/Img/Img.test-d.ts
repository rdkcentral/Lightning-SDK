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
