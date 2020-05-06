const shell = require('shelljs')
const path = require('path')
const process = require('process')

const nodeModulesFolder = path.join(
  process.cwd(),
  process.cwd().indexOf('node_modules') > -1 ? '..' : 'node_modules'
)

// create support lib (should already exist)
const supportFolder = path.join(process.cwd(), '/support')
shell.mkdir(supportFolder)

// create support/lib and copy all required libraries from node_modules
const supportLibFolder = path.join(supportFolder, '/lib')
shell.mkdir(supportLibFolder)
shell.cp('-R', path.join(nodeModulesFolder, '/wpe-lightning/devtools/*'), supportLibFolder)
shell.cp('-R', path.join(nodeModulesFolder, '/wpe-lightning/dist/*'), supportLibFolder)

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
