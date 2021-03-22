import loader from './loader'
import { isFunction, isObject, isArray } from './utils'

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

const createAudioSource = config => {
  const { identifier, offset, volume = 1.0, loop = false } = config

  const source = ctx.createBufferSource()
  source.buffer = buffers.get(identifier)

  if (gainNode) {
    gainNode.gain.value = volume
    gainNode.connect(ctx.destination)
    source.connect(gainNode)
    gainNode.connect(ctx.destination)
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
      let sourceData, source
      let props = {}

      if(allSourceNodes.has(identifier)){
        sourceData = allSourceNodes.get(identifier)
        sourceData.node.stop()
        props = sourceData.metadata
      } else {
        sourceData = {}
        props.duration = parseFloat(buffers.get(config.identifier).duration.toFixed(2))
      }

      source = createAudioSource(config)

      if(ctx.state == 'suspended') ctx.resume()

      source.start(0, config.offset)
      props.lastStartedAt = parseFloat(ctx.currentTime.toFixed(2))
      props.playing = true
      props.offset = config.offset ?  config.offset : 0
      props.volume = config.volume
      props.loop = config.loop

      sourceData.node = source
      sourceData.metadata = props
      allSourceNodes.set(config.identifier, sourceData)

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

const pause = async (identifier) => {
  if(allSourceNodes.has(identifier)){
    const sourceData = allSourceNodes.get(identifier)

    if(sourceData.metadata.playing){
      sourceData.node.stop()
      const pausedAt =  parseFloat(ctx.currentTime.toFixed(2));
      const props = sourceData.metadata
      const playedTime = parseFloat((pausedAt - props.lastStartedAt).toFixed(2))
      let offset;
      if(props.loop && playedTime > props.duration){
        const numOfLoops = Math.floor((playedTime + props.offset)/props.duration)
        offset = parseFloat(((playedTime + props.offset) - numOfLoops * props.duration).toFixed(2))
      } else {
        offset = parseFloat((props.offset + playedTime).toFixed(2))
        if(props.loop &&  offset > props.duration){
          offset = parseFloat((offset - props.duration).toFixed(2))
        }
      }

      props.playing = false
      props.offset = offset
      sourceData.metadata = props
      allSourceNodes.set(identifier, sourceData)
    }
  } else {
    console.error(`${identifier} not playing`)
  }
}

const resume = async (identifier) => {
  if(allSourceNodes.has(identifier)){
    const sourceData = allSourceNodes.get(identifier)
    const source = sourceData.node
    const props = sourceData.metadata

    if(!props.playing){

      const config = {
        identifier,
        volume : props.volume,
        loop: props.loop
      }

      const newSource = createAudioSource(config)
      newSource.start(0, props.offset)

      props.lastStartedAt = parseFloat(ctx.currentTime.toFixed(2))
      props.playing = true
      sourceData.node = newSource
      sourceData.metadata = props
      allSourceNodes.set(identifier, sourceData)
    }
  }
}

const stop = async (identifier) => {
  if(allSourceNodes.has(identifier)){
    const source = allSourceNodes.get(identifier).node
    source.stop()
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

const playAll = async(volume, offset = 0, loop = false) => {

  for(let identifier of buffers.keys()){
    let config = {
      identifier,
      volume,
      offset,
      loop
    }
    play(config)
  }
}

const remove = async(identifier) => {
  if(buffers.has(identifier)){
    buffers.delete(identifier)
    if(allSourceNodes.has(identifier)){
      allSourceNodes.get(identifier).node.stop()
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
  remove
}
