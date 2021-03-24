import loader from './loader'
import { isFunction, isObject, isArray } from './utils'
import Audio from './audio'

let AudioCtx
let ctx
let gainNode
let buffers = new Map()
let initialized = false
let allSourceNodes = new Map()

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
  Audio.prototype._audioContext = ctx
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

  if (!sounds.length) {
    console.error('sounds array is empty')
  }

  if(!isObject(sounds[0]) && !(sounds.length % 2 === 0)) {
    console.error('sounds must power of 2')
  }

  const list = new Map()
  if(!isObject(sounds[0])){
    let n = sounds.length

      for (let i = 0; i < n; i += 2) {
        const identifier = sounds[i]
        if (!list.has(identifier) && !buffers.get(identifier)) {
          list.set(sounds[i], sounds[i + 1])
        } else {
          console.error(`Duplicate sounds: ${identifier}`)
        }
      }
  } else {
    sounds.forEach((sound, index) => {
      if(!Object.keys(sound).length){
        return
      }
      const identifier = Object.keys(sound)[0]
      if (!list.has(identifier)) {
        list.set(identifier, sound[identifier])
      } else {
        console.error(`Duplicate sounds: ${identifier}`)
      }
    })
  }

  const bufferList = await loader(ctx, list)

  if (bufferList.size) {
    buffers = new Map([...bufferList, ...buffers])
  }
}

const createAudioSource = (identifier) => {
  const source = ctx.createBufferSource()
  source.buffer = buffers.get(identifier)
  return source
}

const play =  (identifier) => {
  if(buffers.has(identifier)){
    const source = createAudioSource(identifier)
    const audio = new Audio()
    audio.sourceNode = source
    audio.duration = parseFloat(buffers.get(identifier).duration.toFixed(2))
    allSourceNodes.set(identifier, audio)
    return audio
  } else {
    console.error(`fx: ${identifier} not found`)
    return {}
  }
}

const loop = (identifier) => {
  const audio = play(identifier)
  audio.loop()
  return audio
}

const pause = async (identifier) => {
  if(allSourceNodes.has(identifier)){
    const audio = allSourceNodes.get(identifier)
    if(audio.playing){
      audio.pause()
    }
  } else {
    console.error(`${identifier} not playing`)
  }
}

const resume = async (identifier) => {

  if(allSourceNodes.has(identifier)){
    const audio = allSourceNodes.get(identifier)

    if(!audio.playing){
      const newSource = createAudioSource(identifier, audio.loop)
      audio.sourceNode = newSource
      audio.start()
    }
  }
}

const stop = async (identifier) => {
  if(allSourceNodes.has(identifier)){
    allSourceNodes.get(identifier).stop()
    allSourceNodes.delete(identifier)
  }
}

const pauseAll = async () => {
  if(ctx.state == 'running'){
    await ctx.suspend()
  }
}

const resumeAll = async() => {
  if(ctx.state == 'suspended'){
    await ctx.resume()
  }
}

const playAll = async(config) => {
  for(let identifier of buffers.keys()){
    const audio = play(identifier)
    if(isObject(config)){
      for(let key in config){
        audio[key](config[key])
      }
    }
    audio.start()
  }
}

const remove = async(identifier) => {
  if(buffers.has(identifier)){
    buffers.delete(identifier)
    if(allSourceNodes.has(identifier)){
      allSourceNodes.get(identifier).sourceNode.stop()
      allSourceNodes.delete(identifier)
    }
  } else {
    console.error(`${identifier} not found`)
  }
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
  pause,
  resume,
  stop,
  pauseAll,
  resumeAll,
  playAll,
  remove,
}
