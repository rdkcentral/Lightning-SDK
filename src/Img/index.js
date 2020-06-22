/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
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

import Utils from '../Utils'
import Settings from '../Settings'
import ScaledImageTexture from './ScaledImageTexture'

export default (imageUrl, options) => {
  const imageServerUrl = Settings.get('platform', 'imageServerUrl')

  // make and return ScaledImageTexture
  const make = options => {
    // local asset, wrap it in Utils.asset()
    if (!/^(?:https?:)?\/\//i.test(imageUrl)) {
      imageUrl = Utils.asset(imageUrl)
    }

    // only pass to image server if imageServerUrl is configured
    // and if the asset isn't local to the app (i.e. has same origin)
    if (imageServerUrl && imageUrl.indexOf(window.location.origin) === -1) {
      imageUrl = Utils.ensureUrlWithProtocol(
        imageServerUrl + '?' + Utils.makeQueryString(imageUrl, options)
      )
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
    landscape: w => make(setOptions({ type: 'landscape', w })),
    // fixme: remove deprecated stuff in future release of SDK
    portrait: (w_but_actually_h, deprecated_h) => {
      if (typeof deprecated_h !== 'undefined' && deprecated_h !== null) {
        console.warn(
          "The signature of the 'portrait()'-method has changed, soon it will only accept the height as a single argument (instead of 'portrait(width, height)')"
        )
        w_but_actually_h = deprecated_h
      }
      return make(setOptions({ type: 'portrait', h: w_but_actually_h }))
    },
    cover: (w, h) => make(setOptions({ type: 'cover', w, h })),
    contain: (w, h) => make(setOptions({ type: 'contain', w, h })),
    original: () => make(setOptions({ type: 'contain' })),

    // todo: add positioning - i.e. top, bottom, center, left etc.

    // FIXME: remove deprecated api (summer of 2020)
    crop: (w, h) => {
      console.warn(
        "The 'crop()'-method is deprecated and will be removed. Please use 'cover()' instead"
      )
      return make(setOptions({ type: 'cover', w, h }))
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
      return make(setOptions({ type: 'contain', w, h }))
    },
  }
}
