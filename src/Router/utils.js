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

import Lightning from '../Lightning'
import Settings from '../Settings'

export const isFunction = v => {
  return typeof v === 'function'
}

export const isObject = v => {
  return typeof v === 'object' && v !== null
}

export const isBoolean = v => {
  return typeof v === 'boolean'
}

export const isPage = v => {
  if (v instanceof Lightning.Element || isLightningComponent(v)) {
    return true
  }
  return false
}

export const isLightningComponent = type => {
  return type.prototype && 'isComponent' in type.prototype
}

export const isArray = v => {
  return Array.isArray(v)
}

export const ucfirst = v => {
  return `${v.charAt(0).toUpperCase()}${v.slice(1)}`
}

export const isString = v => {
  return typeof v === 'string'
}

export const isPromise = v => {
  return v instanceof Promise
}

export const getConfigMap = () => {
  const routerSettings = Settings.get('platform', 'router')
  const isObj = isObject(routerSettings)

  return [
    'backtrack',
    'gcOnUnload',
    'destroyOnHistoryBack',
    'lazyCreate',
    'lazyDestroy',
    'reuseInstance',
    'autoRestoreRemote',
  ].reduce((config, key) => {
    config.set(key, isObj ? routerSettings[key] : Settings.get('platform', key))
    return config
  }, new Map())
}

export const incorrectParams = (cb, route) => {
  const isIncorrect = /^\w*?\s?\(\s?\{.*?\}\s?\)/i
  if (isIncorrect.test(cb.toString())) {
    console.warn(
      [
        `DEPRECATION: The data-provider for route: ${route} is not correct.`,
        '"page" is no longer a property of the params object but is now the first function parameter: ',
        'https://github.com/rdkcentral/Lightning-SDK/blob/feature/router/docs/plugins/router/dataproviding.md#data-providing',
        "It's supported for now but will be removed in a future release.",
      ].join('\n')
    )
    return true
  }
  return false
}
