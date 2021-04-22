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

import Log from '../Log'

import { channels, randomChannel } from './defaults'

let currentChannel
const callbacks = {}

const emit = (event, ...args) => {
  callbacks[event] &&
    callbacks[event].forEach(cb => {
      cb.apply(null, args)
    })
}

// local mock methods
let methods = {
  getChannel() {
    if (!currentChannel) currentChannel = randomChannel()
    return new Promise((resolve, reject) => {
      if (currentChannel) {
        const channel = { ...currentChannel }
        delete channel.program
        resolve(channel)
      } else {
        reject('No channel found')
      }
    })
  },
  getProgram() {
    if (!currentChannel) currentChannel = randomChannel()
    return new Promise((resolve, reject) => {
      currentChannel.program ? resolve(currentChannel.program) : reject('No program found')
    })
  },
  setChannel(number) {
    return new Promise((resolve, reject) => {
      if (number) {
        const newChannel = channels().find(c => c.number === number)
        if (newChannel) {
          currentChannel = newChannel
          const channel = { ...currentChannel }
          delete channel.program
          emit('channelChange', channel)
          resolve(channel)
        } else {
          reject('Channel not found')
        }
      } else {
        reject('No channel number supplied')
      }
    })
  },
}

export const initTV = config => {
  methods = {}
  if (config.getChannel && typeof config.getChannel === 'function') {
    methods.getChannel = config.getChannel
  }
  if (config.getProgram && typeof config.getProgram === 'function') {
    methods.getProgram = config.getProgram
  }
  if (config.setChannel && typeof config.setChannel === 'function') {
    methods.setChannel = config.setChannel
  }
  if (config.emit && typeof config.emit === 'function') {
    config.emit(emit)
  }
}

// public API
export default {
  channel(number = null) {
    return new Promise((resolve, reject) => {
      try {
        // call setChannel when number argument is passed, otherwise getChannel
        methods[number ? 'setChannel' : 'getChannel'](number)
          .then(channel => {
            // to do: ensure consistent formatting of channel info here?
            resolve(channel)
          })
          .catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  },
  program() {
    return new Promise((resolve, reject) => {
      try {
        methods
          .getProgram()
          .then(program => {
            // to do: ensure consistent formatting of program info here?
            resolve(program)
          })
          .catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  },
  entitled() {
    return new Promise((resolve, reject) => {
      try {
        methods
          .getChannel()
          .then(channel => {
            'entitled' in channel ? resolve(!!channel.entitled) : reject()
          })
          .catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  },
  addEventListener(event, cb) {
    if (typeof cb === 'function') {
      callbacks[event] = callbacks[event] || []
      callbacks[event].push(cb)
    } else {
      Log.error('Please provide a function as a callback')
    }
  },
  removeEventListener(event, cb = false) {
    if (callbacks[event] && callbacks[event].length) {
      callbacks[event] = cb ? callbacks[event].filter(_cb => _cb === cb) : []
    }
  },
}
