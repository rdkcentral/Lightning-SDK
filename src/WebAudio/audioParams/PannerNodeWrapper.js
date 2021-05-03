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
export default class PannerNodeWrapper extends BasePanner {
    constructor(node){
        super()
        this._pannerNode = node
    }

    set coneInnerAngle(v){
        if(this._validator.validate(this._coneInnerAngle, v)){
            this._pannerNode.coneInnerAngle = v
        }
    }
    get coneInnerAngle(){
        return  this._pannerNode.coneInnerAngle
    }

    set coneOuterAngle(v){
        if(this._validator.validate(this._coneOuterAngle, v)){
            this._pannerNode.coneOuterAngle = v
        }
    }
    get coneOuterAngle(){
        return this._pannerNode.coneOuterAngle
    }

    set coneOuterGain(v){
        if(this._validator.validate(this._coneOuterGain, v)){
            this._pannerNode.coneOuterGain = v
        }
    }
    get coneOuterGain(){
        return this._pannerNode.coneOuterGain
    }

    set distanceModel(v){
        if(this._validator.validate(this._distanceModel, v)){
            this._pannerNode.distanceModel = v
        }
    }
    get distanceModel(){
        return this._pannerNode.distanceModel
    }

    set maxDistance(v){
        if(this._validator.validate(this._maxDistance, v)){
            this._pannerNode.maxDistance = v
        }
    }
    get maxDistance(){
        return this._pannerNode.maxDistance
    }

    set orientationX(v){
        if(this._validator.validate(this._orientationX, v)){
            this._pannerNode.orientationX.value = v
        }
    }
    get orientationX(){
        return this._pannerNode.orientationX
    }

    set orientationY(v){
        if(this._validator.validate(this._orientationY, v)){
            this._pannerNode.orientationY.value = v
        }
    }
    get orientationY(){
        return this._pannerNode.orientationY
    }

    set orientationZ(v){
        if(this._validator.validate(this._orientationZ, v)){
            this._pannerNode.orientationZ.value = v
        }
    }
    get orientationZ(){
        return this._pannerNode.orientationZ
    }

    set panningModel(v){
        if(this._validator.validate(this._panningModel, v)){
            this._pannerNode.panningModel = v
        }
    }
    get panningModel(){
        return this._pannerNode.panningModel
    }

    set positionX(v){
        if(this._validator.validate(this._positionX, v)){
            this._pannerNode.positionX.value = v
        }
    }
    get positionX(){
        return this._pannerNode.positionX
    }

    set positionY(v){
        if(this._validator.validate(this._positionY, v)){
            this._pannerNode.positionY.value = v
        }
    }
    get positionY(){
        return this._pannerNode.positionY
    }

    set positionZ(v){
        if(this._validator.validate(this._positionZ, v)){
            this._pannerNode.positionZ.value = v
        }
    }
    get positionZ(){
        return this._pannerNode.positionZ
    }

    set refDistance(v){
        if(this._validator.validate(this._refDistance, v)){
            this._pannerNode.refDistance = v
        }
    }
    get refDistance(){
        return this._pannerNode.refDistance
    }

    set rolloffFactor(v){
        if(this._validator.validate(this._rolloffFactor, v)){
            this._pannerNode.rolloffFactor = v
        }
    }
    get rolloffFactor(){
        return this._pannerNode.rolloffFactor
    }
}