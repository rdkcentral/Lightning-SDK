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
!shell.test('-d', supportFolder) && shell.mkdir(supportFolder)

// create support/lib and copy all required libraries from node_modules
const supportLibFolder = path.join(supportFolder, '/lib')
!shell.test('-d', supportLibFolder) && shell.mkdir(supportLibFolder)

shell.cp('-R', path.join(nodeModulesFolder, '@lightningjs/core/devtools/*'), supportLibFolder)
shell.cp('-R', path.join(nodeModulesFolder, '@lightningjs/core/dist/*'), supportLibFolder)

// create support/polyfills and copy all required polyfills from node_modules
const supportPolyfillsFolder = path.join(supportFolder, '/polyfills')
!shell.test('-d', supportPolyfillsFolder) && shell.mkdir(supportPolyfillsFolder)

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

console.log('\x1b[32m')
console.log('=============================================================================\n')
console.log(
  'The package name of the Lightning SDK has recently changed from "wpe-lightning-sdk"\nto "@lightningjs/sdk"'
)
console.log('Read more about it here: http://www.lightningjs.io/announcements/carbon-release')
console.log('\n\nFrom now on you should import plugins from the Lightning SDK like this:')
console.log("\n\nimport { Utils } from '@lightningjs/sdk'\n")
console.log('=============================================================================')

// check if there is a mismatch in the installation of the SDK
if (
  process.env.npm_package_name.includes('@lightningjs/sdk') && // installing @lightningjs/sdk packagename
  process.cwd().includes('wpe-lightning-sdk') // in wpe-lightning-sdk folder
) {
  console.log('\x1b[31m')
  console.log('=============================================================================\n')
  console.log(
    'It seems like you are installing the new version of the Lightning SDK under the old\npackage namespace.'
  )
  console.log(
    'This may possibly result in unexpected errors in the rest of the postinstall script.\n\n'
  )
  console.log(
    'Unless this is intentional, we recommend that you manually run the following commands'
  )
  console.log('in the root of your project to properly install the latest Lightning-SDK:\n')
  console.log('npm uninstall wpe-lightning-sdk')
  console.log('npm install @lightningjs/sdk\n')
  console.log('=============================================================================')
}

console.log('\x1b[0m')

yesno({
  question:
    'Do you want us to automatically check for old Lightning-SDK imports and update them in your project files? (y/n)',
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
