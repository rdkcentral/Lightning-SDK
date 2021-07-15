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
const synth = window.speechSynthesis

function speakSeries(series) {
  let cancelled = false

  series
    .reduce((series, phrase) => {
      return series.then(() => {
        phrase = typeof phrase === 'string' ? Promise.resolve(phrase) : phrase

        return phrase.then(toSpeak => {
          if (cancelled) {
            return Promise.reject()
          }
          let utterance = new SpeechSynthesisUtterance(toSpeak)
          synth.speak(utterance)
        })
      })
    }, Promise.resolve())
    .catch(() => {})

  return {
    cancel: () => {
      synth.cancel()
      cancelled = true
    },
  }
}

let currentSeries
export default function(toSpeak) {
  toSpeak = Array.isArray(toSpeak) ? toSpeak : [toSpeak]
  currentSeries && currentSeries.cancel()
  currentSeries = speakSeries(toSpeak)
}
