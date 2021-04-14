import Validator from './Validator'
export default class FilterParams {
    constructor(){
        const commonValidators = ["isNumber"]
        this._type = {
            name: "type",
            validator: ["isString", "isValidFilterType"],
            filters : Object.values(FilterParams.TYPE),
            value: FilterParams.TYPE.LOWPASS
        }

        this._frequency = {
            name: "frequency",
            validator : commonValidators
        }

        this._detune = {
            name: "detune",
            validator: commonValidators
        }

        this._gain = {
            name: "gain",
            validator: [...commonValidators, "range"],
            range: [-40, 40]
        }

        this._Q = {
            name: "quality factor",
            validator: [...commonValidators, "range"],
            range: [0.0001, 1000]
        }

        this._validator = new Validator()
        this._params = ["type", "frequency", "Q", "gain"]
    }

    get params(){
        return this._params
    }

    set type(v){
        if(this._validator.validate(this._type, v)){
            this._type.value = v
        }
    }
    get type(){
        return this._type.value
    }

    set frequency(v){
        console.log(this._frequency)
        if(this._validator.validate(this._frequency, v)){
            this._frequency.value = v
        }
    }
    get frequency(){
        return this._frequency.value
    }

    set detune(v){
        if(this._validator.validate(this._detune, v)){
            this._detune.value = v
        }
    }
    get detune(){
        return this._detune.value
    }

    set gain(v){
        if(this._validator.validate(this._gain, v)){
            this._gain.value = v
        }
    }
    get gain(){
        return this._gain.value
    }

    set Q(v){
        if(this._validator.validate(this._Q, v)){
            this._Q.value = v
        }
    }
    get Q(){
        return this._Q.value
    }
}

FilterParams.TYPE  = {
    LOWPASS :   "lowpass",
    HIGHPASS:   "highpass",
    BANDPASS:   "bandpass",
    LOWSHELF:   "lowshelf",
    HIGHSHELF:  "highshelf",
    NOTCH   :   "notch",
    PEAKING :   "peaking",
    ALLPASS :   "allpass"
}
