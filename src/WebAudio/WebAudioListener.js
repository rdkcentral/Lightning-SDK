export default class WebAudioListener {

    constructor(context){
        this._audioContext = context
    }

    _validate(mName, v, range){
        if(isNaN(v)){
            console.error(`${mName} must be a number`)
            return false
        }
        return true
    }

    set positionX(v){
        if(this._validate("positionX", v)){
            console.log("position x value setting")
            this._audioContext.listener.positionX.value = v
            console.log(this._audioContext.listener.positionX)
        }
    }
    get positionX(){
        return this._audioContext.listener.positionX
    }

    set positionY(v){
        if(this._validate("positionY", v)){
            this._audioContext.listener.positionY.value = v
        }
    }
    get positionY(){
        return this._audioContext.listener.positionY
    }

    set positionZ(v){
        if(this._validate("positionZ", v)){
            this._audioContext.listener.positionZ.value = v
        }
    }
    get positionZ(){
        return this._audioContext.listener.positionZ
    }

    set forwardX(v){
        if(this._validate("forwardX", v)){
            this._audioContext.listener.forwardX.value = v
        }
    }
    get forwardX(){
        return this._audioContext.listener.forwardX
    }

    set forwardY(v){
        if(this._validate("forwardY", v)){
            this._audioContext.listener.forwardY.value = v
        }
    }
    get forwardY(){
        return this._audioContext.listener.forwardY
    }

    set forwardZ(v){
        if(this._validate("forwardZ", v)){
            this._audioContext.listener.forwardZ.value = v
        }
    }
    get forwardZ(){
        return this._audioContext.listener.forwardZ
    }

    set upX(v){
        if(this._validate("upX", v)){
            this._audioContext.listener.upX.value = v
        }
    }
    get upX(){
        return this._audioContext.listener.upX
    }

    set upY(v){
        if(this._validate("upY", v)){
            this._audioContext.listener.upY.value = v
        }
    }
    get upY(){
        return this._audioContext.listener.upY
    }

    set upZ(v){
        if(this._validate("upZ", v)){
            this._audioContext.listener.upZ.value = v
        }
    }
    get upZ(){
        return this._audioContext.listener.upZ
    }

    position(x, y, z){

    }

    orientation(forwardX, forwardY, forwardZ, upX, upY, upZ){

    }

}