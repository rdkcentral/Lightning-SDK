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

import { getRouterConfig } from './router'
import { isPromise, isString } from './helpers'
import Transitions from '../transitions'

/**
 * execute transition between new / old page and
 * toggle the defined widgets
 * @todo: platform override default transition
 * @param pageIn
 * @param pageOut
 */
export const executeTransition = (pageIn, pageOut = null) => {
  const transition = pageIn.pageTransition || pageIn.easing
  const hasCustomTransitions = !!(pageIn.smoothIn || pageIn.smoothInOut || transition)
  const transitionsDisabled = getRouterConfig().get('disableTransitions')

  if (pageIn.easing) {
    console.warn('easing() method is deprecated and will be removed. Use pageTransition()')
  }

  // default behaviour is a visibility toggle
  if (!hasCustomTransitions || transitionsDisabled) {
    pageIn.visible = true
    if (pageOut) {
      pageOut.visible = false
    }
    return Promise.resolve()
  }

  if (transition) {
    let type
    try {
      type = transition.call(pageIn, pageIn, pageOut)
    } catch (e) {
      type = 'crossFade'
    }

    if (isPromise(type)) {
      return type
    }

    if (isString(type)) {
      const fn = Transitions[type]
      if (fn) {
        return fn(pageIn, pageOut)
      }
    }

    // keep backwards compatible for now
    if (pageIn.smoothIn) {
      // provide a smooth function that resolves itself
      // on transition finish
      const smooth = (p, v, args = {}) => {
        return new Promise(resolve => {
          pageIn.visible = true
          pageIn.setSmooth(p, v, args)
          pageIn.transition(p).on('finish', () => {
            resolve()
          })
        })
      }
      return pageIn.smoothIn({ pageIn, smooth })
    }
  }
  return Transitions.crossFade(pageIn, pageOut)
}
