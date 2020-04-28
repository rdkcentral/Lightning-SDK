import Lightning from '../Lightning'
import Metrics from '../Metrics'
import Log from '../Log'
import Ads from '../Ads'

import events from './events'

let mediaUrl = url => url

export const initMediaPlayer = config => {
  if (config.mediaUrl) {
    mediaUrl = config.mediaUrl
  }
}

export default class VideoPlayer extends Lightning.Component {
  /* Lightning lifecycle hooks */
  _construct() {
    this._eventHandlers = {}
    this._playing = false
    this._adsEnabled = false
    this._playingAds = false
  }

  _init() {
    this.videoEl = this.__setupVideoTag()
  }

  _attach() {
    if (!this._consumer) this._consumer = this.cparent
  }

  _detach() {
    this.__deregisterEventListeners()
    this.close()
  }

  /* VideoPlayer public API */
  consumer(consumer) {
    this._consumer = consumer
  }

  position(left = 0, top = 0) {
    this.videoEl.style.left = this.__withPrecision(left)
    this.videoEl.style.top = this.__withPrecision(top)
  }

  size(width = 1920, height = 1080) {
    this.videoEl.style.width = this.__withPrecision(width)
    this.videoEl.style.height = this.__withPrecision(height)
  }

  area(top = 0, left = 0, right = 1920, bottom = 1080) {
    this.videoEl.style.left = this.__withPrecision(top)
    this.videoEl.style.top = this.__withPrecision(left)
    this.videoEl.style.width = this.__withPrecision(left - right)
    this.videoEl.style.height = this.__withPrecision(top - bottom)
  }

  open(url, details = {}) {
    this._metrics = Metrics.media(url)
    // prep the media url to play depending on platform (mediaPlayerplugin)
    url = mediaUrl(url)

    this.hide()
    this.__deregisterEventListeners()

    // preload the video to get duration (for ads)
    this.videoEl.setAttribute('src', url)
    this.videoEl.load()

    this.videoEl.onloadedmetadata = () => {
      // unset own callback to prevent endless loop
      this.videoEl.onloadedmetadata = () => {}
      const config = { enabled: this._adsEnabled, duration: this.duration }
      if (details.videoId) {
        config.caid - details.videoId
      }
      Ads(config).then(ads => {
        this.__playingAds = true
        ads.prerolls().then(() => {
          this.__playingAds = false
          this.__registerEventListeners()
          if (this.src !== url) {
            this.videoEl.setAttribute('src', url)
            this.videoEl.load()
          }
          this.show()
          this.play()
        })
      })
    }
  }

  reload() {
    const url = this.videoEl.getAttribute('src')
    this.close()
    this.open(url)
  }

  close() {
    this.clear()
    this.hide()
    this.__deregisterEventListeners()
  }

  clear() {
    // pause the video first to disable sound
    this.pause()
    this.videoEl.removeAttribute('src')
    this.videoEl.load()
  }

  play() {
    if (!this.canInteract) return
    this.videoEl.play()
  }

  pause() {
    if (!this.canInteract) return
    this.videoEl.pause()
  }

  playPause() {
    if (!this.canInteract) return
    this._playing === true ? this.pause() : this.play()
  }

  mute(muted = true) {
    if (!this.canInteract) return
    this.videoEl.muted = muted
  }

  loop(looped = true) {
    this.videoEl.loop = looped
  }

  seek(time) {
    if (!this.canInteract) return
    if (!this.src) return
    this.videoEl.currentTime = Math.max(0, Math.min(time, this.duration))
  }

  skip(seconds) {
    if (!this.canInteract) return
    if (!this.src) return
    this.seek(this.videoEl.currentTime + seconds)
  }

  show() {
    if (!this.canInteract) return
    this.videoEl.style.display = 'block'
    this.videoEl.style.visibility = 'visible'
  }

  hide() {
    if (!this.canInteract) return
    this.videoEl.style.display = 'none'
    this.videoEl.style.visibility = 'hidden'
  }

  enableAds(enabled = true) {
    this._adsEnabled = enabled
  }

  /* Public getters */
  get duration() {
    return isNaN(this.videoEl.duration) ? Infinity : this.videoEl.duration
  }

  get currentTime() {
    return this.videoEl.currentTime
  }

  get muted() {
    return this.videoEl.muted
  }

  get looped() {
    return this.videoEl.loop
  }

  get src() {
    return this.videoEl.getAttribute('src')
  }

  get playing() {
    return this._playing
  }

  get playingAds() {
    return this._playingAds
  }

  get canInteract() {
    return this._playingAds === false // perhaps add an extra flag wether we allow interactions (i.e. pauze, mute, etc.) during ad playback
  }

  /* Private setters */
  set __playingAds(val) {
    this._playingAds = val
    this.__fireOnConsumer(val === true ? 'AdStart' : 'AdEnd')
  }

  /* Private callbacks */
  __play() {
    this._playing = true
  }

  __pause() {
    this._playing = false
  }

  /* Private helper methods */
  __setupVideoTag() {
    const videoEls = document.getElementsByTagName('video')
    if (videoEls && videoEls.length) {
      return videoEls[0]
    } else {
      const videoEl = document.createElement('video')
      videoEl.setAttribute('id', 'video-player')
      videoEl.setAttribute('width', this.__withPrecision(1920))
      videoEl.setAttribute('height', this.__withPrecision(1080))
      videoEl.style.position = 'absolute'
      videoEl.style.zIndex = '1'
      videoEl.style.display = 'none'
      videoEl.style.visibility = 'visible'
      document.body.appendChild(videoEl)
      return videoEl
    }
  }

  __registerEventListeners() {
    Log.info('Registering event listeners VideoPlayer')

    Object.keys(events).forEach(event => {
      const handler = e => {
        // Fire a metric for each event (if it exists on the metrics object)
        if (this._metrics[event] && typeof this._metrics[event] === 'function') {
          this._metrics[event]({ currentTime: this.currentTime })
        }
        // fire event to VideoPlayer class
        this.fire('__' + event, { videoElement: this.videoEl, event: e })
        // fire the event to the consumer of the VideoPlayer
        this.__fireOnConsumer(events[event], { videoElement: this.videoEl, event: e })
      }

      this._eventHandlers[event] = handler
      this.videoEl.addEventListener(event, handler)
    })
  }

  __deregisterEventListeners() {
    Log.info('Deregistering event listeners MediaPlayer')
    Object.keys(this._eventHandlers).forEach(event => {
      this.videoEl.removeEventListener(event, this._eventHandlers[event])
    })
    this._eventHandlers = {}
  }

  __withPrecision(val) {
    return Math.round(this.stage.getRenderPrecision() * val) + 'px'
  }

  __fireOnConsumer(event, args) {
    if (this._consumer) {
      this._consumer.fire('$videoPlayer' + event, args)
    }
  }
}
