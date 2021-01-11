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
import Settings from '../Settings'

import { isObject } from './utils'

const running = new Map()
const resolved = new Map()
const expired = new Map()
const rejected = new Map()
const active = new Map()

const send = (hash, key, value) => {
  if (!Settings.get('platform', 'stats')) {
    return
  }
  if (!key && !value) {
    if (!running.has(hash)) {
      running.set(hash, {
        start: Date.now(),
      })
    }
  } else {
    if (running.has(hash)) {
      if (key && value) {
        const payload = running.get(hash)
        payload[key] = value
      }
    }
  }
  if (key && commands[key]) {
    const command = commands[key]
    if (command) {
      command.call(null, hash)
    }
  }
}

const move = (hash, bucket, args) => {
  if (active.has(hash)) {
    const payload = active.get(hash)
    const route = payload.route

    // we group by route so store
    // the hash in the payload
    payload.hash = hash

    if (isObject(args)) {
      Object.keys(args).forEach(prop => {
        payload[prop] = args[prop]
      })
    }
    if (bucket.has(route)) {
      const records = bucket.get(route)
      records.push(payload)
      bucket.set(route, records)
    } else {
      // we add by route and group all
      // resolved hashes against that route
      bucket.set(route, [payload])
    }
    active.delete(hash)
  }
}

const commands = {
  ready: hash => {
    if (running.has(hash)) {
      const payload = running.get(hash)
      payload.ready = Date.now()
      active.set(hash, payload)

      running.delete(hash)
    }
  },
  stop: hash => {
    move(hash, resolved, {
      stop: Date.now(),
    })
  },
  error: hash => {
    move(hash, rejected, {
      error: Date.now(),
    })
  },
  expired: hash => {
    move(hash, expired, {
      expired: Date.now,
    })
  },
}

const output = (label, bucket) => {
  Log.info(`Output: ${label}`, bucket)
  for (let [route, records] of bucket.entries()) {
    Log.debug(`route: ${route}`, records)
  }
}

export let getStats = () => {
  output('Resolved', resolved)
  output('Expired', expired)
  output('Rejected', rejected)
  output('Expired', expired)
  output('Still active', active)
  output('Still running', running)
}

export const initStats = config => {
  if (config.getStats) {
    getStats = config.getStats
  }
}

export default {
  send,
  getStats,
}
