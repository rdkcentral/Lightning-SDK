import Platform from '../Platform'
import adsHandler from './adsHandler'

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
  adsHandler,
  set getAds(getAdsFn) {
    this.adsHandler &&
      this.adsHandler.setGetAds &&
      typeof this.adsHandler.setGetAds === 'function' &&
      this.adsHandler.setGetAds(this, getAdsFn)
  },
}
