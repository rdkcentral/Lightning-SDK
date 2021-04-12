import BaseAudio from './BaseAudio'
import { CompressorParams, FilterParams } from './../audioParams'
import { isArray } from './../utils'

/**
 * @class Audio representing audio processing APIs
 */
export default class WebAudio extends BaseAudio {

    /**
     * Create a Audio
     * @param {string} identifier The unique identifier for audio
     */
    constructor(identifier) {
        super()
        this._identifier = identifier
        this._initOffset = 0
        this._currentOffset = 0
        this._nodes = new Map()
        this._createEntryForDelayNode()
    }

    /**
     * Create delay node as the first item in Map
     */
    _createEntryForDelayNode(){
        this._nodes.set("delay", null)
    }

    set duration(v){
        this._duration = v
    }

    get playing(){
        return this._playing
    }

    /**
     * Set the offset on audio to start audio from given playback time
     * @param {number} v The time in seconds to be skipped
     */
    skip(v){
        if(this._validate("skip", v, [0, this._duration])){
            this._initOffset = v
            this._currentOffset = v
        }
        return this
    }

    /**
     * To play the audio one time or multiple times
     * @param {Boolean} v The boolean value to configure audio would play continuously or not
     */
    loop(v = true){
        this._loop = v
        return this
    }

    /**
     * To play the audio at specified volume
     * @param {number} v The gain to be apply
     */
    volume(v){
        if(this._validate("volume", v)){
            if(this._nodes.has("gain")){
                this._nodes.get("gain").gain.value = v
            } else {
                const gainNode = this._audioContext.createGain()
                gainNode.gain.value = v
                this._nodes.set("gain", gainNode)
            }
        }
        return this
    }

    /**
     * To introduce delay at start of audio
     * @param {number} delay The delay time in seconds
     */
    delay(delay){
        if(this._validate("delay", delay, [0, 179])){
            const delayNode =  this._audioContext.createDelay(delay)
            delayNode.delayTime.value = delay
            this._nodes.set("delay", delayNode)
        }
        return this
    }

    /**
     * Create buffer source node and set the corresponding buffer
     */
    _createAudioSource(){
        this._sourceNode = this._audioContext.createBufferSource()
        this._sourceNode.buffer = this._audioBuffers.get(this._identifier)
        if(this._loop){
            this._sourceNode.loop = this._loop
        }
    }

   /**
    * Build the audio graph by adding configured intermidiate nodes between
    * source node and destination node then start playing the audio
    */
    play(){
        try{
            this._createAudioSource()
            let finalNode = this._sourceNode

            for(const node of this._nodes.values()){
                if(node == null){
                    continue
                }
                finalNode.connect(node)
                finalNode = node
            }
            finalNode.connect(this._audioContext.destination)
            this._startPlayback(this._initOffset)

            this._isDelayNodeRemovedOnResume = false
            this._isAudioGraphConstructed = true
        } catch(err){
            console.error(`Failed to start ${this._identifier} sound`)
        }
    }

    /**
     * Start the audio with given offset
     * @param {number} offset The number of seconds to be skipped
     */
    _startPlayback(offset){
        this._sourceNode.start(0, offset)
        this._lastStartedAt = parseFloat((this._audioContext.currentTime).toFixed(2))
        this._playing = true
        this._sourceNode.onended = () => {
            this._playing = false
          }
    }

    /**
     * Resume the audio from the previously paused playback time
     */
    resume(){
        if(!this._playing){
            const nodeKeys = Array.from(this._nodes.keys())

            if(this._nodes.get("delay") == null || this._isDelayNodeRemovedOnResume){
                nodeKeys.splice(0, 1)
            }
            let nextNode
            if(nodeKeys.length){
                this._sourceNode.disconnect(this._nodes.get(nodeKeys[0]))
                  // Bypassed the delay node if it exists, to remove delay on resume
                if(nodeKeys.includes("delay")){
                    nextNode = nodeKeys[1] ? this._nodes.get(nodeKeys[1]) : this._audioContext.destination
                    this._nodes.get("delay").disconnect(nextNode)
                    this._isDelayNodeRemovedOnResume = true
                } else {
                    nextNode = this._nodes.get(nodeKeys[0])
                }
            } else {
                this._sourceNode.disconnect(this._audioContext.destination)
                nextNode = this._audioContext.destination
            }
            this._createAudioSource()
            this._sourceNode.connect(nextNode)
            this._startPlayback(this._currentOffset)
        } else {
            console.warn(`"${this._identifier}" audio is already playing`)
        }
    }

    /**
     * Pause the audio playback and calculate offset time
     */
    pause(){
        try{
            if(this._playing){
                this._sourceNode.stop()
                const pausedAt =  parseFloat(this._audioContext.currentTime.toFixed(2));
                const playedTime = parseFloat((pausedAt - this._lastStartedAt).toFixed(2))
                let offset;
                if(this._loop && playedTime > this._duration){
                  const numOfLoops = Math.floor((playedTime + this._currentOffset)/this._duration)
                  offset = parseFloat(((playedTime + this._currentOffset) - numOfLoops * this._duration).toFixed(2))
                } else {
                  offset = parseFloat((this._currentOffset + playedTime).toFixed(2))
                  if(this._loop &&  offset > this._duration){
                    offset = parseFloat((offset - this._duration).toFixed(2))
                  }
                }
                this._playing = false
                this._currentOffset = offset
            } else {
                console.warn(`"${this._identifier}" audio is not playing`)
            }
        } catch(err){
            console.error(`Failed to pause ${this._identifier}`)
        }
    }

    /**
     * Stop the playing audio and remove the constructed audio graph
     */
    stop(){
        if(this._sourceNode){
            this._sourceNode.stop()
        }
        if(this._isAudioGraphConstructed){
            this._removeAudioGraph()
            this._isAudioGraphConstructed = false
        }
        this._playing = false
        this._currentOffset = this._initOffset
    }

    /**
     * Create Convolver node with given effect buffer
     * @param {string} effectIdentifier The identifier for effect buffers
     * @param {Boolean} normalize The normalization flag
     */
    effect(effectIdentifier, normalize = true){
        if(!this._effectsBuffers.has(effectIdentifier)){
            console.warn(`"${effectIdentifier}" effect not found`)
            return this
        }
        let convolverNode
        if(this._nodes.has("convolver")){
            convolverNode = this._nodes.get("convolver");
            convolverNode.normalize = normalize
            convolverNode.buffer = this._effectsBuffers.get(effectIdentifier)
        } else {
            convolverNode = this._audioContext.createConvolver()
            convolverNode.normalize = normalize
            convolverNode.buffer = this._effectsBuffers.get(effectIdentifier)
            this._nodes.set("convolver", convolverNode)
        }
        return this
    }

    /**
     * Create dynamic compressor node and set the parameters
     * @param {Object} compressorParams The dynamic compressor node parameter
     */
    compress(compressorParams){
        if( !compressorParams || !( compressorParams instanceof CompressorParams)){
            console.error("The argument must be instance of CompressorParams")
            return this
        }

        const compressor = this._nodes.has("compressor") ? this._nodes.get("compressor") : this._audioContext.createDynamicsCompressor()

        compressorParams.params.forEach( (key) => {
            if(compressorParams[key]){
                compressor[key].value = compressorParams[key]
            }
        })
        if(!this._nodes.has("compressor")){
            this._nodes.set("compressor", compressor)
        }
        return this
    }

    /**
     * Create Biquad filter node and set the parameters
     * @param {Object} filterParams The biquad filter node parameters
     */
    filter(filterParams){
        if( !filterParams || !(filterParams instanceof FilterParams)){
            console.error("The argument must be instance of FilterParams")
            return this
        }
        const filter = this._nodes.has("filter") ? this._nodes.get("filter") : this._audioContext.createBiquadFilter()

        filterParams.params.forEach( (key) => {
            if(filterParams[key]){
                if("type" == key){
                    filter[key]= filterParams[key]
                    return
                }
                filter[key].value = filterParams[key]
            }
        })
        if(!this._nodes.has("filter")){
            this._nodes.set("filter", filter)
        }
        return this
    }

    /**
     *  Validator for filter coefficients
     * @param {string} name The name of the control
     * @param {Array} coefficients The coefficients array
     * @return valid coefficients or not
     */
    _validateCoeff(name, coefficients){
        if(!coefficients || !isArray(coefficients)){
            console.error(`${name} coefficients must be an array`)
            return false
        }
        if(coefficients.length < 1 ||  coefficients.length > 20 ){
            console.error(`The number of ${name} coefficients provided (${coefficients.length}) is outside the range [1, 20].`)
            return false
        }
        return true
    }

    /**
     * Create Infinite impulse response node
     * @param {Array} feedForward An array of coefficients
     * @param {Array} feedBack An array of coefficients
     */
    IIRFilter(feedForward, feedBack){

       if(!this._validateCoeff("feedForward", feedForward) || !this._validateCoeff("feedBack", feedBack)) return this

        try{
            const iirFilterNode = this._audioContext.createIIRFilter(feedForward, feedBack)
            this._nodes.set("iirFilter", iirFilterNode)
        } catch(error){
            console.error(error.message)
        } finally {
            return this
        }
    }

    /**
     * Reset to default state
     */
    reset(){
        this.stop()
        this._initOffset = 0
        this._currentOffset = 0
        this._loop = false
        this._nodes = new Map()
        this._createEntryForDelayNode()
        return this
    }

    /**
     *  Remove the connected audio graph by disconnecting nodes
     */
    _removeAudioGraph(){
        let finalNode = this._sourceNode
        for(const [id, node] of this._nodes.entries()){
            if((id == "delay" && this._isDelayNodeRemovedOnResume) || node == null){
                continue
            }
            finalNode.disconnect(node)
            finalNode = node
        }
        finalNode.disconnect(this._audioContext.destination)
    }
}