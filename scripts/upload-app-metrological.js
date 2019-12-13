import { release } from './package'
import fs from 'fs'
import https from 'https'
import FormData from 'form-data'
import readline from 'readline'
import process from 'process'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let intervalId = 0

const checkLoginStatus = key => {
  let data = ''
  return new Promise((resolve, reject) => {
    https.get(
      'https://api.metrological.com/api/authentication/login-status',
      {
        headers: {
          'X-Api-Token': key,
        },
      },
      res => {
        res.on('data', chunk => {
          data += chunk.toString()
        })
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(new Error('Incorrect API key or not logged in to metrological dashboard'))
          }

          const { securityContext } = JSON.parse(data)
          return resolve(securityContext[0])
        })
      }
    )
  })
}

const log = (color, message) => {
  console.clear()
  console.log(color, message)
}

const handleData = chunk => {
  const status = JSON.parse(chunk.toString())
  if (status.success !== undefined) {
    return onReady()
  } else if (status.error !== undefined) {
    return onError(status)
  }
}

const handleOnEnd = res => {
  if (res.statusCode !== 200) {
    onError({ error: 'something went wrong' })
  }
}

const onReady = () => {
  console.clear()
  log('\x1b[32m%s\x1b[0m', 'Succesfully uploaded!')
  process.exit()
}

function onError(data = {}) {
  const error = UPLOAD_ERRORS[data.error]
  if (error) {
    log('\x1b[31m%s\x1b[0m', `${error}`)
  } else {
    log('\x1b[31m%s\x1b[0m', `${data.error}`)
  }
}

function startLoader() {
  const pattern = ['◢', '◣', '◤', '◥']
  let x = 0
  intervalId = setInterval(() => {
    log('\x1b[36m%s\x1b[0m', `\ruploading ${pattern[x++]} \r`)
    x &= 3
  }, 60)
}

const UPLOAD_ERRORS = {
  version_already_exists: 'The current version of your app already exists',
  missing_field_file: 'There is a missing field',
  app_belongs_to_other_user: 'You are not the owner of this app',
}

const upload = key => {
  rl.close()
  startLoader()
  checkLoginStatus(key)
    .then(({ type }) => {
      release().then(response => {
        if (!response || !response.version || !response.identifier || !response.absolutePath)
          throw new Error('Version, Identifier or absolutePath not specified in metadata.json.')

        const options = {
          host: 'api.metrological.com',
          path: `/api/${type}/app-store/upload-lightning`,
          protocol: 'https:',
          headers: {
            'X-Api-Token': key,
          },
        }

        const form = new FormData()

        form.append('id', response.identifier)
        form.append('version', response.version)
        form.append('upload', fs.createReadStream(response.absolutePath))

        form.submit(options, (err, res) => {
          clearInterval(intervalId)
          if (err) {
            console.log(err)
            return
          }
          res.on('data', chunk => handleData(chunk))
          res.on('end', () => handleOnEnd(res))
        })
      })
    })
    .catch(err => {
      clearInterval(intervalId)
      log('\x1b[31m%s\x1b[0m', err)
    })
}

if (process.env.KEY === undefined || process.env.KEY === '')
  rl.question('Please provide API key: ', upload)
else upload(process.env.KEY)
