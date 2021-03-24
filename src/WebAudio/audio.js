

export default class Audio {

    constructor(identifier) {
        this._identifier = identifier
        this._origOffset = 0
        this._offset = 0
        this._loop = false
        this._volume = 1
        this._createAudioGain()
    }

    _createAudioGain(){
        this._gainNode = this._audioContext.createGain()
        this._gainNode.gain.value = this._volume
    }

    set duration(v){
        this._duration = v
    }

    get playing(){
        return this._playing
    }

    skip(v){
        if(!this._validate("skip", v, [0, this._duration])){
            return this
        }
        this._origOffset = v
        this._offset = v
        return this
    }

    _validate(mName, v, range){
        if(isNaN(v)){
            console.error(`${mName} must be a number`)
            return false
        }
        if(range){
            if(v < range[0] || v > range[1]){
                console.warn(`${mName} must be in range ${range}`)
                return false
            }
        }
        return true
    }

    loop(v = true){
        this._loop = v
        return this
    }

    volume(v){
        if(!this._validate("volume", v)){
            return this
        }
        this._gainNode.gain.value = v
        return this
    }

    delay(delay, maxDelayTime = 5){
        if(!this._validate("delay", delay, [0, 180])){
            return this
        }
        if(isNaN(maxDelayTime)){
            console.warn(`maxDelayTime should evaluate to number`)
            maxDelayTime = 5
        }
        maxDelayTime = maxDelayTime < delay ? delay : maxDelayTime > 180 ? 180 : maxDelayTime
        this._delayNode = this._audioContext.createDelay(maxDelayTime)
        this._delayNode.delayTime.value  = delay
        return this
    }

    _createAudioSource(){
        this._sourceNode = this._audioContext.createBufferSource()
        this._sourceNode.buffer = this._audioBuffers.get(this._identifier)
        if(this._loop){
            this._sourceNode.loop = true
        }
    }

    play(){
        try{
            this._createAudioSource()
            let finalNode = this._sourceNode
            // To remove the delay node on resume connecting it
            // between source node and gain node
            if(this._delayNode){
                finalNode.connect(this._delayNode)
                finalNode = this._delayNode
            }
            finalNode.connect(this._gainNode)
            finalNode = this._gainNode

            if(this._convolverNode){
                finalNode.connect(this._convolverNode)
                finalNode = this._convolverNode
            }
            finalNode.connect(this._audioContext.destination)
            this._startPlayback(this._origOffset)
        } catch(err){
            console.error(`Failed to start ${this._identifier} sound`)
        }
    }

    _startPlayback(offset){
        this._sourceNode.start(0, offset)
        this._lastStartedAt = parseFloat((this._audioContext.currentTime).toFixed(2))
        this._playing = true
        this._sourceNode.onended = () => {
            this._playing = false
            this._offset = this._origOffset //if resume invokes next
          }
    }

    resume(){
        if(!this._playing){
            this._createAudioSource()
            // Todo
            // Bypassed the delay node if it exists to remove delay on resume
            this._sourceNode.connect(this._gainNode)
            this._startPlayback(this._offset)
        } else {
            console.warn(`"${this._identifier}" audio is already playing`)
        }
    }

    pause(){
        try{
            if(this._playing){
                this._sourceNode.stop()
                const pausedAt =  parseFloat(this._audioContext.currentTime.toFixed(2));
                const playedTime = parseFloat((pausedAt - this._lastStartedAt).toFixed(2))
                let offset;
                if(this._loop && playedTime > this._duration){
                  const numOfLoops = Math.floor((playedTime + this._offset)/this._duration)
                  offset = parseFloat(((playedTime + this._offset) - numOfLoops * this._duration).toFixed(2))
                } else {
                  offset = parseFloat((this._offset + playedTime).toFixed(2))
                  if(this._loop &&  offset > this._duration){
                    offset = parseFloat((offset - this._duration).toFixed(2))
                  }
                }
                this._playing = false
                this._offset = offset
            } else {
                console.warn(`"${this._identifier}" audio is not playing`)
            }
        } catch(err){
            console.error(`Failed to pause ${this._identifier}`)
        }
    }

    stop(){
        this._sourceNode.stop()
        this._playing = false
    }

    effect(effectIdentifier, normalize = true){
        if(!this._effectsBuffers.has(effectIdentifier)){
            console.warn(`"${effectIdentifier}" effect not found`)
            return this
        }
        this._convolverNode = this._audioContext.createConvolver()
        this._convolverNode.normalize = normalize
        this._convolverNode.buffer = this._effectsBuffers.get(effectIdentifier)
        return this
    }

    reset(){
        this._volume = 1
        this._origOffset = 0
        this._offset = 0
        this._loop = false
        if(this._delayNode) this._delayNode = undefined
        if(this._convolverNode) this._convolverNode = undefined
        return this
    }
}