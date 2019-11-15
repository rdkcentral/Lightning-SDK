import Execa from 'execa'

Execa('instant', ['--open', './'], { cwd: process.env.npm_config_baseDir || __dirname }).stdout.pipe(process.stdout);
