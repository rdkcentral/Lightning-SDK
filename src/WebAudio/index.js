import loader from './loader'
import { isFunction, isObject, isArray } from './utils'

let AudioCtx
let ctx
let gainNode
let buffers = new Map()
let initialized = false

/**
 * Platform van override AudioContext constructor
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
    if (isFunction(ctx.createGain)) {
      gainNode = ctx.createGain()
    }
  }
  initialized = true
}

/**
 * Start sound loading processs; optional provide
 * an context instance
 * @param config
 * @returns {Promise<void>}
 */
const load = async (config = {}) => {
  if (config.audioContext) {
    ctx = config.audioContext
  }
  if (!initialized) {
    init()
  }
  if (config.sounds) {
    await processSounds(config.sounds)
  }
}

const processSounds = async sounds => {
  if (!isArray(sounds)) {
    console.error('Sounds must be an array')
  }

  if (!sounds.length || !(sounds.length % 2 === 0)) {
    console.error('sounds must power of 2')
  }

  const list = new Map()
  let n = sounds.length

  for (let i = 0; i < n; i += 2) {
    const identifier = sounds[i]
    if (!list.has(identifier) && !buffers.get(identifier)) {
      list.set(sounds[i], sounds[i + 1])
    } else {
      console.error(`Duplicate sounds: ${identifier}`)
    }
  }
  const bufferList = await loader(ctx, list)

  if (bufferList.size) {
    buffers = new Map([...bufferList, ...buffers])
  }
}

const createAudioSource = config => {
  const { identifier, offset, volume = 1.0, loop = false } = config

  const source = ctx.createBufferSource()
  source.buffer = buffers.get(identifier)

  if (gainNode) {
    gainNode.gain.value = volume
    gainNode.connect(ctx.destination)
    source.connect(gainNode)
  } else {
    source.connect(ctx.destination)
  }

  source.loop = loop
  return source
}

const play = (identifier, offset = 0, volume) => {
  let config = identifier

  // support for config object
  if (!isObject(config)) {
    config = {
      identifier,
      offset,
      volume,
    }
  }
  return new Promise((resolve, reject) => {
    if (buffers.has(config.identifier)) {
      const source = createAudioSource(config)
      source.start(config.offset)
      // if we're not looping we're waiting for onended
      // event and then resolve; in case of a loop
      // we return the AudioBufferSource
      if (!config.loop) {
        source.onended = () => {
          resolve()
        }
      } else {
        resolve(source)
      }
    } else {
      reject(`fx: ${config.identifier} not found`)
    }
  })
}

const loop = async (identifier, volume) => {
  let config = identifier
  if (!isObject(config)) {
    config = {
      identifier,
      volume,
      loop: true,
    }
  }
  return await play(config)
}

export default {
  load,
  play,
  loop,
  getBuffers: () => {
    return new Map(buffers)
  },
  isReady: () => {
    return initialized
  },
}
