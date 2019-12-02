import shell from 'shelljs'
import targz from 'targz'
import fs from 'fs'
import path from 'path'
import { rollup } from 'rollup'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import process from 'process'

const lightningFile = require.resolve('wpe-lightning')

const baseDir = process.env.npm_config_baseDir
const dest = path.join(baseDir, 'dist/')

let logging = true

const inputOptions = {
  input: path.join(baseDir, 'src/index.js'),
  plugins: [resolve({ mainFields: ['main', 'browser'] }), commonjs(), babel()],
}

export const release = () => {
  return new Promise(resolve => {
    return build({ type: 'release' }).then(data => {
      pack(data).then(() => {
        data.absolutePath = `${baseDir}/${data.identifier}.tgz`
        log('MPK file created! ' + data.absolutePath)
        resolve(data)
      })
    })
  })
}

export const build = (opts = {}) => {
  //dev
  opts.copyStartApp = opts.copyStartApp || opts.type === 'dev' ? true : false
  opts.copyLightning = opts.copyLightning || opts.type === 'dev' ? true : false
  opts.copyStartApp = opts.copyStartApp || opts.type === 'dev' ? true : false
  opts.copyLightningInspect = opts.copyLightningInspect || opts.type === 'dev' ? true : false

  //release
  opts.makeEs5Build = opts.makeEs5Build || opts.type === 'release' ? true : false
  opts.clean = opts.clean || opts.type === 'release' ? true : false

  return new Promise(resolve => {
    return Promise.all([getName(), copyFiles(opts)])
      .then(res => {
        let data = res[0]

        let buildFns = [bundleApp(data)]
        if (opts.type === 'release') buildFns.push(bundleAppEs5(data))
        return Promise.all(buildFns).then(() => {
          log('Files written to ' + dest)
          resolve(data)
        })
      })
      .catch(console.error)
  })
}

function getName() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(baseDir, './metadata.json'), function(err, res) {
      if (err) {
        return reject(
          new Error(
            "Metadata.json file can't be read: run this from a directory containing a metadata file."
          )
        )
      }

      const data = JSON.parse(res.toString())

      if (!data.identifier) {
        return reject(new Error("Can't find identifier in metadata.json file"))
      }

      if (!data.version) {
        return reject(new Error("Can't find version in metadata.json file"))
      }

      if (!data.name) {
        return reject(new Error('No name provided for your app'))
      }

      return resolve(data)
    })
  })
}

const bundleApp = data => {
  const outputOptionsEs6 = {
    format: 'iife',
    name: 'APP_' + data.identifier.replace(/[^0-9a-zA-Z_$]/g, '_'),
    file: path.join(baseDir, '/dist/appBundle.js'),
  }

  return _bundleApp(inputOptions, outputOptionsEs6)
}

const bundleAppEs5 = data => {
  let inputOptionsEs5 = inputOptions
  // FICSME add es5 specific plugins to the generic list
  //inputOptionsEs5.plugins.concat([..])

  const outputOptionsEs5 = {
    format: 'iife',
    name: 'APP_' + data.identifier.replace(/[^0-9a-zA-Z_$]/g, '_'),
    file: path.join(baseDir, '/dist/appBundle.es5.js'),
  }

  return _bundleApp(inputOptionsEs5, outputOptionsEs5)
}

const _bundleApp = (_inputOptions, _outputOptions) => {
  return new Promise(resolve => {
    rollup(_inputOptions)
      .then(bundle => {
        bundle.generate(_outputOptions).then(() => {
          bundle.write(_outputOptions).then(() => {
            console.log('App bundle written to ' + _outputOptions.file)
            resolve()
          })
        })
      })
      .catch(console.error)
  })
}

const copyFiles = opts => {
  return new Promise(resolve => {
    //note: shelljs is sync
    let curPwd = process.cwd()
    shell.cd(baseDir)

    if (opts.clean) {
      shell.rm('-r', dest)
      shell.mkdir(dest)
    }

    shell.cp('-r', baseDir + '/static', dest)
    shell.cp('-r', baseDir + '/src', dest)
    shell.cp('metadata.json', dest)
    shell.cd(curPwd)

    if (opts.copyStartApp !== false) shell.cp(process.cwd() + '/support/startApp.js', dest)
    if (opts.copyLightning !== false) shell.cp(lightningFile, dest)
    if (opts.copyLightningInspect !== false) {
      shell.cp(
        path.join(
          process.cwd(),
          process.cwd().indexOf('/node_modules/') > -1 ? '..' : 'node_modules',
          'wpe-lightning/devtools/lightning-inspect.js'
        ),
        dest
      )
    }

    resolve()
  })
}

const pack = data => {
  return tar(path.join(baseDir, './dist'), path.join(baseDir, `./${data.identifier}.tgz`))
}

const tar = (src, dest) => {
  return new Promise((resolve, reject) => {
    targz.compress(
      {
        src,
        dest,
      },
      err => {
        if (err) {
          log('ERR:', err)
          reject(err)
        } else {
          log(`TAR: ${src}`)
          resolve()
        }
      }
    )
  })
}

const log = message => {
  if (logging) {
    console.log(message)
  }
}
