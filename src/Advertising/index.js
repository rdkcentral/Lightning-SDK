import Platform from '../Platform'

export default {
  config() {
    return Platform.get('advertising.config')
  },
  policy() {
    return Platform.get('advertising.policy')
  },
  advertisingId() {
    return Platform.get('advertising.advertisingId')
  },
  deviceAttributes() {
    return Platform.get('advertising.deviceAttributes')
  },
  appStoreId() {
    return Platform.get('advertising.appStoreId')
  },
}
