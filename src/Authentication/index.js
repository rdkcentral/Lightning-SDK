import Transport from '../Transport'

export default {
  token() {
    return Transport.send('authentication', 'token')
  },
}
