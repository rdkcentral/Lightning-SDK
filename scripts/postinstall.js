import shell from 'shelljs'
const target = './support/lib'

shell.mkdir(target)
shell.cp('-R', './node_modules/wpe-lightning/devtools/*', target)
shell.cp('-R', './node_modules/wpe-lightning/dist/*', target)
