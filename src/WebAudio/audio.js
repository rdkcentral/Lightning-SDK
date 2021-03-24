

export default class Audio {

    constructor() {
        this._offset = 0
        this._loop = false
        this._volume = 1
        this._delay = 0
    }

    set sourceNode(node){
        this._sourceNode = node
    }

    set duration(v){
        this._duration = v
    }

    get playing(){
        return this._playing
    }

    skip(v){
        this._offset = v
        return this
    }

    loop(v = true){
            this._loop = v
            this._sourceNode.loop = v
            return this
        }

    volume(v){
        if(!this._gainNode){
            this._gainNode = this._audioContext.createGain()
        }
        this._gainNode.gain.value = v
        return this
    }

    delay(v){
        this._delay = v
        return this
    }

    start(){
        if(!this._gainNode){
            this._gainNode = this._audioContext.createGain()
            this._gainNode.gain.value = this._volume
        }
        this._sourceNode.connect(this._gainNode)
        this._gainNode.connect(this._audioContext.destination)
        this._sourceNode.start(this._delay, this._offset)
        this._lastStartedAt = parseFloat((this._audioContext.currentTime).toFixed(2))
        this._playing = true
    }

    pause(){
        try{
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
        } catch(err){
            console.error(`Failed to pause ${identifier}`)
        }
    }

    stop(){
        this._sourceNode.stop()
        this._playing = false
    }
}