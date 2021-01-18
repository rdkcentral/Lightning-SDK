import Platform from '../Platform'
import adsHandler from './adsHandler'

export default {
  config() {
    return Platform.get('Advertising.config')
  },
  policy() {
    return Platform.get('Advertising.policy')
  },
  advertisingId(reset = false) {
    return reset
      ? Platform.get('Advertising.advertisingId')
      : // 'set null' means 'recreate new id'
        Platform.set('Advertising.advertisingId', null)
  },
  deviceAttributes() {
    return Platform.get('Advertising.deviceAttributes')
  },
  appStoreId() {
    return Platform.get('Advertising.appStoreId')
  },
  adsHandler,
  set getAds(getAdsFn) {
    this.adsHandler &&
      this.adsHandler.setGetAds &&
      typeof this.adsHandler.setGetAds === 'function' &&
      this.adsHandler.setGetAds(this, getAdsFn)
  },
}
