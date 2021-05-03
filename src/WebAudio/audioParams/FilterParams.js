/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Validator from './Validator'
export default class FilterParams {
    constructor(){
        const commonValidators = ["isNumber"]
        this._type = {
            name: "type",
            validator: ["isString", "isExists"],
            possibleValues : Object.values(FilterParams.TYPE),
            value: FilterParams.TYPE.LOWPASS,
            readOnly: false
        }

        this._frequency = {
            name: "frequency",
            validator : commonValidators,
            readOnly: true
        }

        this._detune = {
            name: "detune",
            validator: commonValidators,
            readOnly: true
        }

        this._gain = {
            name: "gain",
            validator: [...commonValidators, "range"],
            range: [-40, 40],
            readOnly: true
        }

        this._Q = {
            name: "quality factor",
            validator: [...commonValidators, "range"],
            range: [0.0001, 1000],
            readOnly: true
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

    isReadonly(param){
        return this[`_${param}`].readOnly
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
