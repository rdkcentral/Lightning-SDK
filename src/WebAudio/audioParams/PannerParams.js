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

import BasePanner from './BasePanner'
export default class PannerParams extends BasePanner {
    constructor(){
        super()

        this._params = ['orientationX',  'orientationY', 'orientationZ',
                        'positionX', 'positionY', 'positionZ', 'coneInnerAngle',
                        'coneOuterAngle', 'coneOuterGain', 'distanceModel', 'maxDistance',
                        'panningModel', 'refDistance', 'rolloffFactor'
                        ]
    }

    get params(){
        return this._params
    }

    set coneInnerAngle(v){
        if(this._validator.validate(this._coneInnerAngle, v)){
            this._coneInnerAngle.value = v
        }
    }
    get coneInnerAngle(){
        return this._coneInnerAngle.value
    }

    set coneOuterAngle(v){
        if(this._validator.validate(this._coneOuterAngle, v)){
            this._coneOuterAngle.value = v
        }
    }
    get coneOuterAngle(){
        return this._coneOuterAngle.value
    }

    set coneOuterGain(v){
        if(this._validator.validate(this._coneOuterGain, v)){
            this._coneOuterGain.value = v
        }
    }
    get coneOuterGain(){
        return this._coneOuterGain.value
    }

    set distanceModel(v){
        if(this._validator.validate(this._distanceModel, v)){
            this._distanceModel.value = v
        }
    }
    get distanceModel(){
        return this._distanceModel.value
    }

    set maxDistance(v){
        if(this._validator.validate(this._maxDistance, v)){
            this._maxDistance.value = v
        }
    }
    get maxDistance(){
        return this._maxDistance.value
    }

    set orientationX(v){
        if(this._validator.validate(this._orientationX, v)){
            this._orientationX.value = v
        }
    }
    get orientationX(){
        return this._orientationX.value
    }

    set orientationY(v){
        if(this._validator.validate(this._orientationY, v)){
            this._orientationY.value = v
        }
    }
    get orientationY(){
        return this._orientationY.value
    }

    set orientationZ(v){
        if(this._validator.validate(this._orientationZ, v)){
            this._orientationZ.value = v
        }
    }
    get orientationZ(){
        return this._orientationZ.value
    }

    set panningModel(v){
        if(this._validator.validate(this._panningModel, v)){
            this._panningModel.value = v
        }
    }
    get panningModel(){
        return this._panningModel.value
    }

    set positionX(v){
        if(this._validator.validate(this._positionX, v)){
            this._positionX.value = v
        }
    }
    get positionX(){
        return this._positionX.value
    }

    set positionY(v){
        if(this._validator.validate(this._positionY, v)){
            this._positionY.value = v
        }
    }
    get positionY(){
        return this._positionY.value
    }

    set positionZ(v){
        if(this._validator.validate(this._positionZ, v)){
            this._positionZ.value = v
        }
    }
    get positionZ(){
        return this._positionZ.value
    }

    set refDistance(v){
        if(this._validator.validate(this._refDistance, v)){
            this._refDistance.value = v
        }
    }
    get refDistance(){
        return this._refDistance.value
    }

    set rolloffFactor(v){
        if(this._validator.validate(this._rolloffFactor, v)){
            this._rolloffFactor.value = v
        }
    }
    get rolloffFactor(){
        return this._rolloffFactor.value
    }

    isReadonly(param){
        return this[`_${param}`].readOnly
    }
}