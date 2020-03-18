import { getLocale, getLanguage, getCountryCode, getLatLon } from './helpers'

export const initDefaults = () => {
  defaultProfile.locale = getLocale()
  defaultProfile.language = getLanguage()
  defaultProfile.countryCode = getCountryCode()
  defaultProfile.latlon = getLatLon()
}

export const defaultProfile = {
  ageRating: 'adult',
  city: 'New York',
  countryCode: 'US',
  ip: '127.0.0.1',
  household: 'b2244e9d4c04826ccd5a7b2c2a50e7d4',
  language: 'en',
  latlon: [40.7128, 74.006],
  locale: 'en-US',
  mac: '00:00:00:00:00:00',
  operator: 'Metrological',
  platform: 'Metrological',
  packages: [],
  uid: 'ee6723b8-7ab3-462c-8d93-dbf61227998e',
  stbType: 'Metrological',
}
