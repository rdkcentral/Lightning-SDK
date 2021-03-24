

export default class Audio {

    constructor(identifier) {
        this._identifier = identifier
        this._initOffset = 0
        this._currentOffset = 0
        this._nodes = new Map()
        this._createEntryForDelayNode()
    }

    _createEntryForDelayNode(){
        this._nodes.set("delay", null)
    }

    set duration(v){
        this._duration = v
    }

    get playing(){
        return this._playing
    }

    skip(v){
        if(this._validate("skip", v, [0, this._duration])){
            this._initOffset = v
            this._currentOffset = v
        }
        return this
    }

    _validate(mName, v, range){
        if(isNaN(v)){
            console.error(`${mName} must be a number`)
            return false
        }
        if(range){
            if(v < range[0] || v > range[1]){
                console.warn(`${mName} must be in range (${range})`)
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

    delay(delay){
        if(this._validate("delay", delay, [0, 179])){
            const delayNode =  this._audioContext.createDelay(delay)
            delayNode.delayTime.value = delay
            this._nodes.set("delay", delayNode)
        }
        return this
    }

    _createAudioSource(){
        this._sourceNode = this._audioContext.createBufferSource()
        this._sourceNode.buffer = this._audioBuffers.get(this._identifier)
        if(this._loop){
            this._sourceNode.loop = this._loop
        }
    }

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

    _startPlayback(offset){
        this._sourceNode.start(0, offset)
        this._lastStartedAt = parseFloat((this._audioContext.currentTime).toFixed(2))
        this._playing = true
        this._sourceNode.onended = () => {
            this._playing = false
          }
    }

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
                }``
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

    reset(){
        this.stop()
        this._initOffset = 0
        this._currentOffset = 0
        this._loop = false
        this._nodes = new Map()
        this._createEntryForDelayNode()
        return this
    }

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