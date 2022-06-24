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

import Lightning from '../Lightning'
import Log from '../Log'

export default class VideoTexture extends Lightning.Component {
  static _template() {
    return {
      Video: {
        alpha: 1,
        visible: false,
        pivot: 0.5,
        texture: { type: Lightning.textures.StaticTexture, options: {} },
      },
    }
  }

  set videoEl(v) {
    this._videoEl = v
  }

  get videoEl() {
    return this._videoEl
  }

  get videoView() {
    return this.tag('Video')
  }

  get videoTexture() {
    return this.videoView.texture
  }

  get isVisible() {
    return this.videoView.alpha === 1 && this.videoView.visible === true
  }

  _init() {
    this._createVideoTexture()
  }

  _createVideoTexture() {
    const stage = this.stage

    const gl = stage.gl
    const glTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, glTexture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    this.videoTexture.options = { source: glTexture, w: this.videoEl.width, h: this.videoEl.height }

    this.videoView.w = this.videoEl.width / this.stage.getRenderPrecision()
    this.videoView.h = this.videoEl.height / this.stage.getRenderPrecision()
  }

  start() {
    const stage = this.stage
    this._lastTime = 0
    if (!this._updateVideoTexture) {
      this._updateVideoTexture = () => {
        if (this.videoTexture.options.source && this.videoEl.videoWidth && this.active) {
          const gl = stage.gl

          const currentTime = new Date().getTime()
          const getVideoPlaybackQuality = this.videoEl.getVideoPlaybackQuality()

          // When BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DEBUGUTILS is not set in WPE, webkitDecodedFrameCount will not be available.
          // We'll fallback to fixed 30fps in this case.
          // As 'webkitDecodedFrameCount' is about to deprecate, check for the 'totalVideoFrames'
          const frameCount = getVideoPlaybackQuality
            ? getVideoPlaybackQuality.totalVideoFrames
            : this.videoEl.webkitDecodedFrameCount

          const mustUpdate = frameCount
            ? this._lastFrame !== frameCount
            : this._lastTime < currentTime - 30

          if (mustUpdate) {
            this._lastTime = currentTime
            this._lastFrame = frameCount
            try {
              gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source)
              gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videoEl)
              this._lastFrame = this.videoEl.webkitDecodedFrameCount
              this.videoView.visible = true

              this.videoTexture.options.w = this.videoEl.width
              this.videoTexture.options.h = this.videoEl.height
              const expectedAspectRatio = this.videoView.w / this.videoView.h
              const realAspectRatio = this.videoEl.width / this.videoEl.height

              if (expectedAspectRatio > realAspectRatio) {
                this.videoView.scaleX = realAspectRatio / expectedAspectRatio
                this.videoView.scaleY = 1
              } else {
                this.videoView.scaleY = expectedAspectRatio / realAspectRatio
                this.videoView.scaleX = 1
              }
            } catch (e) {
              Log.error('texImage2d video', e)
              this.stop()
            }
            this.videoTexture.source.forceRenderUpdate()
          }
        }
      }
    }
    if (!this._updatingVideoTexture) {
      stage.on('frameStart', this._updateVideoTexture)
      this._updatingVideoTexture = true
    }
  }

  stop() {
    const stage = this.stage
    stage.removeListener('frameStart', this._updateVideoTexture)
    this._updatingVideoTexture = false
    this.videoView.visible = false

    if (this.videoTexture.options.source) {
      const gl = stage.gl
      gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source)
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
  }

  position(top, left) {
    this.videoView.patch({
      x: left,
      y: top,
    })
  }

  size(width, height) {
    this.videoView.patch({
      w: width,
      h: height,
    })
  }

  show() {
    this.videoView.alpha = 1
  }

  hide() {
    this.videoView.alpha = 0
  }
}
