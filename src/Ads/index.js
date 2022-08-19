/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
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

import Log from '../Log'
import { mediaUrl } from '@metrological/sdk'

let consumer

let getAds = () => {
  // todo: enable some default ads during development, maybe from the settings.json
  return Promise.resolve({
    prerolls: [],
    midrolls: [],
    postrolls: [],
  })
}

export const initAds = config => {
  if (config.getAds) {
    getAds = config.getAds
  }
}

const state = {
  active: false,
}

const playSlot = (slot = []) => {
  return slot.reduce((promise, ad) => {
    return promise.then(() => {
      return playAd(ad)
    })
  }, Promise.resolve(null))
}

const playAd = ad => {
  return new Promise(resolve => {
    if (state.active === false) {
      Log.info('Ad', 'Skipping add due to inactive state')
      return resolve()
    }
    // is it safe to rely on videoplayer plugin already created the video tag?
    const videoEl = document.getElementsByTagName('video')[0]
    videoEl.style.display = 'block'
    videoEl.style.visibility = 'visible'
    videoEl.src = mediaUrl(ad.url)
    videoEl.load()

    let timeEvents = null
    let timeout

    const cleanup = () => {
      // remove all listeners
      Object.keys(handlers).forEach(handler =>
        videoEl.removeEventListener(handler, handlers[handler])
      )
      resolve()
    }
    const handlers = {
      play() {
        Log.info('Ad', 'Play ad', ad.url)
        fireOnConsumer('Play', ad)
        sendBeacon(ad.callbacks, 'defaultImpression')
      },
      ended() {
        fireOnConsumer('Ended', ad)
        sendBeacon(ad.callbacks, 'complete')
        cleanup()
      },
      timeupdate() {
        if (!timeEvents && videoEl.duration) {
          // calculate when to fire the time based events (now that duration is known)
          timeEvents = {
            firstQuartile: videoEl.duration / 4,
            midPoint: videoEl.duration / 2,
            thirdQuartile: (videoEl.duration / 4) * 3,
          }
          Log.info('Ad', 'Calculated quartiles times', { timeEvents })
        }
        if (
          timeEvents &&
          timeEvents.firstQuartile &&
          videoEl.currentTime >= timeEvents.firstQuartile
        ) {
          fireOnConsumer('FirstQuartile', ad)
          delete timeEvents.firstQuartile
          sendBeacon(ad.callbacks, 'firstQuartile')
        }
        if (timeEvents && timeEvents.midPoint && videoEl.currentTime >= timeEvents.midPoint) {
          fireOnConsumer('MidPoint', ad)
          delete timeEvents.midPoint
          sendBeacon(ad.callbacks, 'midPoint')
        }
        if (
          timeEvents &&
          timeEvents.thirdQuartile &&
          videoEl.currentTime >= timeEvents.thirdQuartile
        ) {
          fireOnConsumer('ThirdQuartile', ad)
          delete timeEvents.thirdQuartile
          sendBeacon(ad.callbacks, 'thirdQuartile')
        }
      },
      stalled() {
        fireOnConsumer('Stalled', ad)
        timeout = setTimeout(() => {
          cleanup()
        }, 5000) // make timeout configurable
      },
      canplay() {
        timeout && clearTimeout(timeout)
      },
      error() {
        fireOnConsumer('Error', ad)
        cleanup()
      },
      // this doesn't work reliably on sky box, moved logic to timeUpdate event
      // loadedmetadata() {
      //   // calculate when to fire the time based events (now that duration is known)
      //   timeEvents = {
      //     firstQuartile: videoEl.duration / 4,
      //     midPoint: videoEl.duration / 2,
      //     thirdQuartile: (videoEl.duration / 4) * 3,
      //   }
      // },
      abort() {
        cleanup()
      },
      // todo: pause, resume, mute, unmute beacons
    }
    // add all listeners
    Object.keys(handlers).forEach(handler => videoEl.addEventListener(handler, handlers[handler]))

    videoEl.play()
  })
}

const sendBeacon = (callbacks, event) => {
  if (callbacks && callbacks[event]) {
    Log.info('Ad', 'Sending beacon', event, callbacks[event])
    return callbacks[event].reduce((promise, url) => {
      return promise.then(() =>
        fetch(url)
          // always resolve, also in case of a fetch error (so we don't block firing the rest of the beacons for this event)
          // note: for fetch failed http responses don't throw an Error :)
          .then(response => {
            if (response.status === 200) {
              fireOnConsumer('Beacon' + event + 'Sent')
            } else {
              fireOnConsumer('Beacon' + event + 'Failed' + response.status)
            }
            Promise.resolve(null)
          })
          .catch(() => {
            Promise.resolve(null)
          })
      )
    }, Promise.resolve(null))
  } else {
    Log.info('Ad', 'No callback found for ' + event)
  }
}

const fireOnConsumer = (event, args) => {
  if (consumer) {
    consumer.fire('$ad' + event, args)
    consumer.fire('$adEvent', event, args)
  }
}

export default {
  get(config, videoPlayerConsumer) {
    if (config.enabled === false) {
      return Promise.resolve({
        prerolls() {
          return Promise.resolve()
        },
      })
    }
    consumer = videoPlayerConsumer

    return new Promise(resolve => {
      Log.info('Ad', 'Starting session')
      getAds(config).then(ads => {
        Log.info('Ad', 'API result', ads)
        resolve({
          prerolls() {
            if (ads.preroll) {
              state.active = true
              fireOnConsumer('PrerollSlotImpression', ads)
              sendBeacon(ads.preroll.callbacks, 'slotImpression')
              return playSlot(ads.preroll.ads).then(() => {
                fireOnConsumer('PrerollSlotEnd', ads)
                sendBeacon(ads.preroll.callbacks, 'slotEnd')
                state.active = false
              })
            }
            return Promise.resolve()
          },
          midrolls() {
            return Promise.resolve()
          },
          postrolls() {
            return Promise.resolve()
          },
        })
      })
    })
  },
  cancel() {
    Log.info('Ad', 'Cancel Ad')
    state.active = false
  },
  stop() {
    Log.info('Ad', 'Stop Ad')
    state.active = false
    // fixme: duplication
    const videoEl = document.getElementsByTagName('video')[0]
    videoEl.pause()
    videoEl.removeAttribute('src')
  },
}
