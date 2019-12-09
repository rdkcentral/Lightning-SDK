import Execa from 'execa'
import process from 'process'

Execa('instant', ['--open', './dist'], {
  cwd: process.env.npm_config_baseDir || __dirname,
}).stdout.pipe(process.stdout)
