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

import Settings from '../Settings'

const prepLog = (type, args) => {
  const colors = {
    Info: 'green',
    Debug: 'gray',
    Warn: 'orange',
    Error: 'red',
  }

  args = Array.from(args)
  return [
    '%c' + (args.length > 1 && typeof args[0] === 'string' ? args.shift() : type),
    'background-color: ' + colors[type] + '; color: white; padding: 2px 4px; border-radius: 2px',
    args,
  ]
}

export default {
  info() {
    Settings.get('platform', 'log') && console.log.apply(console, prepLog('Info', arguments))
  },
  debug() {
    Settings.get('platform', 'log') && console.debug.apply(console, prepLog('Debug', arguments))
  },
  error() {
    Settings.get('platform', 'log') && console.error.apply(console, prepLog('Error', arguments))
  },
  warn() {
    Settings.get('platform', 'log') && console.warn.apply(console, prepLog('Warn', arguments))
  },
}
