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

import BaseAudio from './BaseAudio'

/**
 *@class HTMLAudio representing audio processing APIs
 */
export default class  HTMLAudio extends BaseAudio{
    /**
     * Create a HTML Audio element
     * @param {string} identifier The unique identifier for audio
     * @param {string} url The resource URL
     */
    constructor(identifier, url){
        super()
        this._audio = new Audio(url)
        this._identifier = identifier
        this._audio.addEventListener('canplaythrough', this.canPlayable.bind(this))
        this._audio.addEventListener('stalled', (event) => {
            console.info(`Failed to fetch ${this._identifier} audio data`)
        })
    }

    /**
     * Listener function for audio element event canplaythrough
     * @param {Event} event The event from audio element
     */
    canPlayable(event){
        console.log(event, "recieved event", typeof event)
        this._duration = this._audio.duration
        this._playable = true
    }

    /**
     * Set the offset on audio to start audio from given playback time
     * @param {number} v The time in seconds to be skipped
     */
    skip(v){
        if(this._validate("skip", v, [0,this._duration])){
            this._offset = v
        }
        return this
    }

    /**
     * To play the audio at specified volume
     * @param {number} v The gain to be apply
     */
    volume(v){
        if(this._validate("volume", v, [0,1])){
            this._audio.volume = v
        }
        return this
    }

     /**
     * To play the audio one time or multiple times
     * @param {Boolean} v The boolean value to configure audio would play continuously or not
     */
    loop(v = true){
        this._audio.loop = v
        return this
    }

    /**
     * Play the audio by setting offset
     */
    play(){
        if(this._playable){
            if(this._offset){
                this._audio.currentTime = this._audio.currentTime + this._offset
            }
            this._audio.play()
        } else {
            console.error(`${this._identifier} audio not playable at this moment`)
        }
    }

    /**
     * Pause the audio playback
     */
    pause(){
        this._audio.pause()
    }

    /**
     *  Resume the audio
     */
    resume(){
        this._audio.play()
    }

    /**
     * Stop the audio
     */
    stop(){
        this._audio.pause()
        this._audio.currentTime = 0
    }

    /**
     * Reset to default audio
     */
    reset(){
        this._offset = 0
        this._audio.volume = 1
        this._audio.loop = false
        this._audio.removeEventListener('canplaythrough', this.canPlayable)
        return this
    }
}