
export default class BaseAudio{
    constructor(){

    }

       /**
     * Validate the audio parameter value
     * @param {string} mName The name of the audio parameter or normal param
     * @param {any} v The value of parameter
     * @param {Array} range The range of the parameter value
     * @return {Boolean} Valid value or not
     */
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

    skip(v){
        console.warn('skip feature not supported')
        return this
    }

    volume(v){
        console.warn('volume feature not supported')
        return this
    }

    loop(v){
        console.warn('loop feature not supported')
        return this
    }

    play(){
        console.warn('play feature not supported')
    }

    pause(){
        console.warn('pause feature not supported')
    }

    resume(){
        console.warn('resume feature not supported')
    }

    stop(){
        console.warn('stop feature not supported')
    }

    delay(delay){
        console.warn('delay feature not supported')
        return this
    }

    effect(effectIdentifier, normalize = true){
        console.warn("effect feature not supported")
        return this
    }

    compress(){
        console.warn("compress feature not supported")
        return this
    }

    filter(filterParams){
        console.warn("filter feature not supported")
        return this
    }

    reset(){
        console.warn("reset feature not supported")
    }
}
