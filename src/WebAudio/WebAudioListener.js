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
            this._audioContext.listener.positionX.value = v
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