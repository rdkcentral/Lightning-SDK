import Lightning from '../Lightning'
import Metrics from '../Metrics'
import Log from '../Log'
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
    this._eventHandlers = []
    this._playing = false
  }

  _init() {
    this.videoEl = this.__setupVideoTag()
  }

  _attach() {
    if (!this._consumer) this._consumer = this.cparent
    this.__registerEventListeners()
  }

  _detach() {
    this.__deRegisterEventListeners()
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

  open(url) {
    // prep the media url to play depending on platform (mediaPlayerplugin)
    url = mediaUrl(url)
    this._metrics = Metrics.media(url)
    this.videoEl.setAttribute('src', url)
    this.videoEl.load()
    this.show()
    this.play()
  }

  reload() {
    const url = this.videoEl.getAttribute('src')
    this.close()
    this.open(url)
  }

  close() {
    // pause the video first to disable sound
    this.pause()
    this.videoEl.removeAttribute('src')
    this.videoEl.load()
    this.hide()
  }

  play() {
    this.videoEl.play()
  }

  pause() {
    this.videoEl.pause()
  }

  playPause() {
    this._playing === true ? this.pause() : this.play()
  }

  mute(muted = true) {
    this.videoEl.muted = muted
  }

  loop(looped = true) {
    this.videoEl.loop = looped
  }

  seek(time) {
    if (!this.src) return
    this.videoEl.currentTime = Math.max(0, Math.min(time, this.duration))
  }

  skip(seconds) {
    if (!this.src) return
    this.seek(this.videoEl.currentTime + seconds)
  }

  show() {
    this.videoEl.style.display = 'block'
    this.videoEl.style.visibility = 'visible'
  }

  hide() {
    this.videoEl.style.display = 'none'
    this.videoEl.style.visibility = 'hidden'
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
      videoEl.setAttribute('width', '1920px')
      videoEl.setAttribute('height', '1080px')
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

      this._eventHandlers.push(handler)
      this.videoEl.addEventListener(event, handler)
    })
  }

  __deregisterEventListeners() {
    Log.info('Deregistering event listeners MediaPlayer')
    events.forEach((event, index) => {
      this.videoEl.removeEventListener(event, this._eventHandlers[index])
    })
    this._eventHandlers = []
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
