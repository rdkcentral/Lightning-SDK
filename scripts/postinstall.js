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

const shell = require('shelljs')
const path = require('path')
const process = require('process')
const replaceInFile = require('replace-in-file')
const yesno = require('yesno')

const nodeModulesFolder = path.join(
  process.cwd(),
  process.cwd().indexOf('node_modules') > -1 ? '../..' : 'node_modules'
)

// create support lib
const supportFolder = path.join(process.cwd(), '/support')
shell.mkdir(supportFolder)

// create support/lib and copy all required libraries from node_modules
const supportLibFolder = path.join(supportFolder, '/lib')
shell.mkdir(supportLibFolder)

shell.cp('-R', path.join(nodeModulesFolder, '@lightningjs/core/devtools/*'), supportLibFolder)
shell.cp('-R', path.join(nodeModulesFolder, '@lightningjs/core/dist/*'), supportLibFolder)

// create support/polyfills and copy all required polyfills from node_modules
const supportPolyfillsFolder = path.join(supportFolder, '/polyfills')
shell.mkdir(supportPolyfillsFolder)
shell.cp(
  '-R',
  path.join(nodeModulesFolder, '/url-polyfill/url-polyfill.js'),
  path.join(supportPolyfillsFolder, '/url.js')
)
shell.cp(
  '-R',
  path.join(nodeModulesFolder + '/@babel/polyfill/dist/polyfill.js'),
  path.join(supportPolyfillsFolder, '/babel-polyfill.js')
)
shell.cp(
  '-R',
  path.join(nodeModulesFolder + '/whatwg-fetch/dist/fetch.umd.js'),
  path.join(supportPolyfillsFolder, '/fetch.js')
)

// npm 7.0.* doesn't contain INIT_CWD in process.env, causing the post install script to fail
// added a (hopefully) temporary conditional for the existense of INIT_CWD
// See: https://github.com/rdkcentral/Lightning-SDK/issues/134 and
// https://github.com/npm/cli/issues/2033
const init_cwd = 'INIT_CWD' in process.env
if (init_cwd === false) {
  console.log(
    'Not able to run the entire postinstall script due to missing INIT_CWD in process.env'
  )
  console.log('See https://github.com/rdkcentral/Lightning-SDK/issues/134 for more details')
  process.exit()
}

const packageJson = require(path.join(process.env.INIT_CWD, 'package.json'))

if (
  packageJson &&
  packageJson.dependencies &&
  Object.keys(packageJson.dependencies).indexOf('wpe-lightning-sdk') > -1
) {
  console.log('\x1b[32m')
  console.log('=============================================================================\n')
  console.log(
    'The package name of the Lightning SDK has changed from "wpe-lightning-sdk"\nto "@lightningjs/sdk"'
  )
  console.log('\n\nFrom now on you should now import plugins from the Lightning SDK like this:')
  console.log("\n\nimport { Utils } from '@lightningjs/sdk'\n")
  console.log('=============================================================================')
  console.log('\x1b[0m')

  yesno({
    question:
      'Do you want us to automatically update the Lightning-SDK imports in your project files? (y/n)',
    defaultValue: null,
  })
    .then(ok => {
      ok &&
        replaceInFile({
          allowEmptyPaths: true,
          files: process.env.INIT_CWD + '/src/**/*',
          // eslint-disable-next-line
      from: /(?:[^\/]*?)\s+from\s+(["'])(wpe-lightning-sdk)(["']);?/gi,
          to: match => {
            return match.replace('wpe-lightning-sdk', '@lightningjs/sdk')
          },
        })
          .then(result => {
            const changedFiles = result
              .filter(item => item.hasChanged === true)
              .map(item => '- ' + item.file.replace(process.env.INIT_CWD, ''))

            if (changedFiles.length) {
              console.log('\x1b[32m')
              console.log('\n\nThe following files have been automatically updated for you:\n\n')
              console.log('\x1b[0m')
              console.log(changedFiles.join('\n'))
              console.log('\n\n')
            }
          })
          .catch(console.error)
    })
    .catch(console.error)
}
