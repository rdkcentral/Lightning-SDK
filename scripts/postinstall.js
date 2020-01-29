import shell from 'shelljs'
import path from 'path'
import process from 'process'
import fs from 'fs'
import crypto from 'crypto'

const target = './support/lib'
const origin = path.join(
  process.cwd(),
  process.cwd().indexOf('node_modules') > -1 ? '..' : 'node_modules',
  'wpe-lightning'
)

shell.mkdir(target)
shell.cp('-R', origin + '/devtools/*', target)
shell.cp('-R', origin + '/dist/*', target)

const sparkPlatformOrigin = path.join(
  process.cwd(),
  process.cwd().indexOf('node_modules') > -1 ? '..' : 'node_modules',
  'wpe-lightning-spark'
)
shell.cp('-R', sparkPlatformOrigin + '/dist/SparkPlatform.js', target)

const thunderOrigin = path.join(
  process.cwd(),
  process.cwd().indexOf('node_modules') > -1 ? '..' : 'node_modules',
  'ThunderJS'
)
shell.cp('-R', thunderOrigin + '/dist/thunderJS.js', target)

let json = {
  frameworkType: 'sparkGL',
  applicationURL: 'startApp.js',
  frameworks: [
    { url: 'lib/lightning.js' },
    { url: 'lib/SparkPlatform.js' },
    { url: 'lib/thunderJS.js' },
    { url: 'appBundle.js' },
  ],
}
json.frameworks.forEach(f => {
  if (fs.existsSync(`./support/${f.url}`))
    f['md5'] = crypto
      .createHash('md5')
      .update(fs.readFileSync(`./support/${f.url}`))
      .digest('hex')
})
fs.writeFileSync('./support/index.spark', JSON.stringify(json, null, 4))
