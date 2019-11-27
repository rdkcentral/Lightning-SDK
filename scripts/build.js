import { build } from './package.js'

const watch = process.argv.pop() === '--watch'

if (watch) {
  console.log(
    'Sorry, watching mode is not working yet ... for now you need to run `npm run build` for each change you make'
  )
  // inputOptions.watch = {
  //   chokidar: {
  //     usePolling: true,
  //   },
  //   include: path.join(process.env.npm_config_baseDir, '/{src|assets}/**'),
  // }
}

build().then(() => {
  console.log('\x1b[32m%s\x1b[0m', 'success')
})
