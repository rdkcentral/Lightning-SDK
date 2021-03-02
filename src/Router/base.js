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
import { default as Router } from './index'
import { routerConfig } from './utils/router.js'
import { isBoolean } from './utils/helpers'

export class RoutedApp extends Lightning.Component {
  static _template() {
    return {
      Pages: {
        forceZIndexContext: true,
      },
      /**
       * This is a default Loading page that will be made visible
       * during data-provider on() you CAN override in child-class
       */
      Loading: {
        rect: true,
        w: 1920,
        h: 1080,
        color: 0xff000000,
        visible: false,
        zIndex: 99,
        Label: {
          mount: 0.5,
          x: 960,
          y: 540,
          text: {
            text: 'Loading..',
          },
        },
      },
    }
  }

  static _states() {
    return [
      class Loading extends this {
        $enter() {
          this.tag('Loading').visible = true
        }

        $exit() {
          this.tag('Loading').visible = false
        }
      },
      class Widgets extends this {
        $enter(args, widget) {
          // store widget reference
          this._widget = widget

          // since it's possible that this behaviour
          // is non-remote driven we force a recalculation
          // of the focuspath
          this._refocus()
        }

        _getFocused() {
          // we delegate focus to selected widget
          // so it can consume remotecontrol presses
          return this._widget
        }

        // if we want to widget to widget focus delegation
        reload(widget) {
          this._widget = widget
          this._refocus()
        }

        _handleKey() {
          const restoreFocus = routerConfig.get('autoRestoreRemote')
          /**
           * The Router used to delegate focus back to the page instance on
           * every unhandled key. This is barely usefull in any situation
           * so for now we offer the option to explicity turn that behaviour off
           * so we don't don't introduce a breaking change.
           */
          if (!isBoolean(restoreFocus) || restoreFocus === true) {
            Router.focusPage()
          }
        }
      },
    ]
  }

  /**
   * Return location where pages need to be stored
   */
  get pages() {
    return this.tag('Pages')
  }

  /**
   * Tell router where widgets are stored
   */
  get widgets() {
    return this.tag('Widgets')
  }

  /**
   * we MUST register _handleBack method so the Router
   * can override it
   * @private
   */
  _handleBack() {}

  /**
   * we MUST register _captureKey for dev quick-navigation
   * (via keyboard 1-9)
   */
  _captureKey() {}

  /**
   * We MUST return Router.activePage() so the new Page
   * can listen to the remote-control.
   */
  _getFocused() {
    return Router.getActivePage()
  }
}
