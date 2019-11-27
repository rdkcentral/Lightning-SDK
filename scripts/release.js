import { release } from './package.js'

release({ type: release }).then(() => {
  console.log('\x1b[32m%s\x1b[0m', 'success')
})
