import Utils from '../Utils'
import Settings from '../Settings'
import ScaledImageTexture from './ScaledImageTexture'

export default (imageUrl, options) => {
  const imageServerUrl = Settings.get('platform', 'imageServerUrl')

  // since imageworkers don't work without protocol
  // Fixme: maybe move this to Utils to be used in other places as well
  const validUrl = url => {
    if (/^\/\//.test(url)) {
      return `${window.location.protocol}${url}`
    }
    return url
  }

  // make and return ScaledImageTexture
  const make = options => {
    // local asset, wrap it in Utils.asset()
    if (!/^(?:https?:)?\/\//i.test(imageUrl)) {
      imageUrl = Utils.asset(imageUrl)
    }

    // only pass to image server if imageServerUrl is configured
    // and if the asset isn't local to the app (i.e. has same origin)
    if (imageServerUrl && imageUrl.indexOf(window.location.origin) === -1) {
      imageUrl = validUrl(imageServerUrl + '?' + Utils.makeQueryString(imageUrl, options))
      console.log(imageUrl)
    } else {
      // Lightning will handle the resizing and has only 2 flavours (cover and contain)
      if (options.type === 'crop') options.type = 'cover'
      else options.type = 'contain'
    }

    return {
      type: ScaledImageTexture,
      src: imageUrl,
      options: options,
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

  // if options are passed, return scaled image right away
  if (options) {
    return make(setOptions(options))
  }

  // otherwise return 'chained' functions
  return {
    // official api
    exact: (w, h) => make(setOptions({ type: 'exact', w, h })),
    landscape: (w, h) => make(setOptions({ type: 'landscape', w, h })),
    portrait: (w, h) => make(setOptions({ type: 'portrait', w, h })),
    // FIXME: change type to cover, when imageServer has been updated to 1.0.12
    cover: (w, h) => make(setOptions({ type: 'crop', w, h })),
    // FIXME: change type to contain, when imageServer has been updated to 1.0.12
    contain: (w, h) => make(setOptions({ type: 'auto', w, h })),

    // todo: add positioning - i.e. top, bottom, center, left etc.

    // FIXME: remove deprecated api (summer of 2020)
    crop: (w, h) => {
      console.warn(
        "The 'crop()'-method is deprecated and will be removed. Please use 'cover()' instead"
      )
      // FIXME: change to 'cover', when imageServer has been updated to 1.0.12
      make(setOptions({ type: 'crop', w, h }))
    },
    fit: (w, h) => {
      console.warn(
        "The 'fit()'-method is deprecated and will be removed. Please use 'exact()' instead"
      )
      return make(setOptions({ type: 'exact', w, h }))
    },
    parent: (w, h) => {
      console.warn(
        "The 'parent()'-method is deprecated and will be removed. Please use 'exact()' instead"
      )
      return make(setOptions({ type: 'exact', w, h }))
    },
    height: (w, h) => {
      console.warn(
        "The 'height()'-method is deprecated and will be removed. Please use 'portrait()' instead"
      )
      return make(setOptions({ type: 'portrait', w, h }))
    },
    width: (w, h) => {
      console.warn(
        "The 'width()'-method is deprecated and will be removed. Please use 'landscape()' instead"
      )
      return make(setOptions({ type: 'landscape', w, h }))
    },
    auto: (w, h) => {
      console.warn(
        "The 'auto()'-method is deprecated and will be removed. Please use 'cover()' instead"
      )
      // FIXME: change to 'contain', when imageServer has been updated to 1.0.12
      return make(setOptions({ type: 'auto', w, h }))
    },
  }
}
