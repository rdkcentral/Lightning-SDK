/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
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

const settings = {}
const subscribers = {}

export const initSettings = (appSettings, platformSettings) => {
  settings['app'] = appSettings
  settings['platform'] = platformSettings
  settings['user'] = {}
}

const publish = (key, value) => {
  subscribers[key] && subscribers[key].forEach(subscriber => subscriber(value))
}

const dotGrab = (obj = {}, key) => {
  const keys = key.split('.')
  for (let i = 0; i < keys.length; i++) {
    obj = obj[keys[i]] = obj[keys[i]] !== undefined ? obj[keys[i]] : {}
  }
  return typeof obj === 'object' ? (Object.keys(obj).length ? obj : undefined) : obj
}

export default {
  get(type, key) {
    return dotGrab(settings[type], key)
  },
  has(type, key) {
    return !!this.get(type, key)
  },
  set(key, value) {
    settings['user'][key] = value
    publish(key, value)
  },
  subscribe(key, callback) {
    subscribers[key] = subscribers[key] || []
    subscribers[key].push(callback)
  },
  unsubscribe(key, callback) {
    if (callback) {
      const index = subscribers[key] && subscribers[key].findIndex(cb => cb === callback)
      index > -1 && subscribers[key].splice(index, 1)
    } else {
      if (key in subscribers) {
        subscribers[key] = []
      }
    }
  },
  clearSubscribers() {
    for (const key of Object.getOwnPropertyNames(subscribers)) {
      delete subscribers[key]
    }
  },
}
