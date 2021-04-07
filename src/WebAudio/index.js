import loader from './loader'
import { isFunction, isObject, isArray } from './utils'
import Audio from './audio'

let AudioCtx
let ctx
let buffers = new Map()
let initialized = false
let allAudioInstances = new Map()
let effectsBuffers = new Map()

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
  Audio.prototype._audioContext = ctx
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
      if (!list.has(identifier) && !buffers.has(identifier)) {
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
  Audio.prototype._audioBuffers = buffers
}

/**
 * Load the configured effects
 * @param  effects
 */
const loadEffects = async (effects) => {

    if(!isArray(effects)){
      console.error('Effects must be an array')
    }
    const list = new Map()
    effects.forEach((effect, index) => {
      if(!Object.keys(effect).length){
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
    Audio.prototype._effectsBuffers = effectsBuffers
  }

const createAudioSource = (identifier) => {
  const source = ctx.createBufferSource()
  source.buffer = buffers.get(identifier)
  return source
}

const getAudio = (identifier) => {
  if(allAudioInstances.has(identifier)){
    return allAudioInstances.get(identifier)
  } else {
    if(buffers.has(identifier)){
      const audio = new Audio(identifier)
      audio.duration = parseFloat(buffers.get(identifier).duration.toFixed(2))
      allAudioInstances.set(identifier, audio)
      return audio
    } else {
      console.error(`fx: ${identifier} not found`)
    }
  }
}

const play =  async (config) => {
 for(let key of buffers.keys()){
   const audio = getAudio(key)
   if(audio){
      audio.reset()
      if(config && isObject(config)){
        for(let prop in config){
          audio[prop](config[prop])
        }
      }
      audio.play()
   }
 }
}

const stop = async () => {
  for(const audio of allAudioInstances.values()){
    audio.stop()
  }
}

const pause = async () => {
  for( const audio of allAudioInstances.values()){
    audio.pause()
  }
}

const resume = async() => {
  for (const audio of allAudioInstances.values()){
    audio.resume()
  }
}

const remove = async(identifiers) => {
  if(identifiers){
    if(!isArray(identifiers)){
      console.error('Identifiers must be an array')
    }
    for(let id of identifiers){
      allAudioInstances.get(id).stop()
      allAudioInstances.delete(id)
      buffers.delete(id)
    }
  } else {
    allAudioInstances.forEach((value, key) => {
      value.stop()
    })
    buffers = new Map()
    allAudioInstances = new Map()
  }
}

const removeEffects = async(identifiers) => {
  let keys
  if(identifiers){
    if(!isArray(identifiers)){
      console.error('Identifiers must be an array')
    }
    keys = identifiers
  } else {
    keys = Array.from(effectsBuffers.keys())
  }
  keys.forEach( key => {
    effectsBuffers.delete(key)
  })
}

export default {
  initWebAudio,
  load,
  getAudio,
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
  remove,
  loadEffects,
  removeEffects
}
