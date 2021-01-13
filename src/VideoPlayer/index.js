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

import Metrics from '../Metrics'
import Log from '../Log'
import Ads from '../Ads/player'

import events from './events'
import autoSetupMixin from '../helpers/autoSetupMixin'
import easeExecution from '../helpers/easeExecution'
import { ApplicationInstance } from '../Launch'
import Settings from '../Settings'
import VideoTexture from './VideoTexture'

export let mediaUrl = url => url
let videoEl
let videoTexture
let metrics
let consumer
let precision = 1
let textureMode = false

export const initVideoPlayer = config => {
  if (config.mediaUrl) {
    mediaUrl = config.mediaUrl
  }
}

// todo: add this in a 'Registry' plugin
// to be able to always clean this up on app close
let eventHandlers = {}

const state = {
  adsEnabled: false,
  playing: false,
  _playingAds: false,
  get playingAds() {
    return this._playingAds
  },
  set playingAds(val) {
    if (this._playingAds !== val) {
      this._playingAds = val
      fireOnConsumer(val === true ? 'AdStart' : 'AdEnd')
    }
  },
  skipTime: false,
  playAfterSeek: null,
}

const hooks = {
  play() {
    state.playing = true
  },
  pause() {
    state.playing = false
  },
  seeked() {
    state.playAfterSeek === true && videoPlayerPlugin.play()
    state.playAfterSeek = null
  },
  abort() {
    deregisterEventListeners()
  },
}

const withPrecision = val => Math.round(precision * val) + 'px'

const fireOnConsumer = (event, args) => {
  if (consumer) {
    consumer.fire('$videoPlayer' + event, args, videoEl.currentTime)
    consumer.fire('$videoPlayerEvent', event, args, videoEl.currentTime)
  }
}

const fireHook = (event, args) => {
  hooks[event] && typeof hooks[event] === 'function' && hooks[event].call(null, event, args)
}

export const setupVideoTag = () => {
  const videoEls = document.getElementsByTagName('video')
  if (videoEls && videoEls.length) {
    return videoEls[0]
  } else {
    const videoEl = document.createElement('video')
    videoEl.setAttribute('id', 'video-player')
    videoEl.setAttribute('width', withPrecision(1920))
    videoEl.setAttribute('height', withPrecision(1080))
    videoEl.setAttribute('crossorigin', 'anonymous')
    videoEl.style.position = 'absolute'
    videoEl.style.zIndex = '1'
    videoEl.style.display = 'none'
    videoEl.style.visibility = 'hidden'
    videoEl.style.top = withPrecision(0)
    videoEl.style.left = withPrecision(0)
    videoEl.style.width = withPrecision(1920)
    videoEl.style.height = withPrecision(1080)
    document.body.appendChild(videoEl)
    return videoEl
  }
}

export const setUpVideoTexture = () => {
  if (!ApplicationInstance.tag('VideoTexture')) {
    const el = ApplicationInstance.stage.c({
      type: VideoTexture,
      ref: 'VideoTexture',
      zIndex: 0,
      videoEl,
    })
    ApplicationInstance.childList.addAt(el, 0)
  }
  return ApplicationInstance.tag('VideoTexture')
}

const registerEventListeners = () => {
  Log.info('VideoPlayer', 'Registering event listeners')
  Object.keys(events).forEach(event => {
    const handler = e => {
      // Fire a metric for each event (if it exists on the metrics object)
      if (metrics && metrics[event] && typeof metrics[event] === 'function') {
        metrics[event]({ currentTime: videoEl.currentTime })
      }
      // fire an internal hook
      fireHook(event, { videoElement: videoEl, event: e })

      // fire the event (with human friendly event name) to the consumer of the VideoPlayer
      fireOnConsumer(events[event], { videoElement: videoEl, event: e })
    }

    eventHandlers[event] = handler
    videoEl.addEventListener(event, handler)
  })
}

const deregisterEventListeners = () => {
  Log.info('VideoPlayer', 'Deregistering event listeners')
  Object.keys(eventHandlers).forEach(event => {
    videoEl.removeEventListener(event, eventHandlers[event])
  })
  eventHandlers = {}
}

const videoPlayerPlugin = {
  consumer(component) {
    consumer = component
  },

  position(top = 0, left = 0) {
    videoEl.style.left = withPrecision(left)
    videoEl.style.top = withPrecision(top)
    if (textureMode === true) {
      videoTexture.position(top, left)
    }
  },

  size(width = 1920, height = 1080) {
    videoEl.style.width = withPrecision(width)
    videoEl.style.height = withPrecision(height)
    videoEl.width = parseFloat(videoEl.style.width)
    videoEl.height = parseFloat(videoEl.style.height)
    if (textureMode === true) {
      videoTexture.size(width, height)
    }
  },

  area(top = 0, right = 1920, bottom = 1080, left = 0) {
    this.position(top, left)
    this.size(right - left, bottom - top)
  },

  open(url, details = {}) {
    if (!this.canInteract) return
    metrics = Metrics.media(url)
    // prep the media url to play depending on platform
    url = mediaUrl(url)

    // if url is same as current clear (which is effectively a reload)
    if (this.src == url) {
      this.clear()
    }

    this.hide()
    deregisterEventListeners()

    // preload the video to get duration (for ads)
    //.. currently actually not working because loadedmetadata didn't work reliably on Sky boxes
    videoEl.setAttribute('src', url)
    videoEl.load()

    // const onLoadedMetadata = () => {
    // videoEl.removeEventListener('loadedmetadata', onLoadedMetadata)
    const config = { enabled: state.adsEnabled, duration: 300 } // this.duration ||
    if (details.videoId) {
      config.caid = details.videoId
    }
    Ads.get(config, consumer).then(ads => {
      state.playingAds = true
      ads.prerolls().then(() => {
        state.playingAds = false
        registerEventListeners()
        if (this.src !== url) {
          videoEl.setAttribute('src', url)
          videoEl.load()
        }
        this.show()
        setTimeout(() => {
          this.play()
        })
      })
    })
    // }

    // videoEl.addEventListener('loadedmetadata', onLoadedMetadata)
  },

  reload() {
    if (!this.canInteract) return
    const url = videoEl.getAttribute('src')
    this.close()
    this.open(url)
  },

  close() {
    Ads.cancel()
    if (state.playingAds) {
      state.playingAds = false
      Ads.stop()
      // call self in next tick
      setTimeout(() => {
        this.close()
      })
    }
    if (!this.canInteract) return
    this.clear()
    this.hide()
    deregisterEventListeners()
  },

  clear() {
    if (!this.canInteract) return
    // pause the video first to disable sound
    this.pause()
    if (textureMode === true) videoTexture.stop()
    fireOnConsumer('Clear', { videoElement: videoEl })
    videoEl.removeAttribute('src')
    videoEl.load()
  },

  play() {
    if (!this.canInteract) return
    if (textureMode === true) videoTexture.start()
    videoEl.play()
  },

  pause() {
    if (!this.canInteract) return
    videoEl.pause()
  },

  playPause() {
    if (!this.canInteract) return
    this.playing === true ? this.pause() : this.play()
  },

  mute(muted = true) {
    if (!this.canInteract) return
    videoEl.muted = muted
  },

  loop(looped = true) {
    videoEl.loop = looped
  },

  seek(time) {
    if (!this.canInteract) return
    if (!this.src) return
    // define whether should continue to play after seek is complete (in seeked hook)
    if (state.playAfterSeek === null) {
      state.playAfterSeek = !!state.playing
    }
    // pause before actually seeking
    this.pause()
    // currentTime always between 0 and the duration of the video (minus 0.1s to not set to the final frame and stall the video)
    videoEl.currentTime = Math.max(0, Math.min(time, this.duration - 0.1))
  },

  skip(seconds) {
    if (!this.canInteract) return
    if (!this.src) return

    state.skipTime = (state.skipTime || videoEl.currentTime) + seconds
    easeExecution(() => {
      this.seek(state.skipTime)
      state.skipTime = false
    }, 300)
  },

  show() {
    if (!this.canInteract) return
    if (textureMode === true) {
      videoTexture.show()
    } else {
      videoEl.style.display = 'block'
      videoEl.style.visibility = 'visible'
    }
  },

  hide() {
    if (!this.canInteract) return
    if (textureMode === true) {
      videoTexture.hide()
    } else {
      videoEl.style.display = 'none'
      videoEl.style.visibility = 'hidden'
    }
  },

  enableAds(enabled = true) {
    state.adsEnabled = enabled
  },

  /* Public getters */
  get duration() {
    return videoEl && (isNaN(videoEl.duration) ? Infinity : videoEl.duration)
  },

  get currentTime() {
    return videoEl && videoEl.currentTime
  },

  get muted() {
    return videoEl && videoEl.muted
  },

  get looped() {
    return videoEl && videoEl.loop
  },

  get src() {
    return videoEl && videoEl.getAttribute('src')
  },

  get playing() {
    return state.playing
  },

  get playingAds() {
    return state.playingAds
  },

  get canInteract() {
    // todo: perhaps add an extra flag wether we allow interactions (i.e. pauze, mute, etc.) during ad playback
    return state.playingAds === false
  },

  get top() {
    return videoEl && parseFloat(videoEl.style.top)
  },

  get left() {
    return videoEl && parseFloat(videoEl.style.left)
  },

  get bottom() {
    return videoEl && parseFloat(videoEl.style.top - videoEl.style.height)
  },

  get right() {
    return videoEl && parseFloat(videoEl.style.left - videoEl.style.width)
  },

  get width() {
    return videoEl && parseFloat(videoEl.style.width)
  },

  get height() {
    return videoEl && parseFloat(videoEl.style.height)
  },

  get visible() {
    if (textureMode === true) {
      return videoTexture.isVisible
    } else {
      return videoEl && videoEl.style.display === 'block'
    }
  },

  get adsEnabled() {
    return state.adsEnabled
  },

  // prefixed with underscore to indicate 'semi-private'
  // because it's not recommended to interact directly with the video element
  get _videoEl() {
    return videoEl
  },
}

export default autoSetupMixin(videoPlayerPlugin, () => {
  precision =
    (ApplicationInstance &&
      ApplicationInstance.stage &&
      ApplicationInstance.stage.getRenderPrecision()) ||
    precision

  videoEl = setupVideoTag()

  textureMode = Settings.get('platform', 'textureMode', false)
  if (textureMode === true) {
    videoTexture = setUpVideoTexture()
  }
})
