import shell from 'shelljs'
import targz from 'targz'
import fs from 'fs'
import path from 'path'
import { rollup } from 'rollup'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import process from 'process'

const baseDir = process.env.npm_config_baseDir
const dest = path.join(baseDir, 'dist/')

let logging = true

const inputOptions = {
  input: path.join(baseDir, 'src/index.js'),
  plugins: [resolve({ browser: true }), commonjs(), babel()],
}

export const release = () => {
  return new Promise(resolve => {
    return build({ clean: true, copyStartApp: false }).then(data => {
      pack(data).then(() => {
        data.absolutePath = `${baseDir}/${data.identifier}.tgz`
        log('MPK file created! ' + data.absolutePath)
        resolve(data)
      })
    })
  })
}

export const build = (opts = {}) => {
  return new Promise(resolve => {
    return Promise.all([getName(), copyFiles(opts.clean)])
      .then(res => {
        let data = res[0]
        return Promise.all([
          copyStartApp(opts.copyStartApp),
          bundleApp(data),
          bundleAppEs5(data),
        ]).then(() => {
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

const copyFiles = clean => {
  return new Promise(resolve => {
    //note: shelljs is sync
    shell.cd(baseDir)

    if (clean) {
      shell.rm('-r', dest)
      shell.mkdir(dest)
    }

    shell.cp('-r', baseDir + '/static', dest)
    shell.cp('-r', baseDir + '/src', dest)
    shell.cp('metadata.json', dest)
    resolve()
  })
}

const copyStartApp = copyStartApp => {
  if (copyStartApp === false) return Promise.resolve()

  return new Promise(resolve, reject => {
    fs.copyFile(
      path.join(process.cwd(), 'support/startApp.js'),
      path.join(baseDir, 'dist/startApp.js'),
      err => {
        if (!err) {
          console.log('startApp copied to ' + baseDir + '/dist/startApp.js')
          resolve()
        } else {
          console.error(err)
          reject(err)
        }
      }
    )
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
