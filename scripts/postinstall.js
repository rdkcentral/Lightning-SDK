import shell from 'shelljs'
import path from 'path'
import process from 'process'

const target = './support/lib'
const origin = path.join(
  process.cwd(),
  process.cwd().indexOf('node_modules') > -1 ? '..' : 'node_modules',
  'wpe-lightning'
)

shell.mkdir(target)
shell.cp('-R', origin + '/devtools/*', target)
shell.cp('-R', origin + '/dist/*', target)
