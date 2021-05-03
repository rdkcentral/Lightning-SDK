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
