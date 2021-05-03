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

import loader from './loader'
import { isFunction, isObject, isArray } from './utils'
import { WebAudio, HTMLAudio } from './audio'
import { CompressorParams, FilterParams, PannerParams } from './audioParams'
import WebAudioListener from './WebAudioListener'

let AudioCtx
let ctx
let buffers = new Map()
let initialized = false
let allAudioInstances = new Map()
let effectsBuffers = new Map()
let isAudioContextAvailable = false
let listener
let selectedAudios

if (window.AudioContext || window.webkitAudioContext) {
  isAudioContextAvailable = true
}

/**
 * Platform can override AudioContext constructor
 * @param config
 */
export const initWebAudio = config => {
  if (config.AudioContext) {
    AudioCtx = config.AudioContext
  }
}

const init = () => {
  // if load provided an AudioContext instance
  // we skip creating instance
  if (!ctx) {
    window.AudioContext = AudioCtx || window.AudioContext || window.webkitAudioContext
    ctx = new AudioContext()
  }
  WebAudio.prototype._audioContext = ctx
  initialized = true
}

/**
 * Start sound loading processs; optional provide
 * an context instance
 * @param config
 */
const load = async (config = {}) => {
  if (config.audioContext) {
    ctx = config.audioContext
  }
  if (!initialized && isAudioContextAvailable) {
    init()
  }
  if (config.sounds) {
    await processSounds(config.sounds)
  }
}

const processSounds = async sounds => {
  if (!isArray(sounds) || !sounds.length) {
    console.error('Sounds must be an array with valid length')
    return
  }

  if (!isObject(sounds[0]) && !(sounds.length % 2 === 0)) {
    console.error('Sounds must power of 2')
    return
  }

  const list = new Map()
  if (!isObject(sounds[0])) {
    let n = sounds.length

    for (let i = 0; i < n; i += 2) {
      const identifier = sounds[i]
      if (!list.has(identifier) && !allAudioInstances.has(identifier)) {
        list.set(sounds[i], sounds[i + 1])
      } else {
        console.error(`Duplicate sounds: ${identifier}`)
      }
    }
  } else {
    sounds.forEach((sound, index) => {
      if (!Object.keys(sound).length) {
        return
      }
      const identifier = Object.keys(sound)[0]
      if (!list.has(identifier) && !allAudioInstances.has(identifier)) {
        list.set(identifier, sound[identifier])
      } else {
        console.error(`Duplicate sounds: ${identifier}`)
      }
    })
  }

  if (isAudioContextAvailable) {
    const bufferList = await loader(ctx, list)
    if (bufferList.size) {
      buffers = new Map([...bufferList, ...buffers])
    }
    WebAudio.prototype._audioBuffers = buffers
  }

  for (const [identifier, url] of list.entries()) {
    let audio;
    if (isAudioContextAvailable && buffers.has(identifier)) {
      audio = new WebAudio(identifier)
      audio.duration = parseFloat(buffers.get(identifier).duration.toFixed(2))
    } else {
      audio = new HTMLAudio(identifier, url)
    }
    allAudioInstances.set(identifier, audio)
  }
  selectedAudios = new Map(allAudioInstances)
}

/**
 * Load the configured effects
 * @param  effects
 */
const loadEffects = async (effects) => {
  if (!isAudioContextAvailable) {
    console.info('load effects not supported')
    return
  }
  if (!isArray(effects)) {
    console.error('Effects must be an array')
    return
  }
  const list = new Map()
  effects.forEach((effect, index) => {
    if (!Object.keys(effect).length) {
      return
    }
    const identifier = Object.keys(effect)[0]
    if (!list.has(identifier)) {
      list.set(identifier, effect[identifier])
    } else {
      console.error(`Duplicate effect: ${identifier}`)
    }
  })

  const bufferList = await loader(ctx, list)

  if (bufferList.size) {
    effectsBuffers = new Map([...bufferList, ...effectsBuffers])
  }
  WebAudio.prototype._effectsBuffers = effectsBuffers
}

/**
 * Create instance of Audio and return it
 * @param {string} identifier
 */
const getAudio = (identifier) => {
  if (allAudioInstances.has(identifier)) {
    return allAudioInstances.get(identifier)
  } else {
    console.error(`fx: ${identifier} audio not found`)
  }
}

/**
 * Set the settings on each audio
 * @param {Object} config The settings config
 * @param {Array} identifiers The list of audio identifiers
 */
const setSettings = (config, identifiers) => {

  selectedAudios = new Map(allAudioInstances)

  if (identifiers) {
    if (isArray(identifiers) && identifiers.length) {
      selectedAudios = new Map()
      allAudioInstances.forEach((value, key) => {
        if (identifiers.indexOf(key) !== -1) {
          selectedAudios.set(key, value)
        }
      })
    } else {
      console.warn('Identifiers must be an array with valid length')
    }
  }

  selectedAudios.forEach(audio => {
    if (audio) {
      audio.reset()
      if (config && isObject(config)) {
        for (let prop in config) {
          isArray(config[prop]) ? audio[prop](...config[prop]) : audio[prop](config[prop])
        }
      }
    }
  })
}

/**
 * Play the selected audios
 */
const play = async () => {

  selectedAudios.forEach(audio => {
    audio.play()
  })
}

/**
 * Stop the all playing audios
 */
const stop = async () => {
  selectedAudios.forEach(audio => {
    audio.stop()
  })
}

/**
 * Pause all playing audios
 */
const pause = async () => {
  selectedAudios.forEach(audio => {
    audio.pause()
  })
}

/**
 * Resume the audios from paused state
 */
const resume = async () => {
  selectedAudios.forEach(audio => {
    audio.resume()
  })
}

/**
 * Reset the audios to initial state
 */
const reset = async () => {
  selectedAudios.forEach(audio => {
    audio.reset()
  })
  selectedAudios = new Map(allAudioInstances)
}

/**
 * Reset the audios to initial state
 */
const reset = async () => {
  for (const audio of selectedAudios.values()){
    audio.reset()
  }
  selectedAudios = new Map(allAudioInstances)
}

/**
 * Remove the buffers and audio instances of specified identifier or all
 * @param {Array} identifiers The array of identifiers
 */
const remove = async (identifiers) => {
  if (identifiers) {
    if (isArray(identifiers)) {
      identifiers.forEach(id => {
        allAudioInstances.get(id).stop()
        allAudioInstances.delete(id)
        buffers.delete(id)
      })
    } else {
      console.error('Identifiers must be an array')
    }
  } else {
    allAudioInstances.forEach(audio => {
      audio.stop()
    })
    buffers = new Map()
    allAudioInstances = new Map()
  }
}

/**
 * Remove the effect buffers of given identifiers or all
 * @param {Array} identifiers The array of identifiers
 */
const removeEffects = async (identifiers) => {

  if (!effectsBuffers.size) {
    console.info('Effects are not loaded into application')
    return
  }

  let keys = Array.from(effectsBuffers.keys())

  if (identifiers) {
    if (isArray(identifiers)) {
      keys = identifiers
    } else {
      console.error('Identifiers must be an array')
      return
    }
  }

  keys.forEach(key => {
    effectsBuffers.delete(key)
  })
}

const getListener = () => {
  if (isAudioContextAvailable) {
    if (!listener) {
      listener = new WebAudioListener(ctx)
    }
    return listener
  }
  console.warn('Audio context not available')
}

export default {
  initWebAudio,
  load,
  getAudio,
  setSettings,
  play,
  getBuffers: () => {
    return new Map(buffers)
  },
  isReady: () => {
    return initialized
  },
  pause,
  resume,
  stop,
  reset,
  remove,
  loadEffects,
  removeEffects,
  CompressorParams,
  FilterParams,
  PannerParams,
  getListener
}
