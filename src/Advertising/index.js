import Platform from '../Platform'
import Ads from '../Ads'

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
      : // transport layer should interpret 'set null' as 'recreate new id'
        Platform.set('Advertising.advertisingId', null)
  },
  // what kind of data does this return?
  deviceAttributes() {
    return Platform.get('Advertising.deviceAttributes')
  },
  // good name?
  appStoreId() {
    return Platform.get('Advertising.appStoreId')
  },
  adsHandler: Ads,
  setGetAds() {
    this.adsHandler &&
      this.adsHandler.setGetAds &&
      typeof this.adshandler.setGetAds === 'function' &&
      this.adsHandler.setGetAds.apply(this.adsHandler, arguments)
  },
}
