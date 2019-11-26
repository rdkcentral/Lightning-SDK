import shell from 'shelljs'
import targz from 'targz'
import fs from 'fs'
import path from 'path'
import { rollup } from 'rollup'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import process from 'process'

const baseDir = process.env.npm_config_baseDir
const dest = path.join(baseDir, 'dist/')

let logging = true

export const release = () => {
  return new Promise(resolve => {
    return getName().then(data => {
      return ensureDir().then(() => {
        return Promise.all([
          copyMetadata(),
          copyAppFiles(),
          copyAppSrc(),
          bundleApp(data),
          bundleAppEs5(data),
        ])
          .then(() => pack(data))
          .then(() => {
            data.absolutePath = `${baseDir}/${data.identifier}.tgz`
            log('MPK file created! ', data.absolutePath)
            resolve(data)
          })
      })
    })
  })
}

export const build = () => {
  return new Promise(resolve => {
    return getName()
      .then(data => {
        return Promise.all([copyStartApp(), bundleApp(data), bundleAppEs5(data)]).then(() => {
          data.absolutePath = `${baseDir}/dist/${data.identifier}.tgz`
          log('Files written to ' + data.absolutePath)
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

      const contents = res.toString()
      const data = JSON.parse(contents)

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

const ensureDir = () => {
  return new Promise(resolve => {
    if (fs.existsSync(dest)) shell.rm('-r', dest)

    fs.mkdirSync(dest)

    resolve()
  })
}

const copyMetadata = () => {
  return new Promise(resolve => {
    fs.copyFile(path.join(baseDir, 'metadata.json'), dest, resolve)
  })
}

const copyAppFiles = () => {
  return new Promise(resolve => {
    //note: shelljs is sync
    shell.cp('-r', path.join(baseDir, 'static/'), dest)
    resolve()
  })
}

const copyAppSrc = () => {
  return new Promise(resolve => {
    shell.cp('-r', path.join(baseDir, './src'), dest)
    resolve()
  })
}

const bundleApp = data => {
  let outputOptions = {
    format: 'iife',
    name: 'APP_' + data.identifier.replace(/[^0-9a-zA-Z_$]/g, '_'),
    file: path.join(baseDir, '/dist/appBundle.js'),
  }

  let inputOptions = {
    input: path.join(baseDir, 'src/index.js'),
    plugins: [resolve({ browser: true }), commonjs(), babel()],
  }

  return _bundleApp(inputOptions, outputOptions)
}

const bundleAppEs5 = data => {
  let outputOptionsEs5 = {
    format: 'iife',
    name: 'APP_' + data.identifier.replace(/[^0-9a-zA-Z_$]/g, '_'),
    file: path.join(baseDir, '/dist/appBundle_es5.js'),
  }

  let inputOptionsEs5 = {
    input: path.join(baseDir, 'src/index.js'),
    plugins: [resolve({ browser: true }), commonjs(), babel()],
  }

  return _bundleApp(inputOptionsEs5, outputOptionsEs5)
}

const _bundleApp = (inputOptions, outputOptions) => {
  return new Promise(resolve => {
    rollup(inputOptions)
      .then(bundle => {
        bundle.generate(outputOptions).then(() => {
          bundle.write(outputOptions).then(() => {
            console.log('App bundle written to ' + outputOptions.file)
            resolve()
          })
        })
      })
      .catch(console.error)
  })
}

const copyStartApp = () => {
  fs.copyFile(
    path.join(process.cwd(), 'support/startApp.js'),
    path.join(baseDir, 'dist/startApp.js'),
    err => {
      if (!err) {
        console.log('startApp copied to ' + baseDir + '/dist/startApp.js')
      } else console.error(err)
    }
  )
}

const pack = data => {
  return tar(path.join(baseDir, './dist'), path.join(baseDir, `./${data.identifier}.tgz`))
}

const tar = (src, dest) => {
  console.log('tar', src, dest)
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
