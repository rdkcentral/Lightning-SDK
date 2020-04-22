/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an \"AS IS\" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import chalk from 'chalk'

console.log(
  chalk.red(
    'The ' + chalk.italic('upload') + ' script has been removed from the Lightning-SDK ... '
  )
)
console.log()
console.log('Please install the ' + chalk.italic('Lightning-CLI') + ' globally on your system:')
console.log()
console.log(chalk.bold.dim('npm install -g WebPlatformForEmbedded/Lightning-CLI'))
console.log()
console.log(
  'And then run ' + chalk.green.bold('lng upload') + ' in the directory with your Lightning App'
)
