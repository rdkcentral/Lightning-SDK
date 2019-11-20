import Execa from 'execa'
import process from 'process'

Execa('instant', ['--open', './'], {
  cwd: process.env.npm_config_baseDir || __dirname,
}).stdout.pipe(process.stdout)
