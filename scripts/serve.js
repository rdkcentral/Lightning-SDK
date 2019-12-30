import Execa from 'execa'
import process from 'process'

Execa('http-server', ['./dist', '-c-1', '-o'], {
  cwd: process.env.npm_config_baseDir || __dirname,
}).stdout.pipe(process.stdout)
