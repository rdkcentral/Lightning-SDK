import Utils from '../Utils'
import ScaledImageTexture from './ScaledImageTexture'

export default (imageUrl, options) => {
  // since imageworkers don't work without protocol
  const validUrl = url => {
    if (/^\/\//.test(url)) {
      return `${window.location.protocol}${url}`
    }
    return url
  }

  // make and return ScaledImageTexture
  const make = options => {
    return {
      type: ScaledImageTexture,
      src: /^(?:https?:)?\/\//i.test(imageUrl) ? validUrl(imageUrl) : Utils.asset(imageUrl),
      scalingOptions: options,
    }
  }

  // merge options with default
  const setOptions = options => {
    return {
      ...{
        type: 'contain',
        w: 0,
        h: 0,
      },
      ...options,
    }
  }

  // if options passed, return scaled image right away
  if (options) {
    return make(setOptions(options))
  }

  // otherwise return 'chained' functions
  return {
    cover: (w, h) => make(setOptions({ type: 'cover', w, h })),
    contain: (w, h) => make(setOptions({ type: 'contain', w, h })),
    // todo: offer more scaling functions like real cropping
    // possibly also with positioning - i.e. top, bottom, center, left etc.
  }
}
