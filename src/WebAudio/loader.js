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

export default (ctx, sounds) => {
  return new Promise((resolve, reject) => {
    const bufferList = new Map()
    let queue = sounds.size

    const loaded = () => {
      resolve(bufferList)
    }

    const loadBuffer = (identifier, url) => {
      fetch(url)
        .then(response => {
          return response.arrayBuffer()
        })
        .then(buffer => {
          ctx.decodeAudioData(buffer, data => {
            bufferList.set(identifier, data)
            queue--
            if (!queue) {
              return loaded()
            }
          })
        })
        .catch(err => {
          reject('decodeAudioData error: ', err)
        })
    }

    sounds.forEach((url, id) => {
      loadBuffer(id, url)
    })
  })
}
