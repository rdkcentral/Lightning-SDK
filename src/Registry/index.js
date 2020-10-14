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

const registry = {
  eventListeners: [],
  timeouts: [],
  intervals: [],
  targets: [],
}

export default {
  // Timeouts
  setTimeout(cb, timeout, ...params) {
    const timeoutId = setTimeout(
      () => {
        registry.timeouts = registry.timeouts.filter(id => id !== timeoutId)
        cb.apply(null, params)
      },
      timeout,
      params
    )
    Log.info('Set Timeout', 'ID: ' + timeoutId)
    registry.timeouts.push(timeoutId)
    return timeoutId
  },

  clearTimeout(timeoutId) {
    if (registry.timeouts.indexOf(timeoutId) > -1) {
      registry.timeouts = registry.timeouts.filter(id => id !== timeoutId)
      Log.info('Clear Timeout', 'ID: ' + timeoutId)
      clearTimeout(timeoutId)
    } else {
      Log.error('Clear Timeout', 'ID ' + timeoutId + ' not found')
    }
  },

  clearTimeouts() {
    registry.timeouts.forEach(timeoutId => {
      this.clearTimeout(timeoutId)
    })
  },

  // Intervals
  setInterval(cb, interval, ...params) {
    const intervalId = setInterval(
      () => {
        registry.intervals = registry.intervals.filter(id => id !== intervalId)
        cb.apply(null, params)
      },
      interval,
      params
    )
    Log.info('Set Interval', 'ID: ' + intervalId)
    registry.intervals.push(intervalId)
    return intervalId
  },

  clearInterval(intervalId) {
    if (registry.intervals.indexOf(intervalId) > -1) {
      registry.intervals = registry.intervals.filter(id => id !== intervalId)
      Log.info('Clear Interval', 'ID: ' + intervalId)
      clearInterval(intervalId)
    } else {
      Log.error('Clear Interval', 'ID ' + intervalId + ' not found')
    }
  },

  clearIntervals() {
    registry.intervals.forEach(intervalId => {
      this.clearInterval(intervalId)
    })
  },

  // Event listeners
  addEventListener(target, event, handler) {
    target.addEventListener(event, handler)
    let targetIndex =
      registry.targets.indexOf(target) > -1
        ? registry.targets.indexOf(target)
        : registry.targets.push(target) - 1

    registry.eventListeners[targetIndex] = registry.eventListeners[targetIndex] || {}
    registry.eventListeners[targetIndex][event] = registry.eventListeners[targetIndex][event] || []
    registry.eventListeners[targetIndex][event].push(handler)
    Log.info('Add eventListener', 'Target:', target, 'Event: ' + event, 'Handler:', handler)
  },

  removeEventListener(target, event, handler) {
    const targetIndex = registry.targets.indexOf(target)
    if (
      targetIndex > -1 &&
      registry.eventListeners[targetIndex] &&
      registry.eventListeners[targetIndex][event] &&
      registry.eventListeners[targetIndex][event].indexOf(handler) > -1
    ) {
      registry.eventListeners[targetIndex][event] = registry.eventListeners[targetIndex][
        event
      ].filter(fn => fn !== handler)
      Log.info('Remove eventListener', 'Target:', target, 'Event: ' + event, 'Handler:', handler)
      target.removeEventListener(event, handler)
    } else {
      Log.error(
        'Remove eventListener',
        'Not found',
        'Target',
        target,
        'Event: ' + event,
        'Handler',
        handler
      )
    }
  },

  // if `event` is omitted, removes all registered event listeners for target
  // if `target` is also omitted, removes all registered event listeners
  removeEventListeners(target, event) {
    if (target && event) {
      const targetIndex = registry.targets.indexOf(target)
      if (targetIndex > -1) {
        registry.eventListeners[targetIndex][event].forEach(handler => {
          this.removeEventListener(target, event, handler)
        })
      }
    } else if (target) {
      const targetIndex = registry.targets.indexOf(target)
      if (targetIndex > -1) {
        Object.keys(registry.eventListeners[targetIndex]).forEach(_event => {
          this.removeEventListeners(target, _event)
        })
      }
    } else {
      Object.keys(registry.eventListeners).forEach(targetIndex => {
        this.removeEventListeners(registry.targets[targetIndex])
      })
    }
  },

  // Clear everything (to be called upon app close for proper cleanup)
  clear() {
    this.clearTimeouts()
    this.clearIntervals()
    this.removeEventListeners()
    registry.eventListeners = []
    registry.timeouts = []
    registry.intervals = []
    registry.targets = []
  },
}
