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

import Profile from '../Profile'
import Settings from '../Settings'
import sequence from '../helpers/sequence'

let cspUrl = 'http://payment-csp-example.metrological.com:8080/'
let billingUrl = 'https://payment-sdk.metrological.com/'

let cspEndpoints = {
  assets: {
    uri: '/assets',
    method: 'GET',
  },
  asset: {
    uri: '/assets/:id',
    method: 'GET',
  },
  signature: {
    uri: '/assets/:id/signature',
    method: 'POST',
  },
  subscribe: {
    uri: '/assets/:id/subscribe',
    method: 'POST',
  },
  unsubscribe: {
    uri: '/assets/:id/unsubscribe',
    method: 'POST',
  },
}

export const initPurchase = config => {
  if (config.billingUrl) billingUrl = config.billingUrl
}

const createUrl = (uri, baseUrl, params = {}) => {
  return new URL(
    // sprinkle in the params
    Object.keys(params)
      .reduce((res, key) => res.replace(new RegExp(':' + key, 'g'), params[key]), uri)
      // remove any leading slash from uri
      .replace(/^\//, ''),
    // make sure baseUrl always has a trailing slash
    /\/$/.test(baseUrl) ? baseUrl : baseUrl.replace(/$/, '/')
  )
}

const request = (url, method = 'GET', data, headers = {}) => {
  if (method === 'GET' && data) {
    url.search = new URLSearchParams(data)
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        ...{
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        ...headers,
      },
      method: method,
      body: method !== 'GET' && data ? JSON.stringify(data) : null,
    })
      .then(response => (response.ok ? resolve(response.json()) : reject(response.statusText)))
      .catch(reject)
  })
}

const cspRequest = (type, data = null, params = {}) => {
  return new Promise((resolve, reject) => {
    const endpoint = cspEndpoints[type]

    if (!endpoint) {
      reject('No endpoint found for "' + type + '" call')
    } else {
      if (endpoint.callback && typeof endpoint.callback === 'function') {
        endpoint
          .callback(data, params)
          .then(resolve)
          .catch(reject)
      } else {
        request(
          createUrl(endpoint.uri, cspUrl, params),
          endpoint.method,
          {
            ...(endpoint.data || {}),
            ...data,
          },
          endpoint.headers || {}
        )
          .then(resolve)
          .catch(reject)
      }
    }
  })
}

const billingRequest = (uri, data, method = 'POST') => {
  return new Promise((resolve, reject) => {
    request(createUrl(uri, billingUrl), method, data)
      .then(resolve)
      .catch(reject)
  })
}

export default {
  setup(config) {
    if (config.cspUrl) cspUrl = config.cspUrl
    if (config.endpoints) cspEndpoints = { cspEndpoints, ...config.endpoints }
  },
  assets() {
    return new Promise((resolve, reject) => {
      Profile.household().then(household => {
        cspRequest('assets', { household })
          .then(resolve)
          .catch(reject)
      })
    })
  },
  asset(id) {
    return new Promise((resolve, reject) => {
      Profile.household().then(household => {
        cspRequest('asset', { household }, { id })
          .then(resolve)
          .catch(reject)
      })
    })
  },
  signature(id) {
    return new Promise((resolve, reject) => {
      Promise.all([Profile.household()]).then(([household]) => {
        cspRequest('signature', { household }, { id })
          .then(resolve)
          .catch(reject)
      })
    })
  },
  subscribe(id, transaction) {
    return new Promise((resolve, reject) => {
      cspRequest('subscribe', { ...transaction }, { id })
        .then(resolve)
        .catch(reject)
    })
  },
  unsubscribe(id) {
    return new Promise((resolve, reject) => {
      Profile.household().then(household => {
        cspRequest('unsubscribe', { household }, { id })
          .then(resolve)
          .catch(reject)
      })
    })
  },
  payment(signature = {}, type = 'in-app') {
    return new Promise((resolve, reject) => {
      Promise.all([Profile.household(), Profile.countryCode(), Profile.operator(), Profile.mac()])
        .then(([household, country, operator, mac]) => {
          billingRequest('/', {
            purchase: signature,
            identifier: Settings.get('app', 'id'),
            name: Settings.get('app', 'id'),
            household,
            country,
            operator,
            mac,
            type,
          })
            .then(resolve)
            .catch(reject)
        })
        .catch(reject)
    })
  },
  confirm(transactionId) {
    return new Promise((resolve, reject) => {
      billingRequest('/confirm', {
        transactionId,
      })
        .then(resolve)
        .catch(reject)
    })
  },
  buy(assetId, type) {
    return new Promise((resolve, reject) => {
      let transactionId
      sequence([
        () => this.signature(assetId),
        signature => this.payment(signature, type),
        transaction => {
          transactionId = transaction.transactionId
          return this.subscribe(assetId, transaction)
        },
        () => this.confirm(transactionId),
      ])
        .then(resolve)
        .catch(reject)
    })
  },
}
