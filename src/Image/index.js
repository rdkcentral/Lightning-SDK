// Todo: review this (with Erik probably)
import Utils from '../Utils'
import ScaledImageTexture from './ScaledImageTexture'

export default (imageUrl, options) => {
  const make = options => {
    return {
      type: ScaledImageTexture,
      src: Utils.proxyUrl(imageUrl),
      scalingOptions: options,
    }
  }

  const setOptions = options => {
    return {
      type: options.type || 'contain',
      w: options.w || 0,
      h: options.h || 0,
    }
  }

  // if options passed, return scaled image right away
  if (options) {
    return make(setOptions(options))
  }

  // otherwise return 'chained' functions
  return {
    crop: (w, h) => make(setOptions({ type: 'cover', w, h })),
    fit: (w, h) => make(setOptions({ type: 'contain', w, h })),
    // height ??
    // width ??
    // portrait ??
    // etc ??
  }
}
