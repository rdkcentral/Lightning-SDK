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

import Log from '../Log'

let sendMetric = (type, event, params) => {
  Log.info('Sending metric', type, event, params)
}

export const initMetrics = config => {
  sendMetric = config.sendMetric
}

// available metric per category
const metrics = {
  app: ['launch', 'loaded', 'ready', 'close'],
  page: ['view', 'leave'],
  user: ['click', 'input'],
  media: [
    'abort',
    'canplay',
    'ended',
    'pause',
    'play',
    'suspend',
    'volumechange',
    'waiting',
    'seeking',
    'seeked',
  ],
}

// error metric function (added to each category)
const errorMetric = (type, message, code, visible, params = {}) => {
  params = { params, ...{ message, code, visible } }
  sendMetric(type, 'error', params)
}

const Metric = (type, events, options = {}) => {
  return events.reduce(
    (obj, event) => {
      obj[event] = (name, params = {}) => {
        params = { ...options, ...(name ? { name } : {}), ...params }
        sendMetric(type, event, params)
      }
      return obj
    },
    {
      error(message, code, params) {
        errorMetric(type, message, code, params)
      },
      event(name, params) {
        sendMetric(type, name, params)
      },
    }
  )
}

const Metrics = types => {
  return Object.keys(types).reduce(
    (obj, type) => {
      // media metric works a bit different!
      // it's a function that accepts a url and returns an object with the available metrics
      // url is automatically passed as a param in every metric
      type === 'media'
        ? (obj[type] = url => Metric(type, types[type], { url }))
        : (obj[type] = Metric(type, types[type]))
      return obj
    },
    { error: errorMetric, event: sendMetric }
  )
}

export default Metrics(metrics)
