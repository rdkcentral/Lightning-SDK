import Platform from '../Platform'

export default {
  config() {
    return Platform.get('advertising.config')
  },
  policy() {
    return Platform.get('advertising.policy')
  },
  advertisingId(reset = false) {
    return reset
      ? Platform.get('advertising.advertisingId')
      : // 'set null' means 'recreate new id'
        Platform.set('advertising.advertisingId', null)
  },
  deviceAttributes() {
    return Platform.get('advertising.deviceAttributes')
  },
  appStoreId() {
    return Platform.get('advertising.appStoreId')
  },
}
