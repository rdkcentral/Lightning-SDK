import Log from '../Log'

let getAds = () => {
  // todo: enable some default ads during development, maybe from the settings.json
  return Promise.resolve({
    prerolls: [],
    midrolls: [],
    postrolls: [],
  })
}

export const initAds = config => {
  getAds = config.getAds
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
    // is it safe to rely on videoplayer plugin already created the video tag?
    const videoEl = document.getElementsByTagName('video')[0]
    videoEl.style.display = 'block'
    videoEl.style.visibility = 'visible'
    videoEl.src = ad.url

    let timeEvents = {}

    videoEl.onloadedmetadata = () => {
      // calculate when to fire the time based events (now that duration is known)
      timeEvents = {
        firstQuartile: videoEl.duration / 4,
        midPoint: videoEl.duration / 2,
        thirdQuartile: (videoEl.duration / 4) * 3,
      }
      // unset callback
      videoEl.onloadedmetadata = () => {}
    }

    const handlers = {
      play() {
        Log.info('Ad', 'Play ad', ad.url)
        sendBeacon(ad.callbacks, 'defaultImpression')
      },
      ended() {
        sendBeacon(ad.callbacks, 'complete')
        // remove all listeners
        Object.keys(handlers).forEach(handler =>
          videoEl.removeEventListener(handler, handlers[handler])
        )
        resolve()
      },
      timeupdate() {
        if (timeEvents.firstQuartile && videoEl.currentTime >= timeEvents.firstQuartile) {
          delete timeEvents.firstQuartile
          sendBeacon(ad.callbacks, 'firstQuartile')
        }
        if (timeEvents.midPoint && videoEl.currentTime >= timeEvents.midPoint) {
          delete timeEvents.midPoint
          sendBeacon(ad.callbacks, 'midPoint')
        }
        if (timeEvents.thirdQuartile && videoEl.currentTime >= timeEvents.thirdQuartile) {
          delete timeEvents.thirdQuartile
          sendBeacon(ad.callbacks, 'thirdQuartile')
        }
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
          // just resolve in case of a fetch error (so we don't block firing the rest of the beacons for this event)
          .catch(() => Promise.resolve(null))
      )
    }, Promise.resolve(null))
  } else {
    Log.info('Ad', 'No callback found for ' + event)
  }
}

export default config => {
  if (config.enabled === false)
    return Promise.resolve({
      prerolls() {
        return Promise.resolve()
      },
    })

  return new Promise(resolve => {
    Log.info('Ad', 'Starting session')
    getAds(config).then(ads => {
      Log.info('Ad', 'API result', ads)
      resolve({
        prerolls() {
          if (ads.preroll) {
            sendBeacon(ads.preroll.callbacks, 'slotImpression')
            return playSlot(ads.preroll.ads).then(() => {
              sendBeacon(ads.preroll.callbacks, 'slotEnd')
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
}
