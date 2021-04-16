import Validator from './Validator'

/**
 * @class CompressorParams representing a Dynamic Compressor Node audio parameters
 */
export default class CompressorParams {
    /**
     * Create an instance of CompressorParams and initialize the parameters
     */
    constructor(){
       const commonValidators = ["isNumber", "range"]
       this._threshold = {
            name: "threshold",
            validator: commonValidators,
            range:[-100, 0],
            readOnly: true
       }

       this._knee = {
           name: "knee",
           validator: commonValidators,
           range: [0, 40],
           readOnly: true
       }

       this._ratio = {
           name: "ratio",
           validator: commonValidators,
           range: [1, 20],
           readOnly: true
       }

       this._attack = {
           name: "attack",
           validator: commonValidators,
           range: [0, 1],
           readOnly: true
       }

       this._release = {
           name: "release",
           validator: commonValidators,
           range: [0, 1],
           readOnly: true
       }

       this._validator = new Validator()

       this._params = ["threshold", "knee", "ratio", "attack", "release"]
    }

    get params(){
        return this._params
    }

    set threshold(v){
        if(this._validator.validate(this._threshold, v)){
            this._threshold.value = v
        }
    }

    get threshold(){
        return this._threshold.value
    }

    set knee(v){
        if(this._validator.validate(this._knee, v)){
            this._knee.value = v
        }
    }

    get knee(){
        return this._knee.value
    }

    set ratio(v){
        if(this._validator.validate(this._ratio, v)){
            this._ratio.value = v
        }
    }

    get ratio(){
        return this._ratio.value
    }

    set attack(v){
        if(this._validator.validate(this._attack, v)){
            this._attack.value = v
        }
    }

    get attack(){
        return this._attack.value
    }

    set release(v){
        if(this._validator.validate(this._release, v)){
            this._release.value = v
        }
    }

    get release(){
        return this._release.value
    }

    isReadonly(param){
        return this[`_${param}`].readOnly
    }
}
