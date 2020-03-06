export const initDefaults = () => {
  fetch('https://jsonip.metrological.com/?maf=true')
    .then(data => data.json())
    .then(data => {
      defaults.city = data.geo.city ? data.geo.city : 'New York'
      defaults.countryCode = data.geo.country ? data.geo.country : 'US'
      defaults.latlon = data.geo.ll ? data.geo.ll : [40.7128, 74.006]
      defaults.ip = data.ip ? data.ip : '127.0.0.1'
    })
}

export const defaults = {
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
