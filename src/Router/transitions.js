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

const fade = (i, o) => {
  return new Promise(resolve => {
    i.patch({
      alpha: 0,
      visible: true,
      smooth: {
        alpha: [1, { duration: 0.5, delay: 0.1 }],
      },
    })
    // resolve on y finish
    i.transition('alpha').on('finish', () => {
      if (o) {
        o.visible = false
      }
      resolve()
    })
  })
}

const crossFade = (i, o) => {
  return new Promise(resolve => {
    i.patch({
      alpha: 0,
      visible: true,
      smooth: {
        alpha: [1, { duration: 0.5, delay: 0.1 }],
      },
    })
    if (o) {
      o.patch({
        smooth: {
          alpha: [0, { duration: 0.5, delay: 0.3 }],
        },
      })
    }
    // resolve on y finish
    i.transition('alpha').on('finish', () => {
      resolve()
    })
  })
}

const moveOnAxes = (axis, direction, i, o) => {
  const bounds = axis === 'x' ? 1920 : 1080
  return new Promise(resolve => {
    i.patch({
      [`${axis}`]: direction ? bounds * -1 : bounds,
      visible: true,
      smooth: {
        [`${axis}`]: [0, { duration: 0.4, delay: 0.2 }],
      },
    })
    // out is optional
    if (o) {
      o.patch({
        [`${axis}`]: 0,
        smooth: {
          [`${axis}`]: [direction ? bounds : bounds * -1, { duration: 0.4, delay: 0.2 }],
        },
      })
    }
    // resolve on y finish
    i.transition(axis).on('finish', () => {
      resolve()
    })
  })
}

const up = (i, o) => {
  return moveOnAxes('y', 0, i, o)
}

const down = (i, o) => {
  return moveOnAxes('y', 1, i, o)
}

const left = (i, o) => {
  return moveOnAxes('x', 0, i, o)
}

const right = (i, o) => {
  return moveOnAxes('x', 1, i, o)
}

export default {
  fade,
  crossFade,
  up,
  down,
  left,
  right,
}
