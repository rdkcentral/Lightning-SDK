import Platform from '../Platform'
import adsHandler from './adsHandler'

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
  adsHandler,
  set getAds(getAdsFn) {
    this.adsHandler &&
      this.adsHandler.setGetAds &&
      typeof this.adsHandler.setGetAds === 'function' &&
      this.adsHandler.setGetAds(this, getAdsFn)
  },
}
