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

import { app, widgetsHost } from './router'
import { ucfirst } from './helpers'
import emit from './emit'

let activeWidget = null

export const getReferences = () => {
  if (!widgetsHost) {
    return
  }
  return widgetsHost.get().reduce((storage, widget) => {
    const key = widget.ref.toLowerCase()
    storage[key] = widget
    return storage
  }, {})
}

/**
 * update the visibility of the available widgets
 * for the current page / route
 * @param page
 */
export const updateWidgets = (widgets, page) => {
  // force lowercase lookup
  const configured = (widgets || []).map(ref => ref.toLowerCase())

  widgetsHost.forEach(widget => {
    widget.visible = configured.indexOf(widget.ref.toLowerCase()) !== -1
    if (widget.visible) {
      emit(widget, ['activated'], page)
    }
  })
  if (app.state === 'Widgets' && activeWidget && !activeWidget.visible) {
    app._setState('')
  }
}

const getWidgetByName = name => {
  name = ucfirst(name)
  return widgetsHost.getByRef(name) || false
}

/**
 * delegate app focus to a on-screen widget
 * @param name - {string}
 */
export const focusWidget = name => {
  const widget = getWidgetByName(name)
  if (widget) {
    setActiveWidget(widget)

    // if app is already in 'Widgets' state we can assume that
    // focus has been delegated from one widget to another so
    // we need to set the new widget reference and trigger a
    // new focus calculation of Lightning's focuspath
    if (app.state === 'Widgets') {
      app.reload(activeWidget)
    } else {
      app._setState('Widgets', [activeWidget])
    }
  }
}

export const handleRemote = (type, name) => {
  if (type === 'widget') {
    focusWidget(name)
  } else if (type === 'page') {
    restoreFocus()
  }
}

export const restoreFocus = () => {
  activeWidget = null
  app._setState('')
}

export const getActiveWidget = () => {
  return activeWidget
}

export const setActiveWidget = instance => {
  activeWidget = instance
}
