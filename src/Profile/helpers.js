const formatLocale = locale => {
  if (locale && locale.length === 2) {
    return `${locale.toLowerCase()}-${locale.toUpperCase()}`
  } else {
    return locale
  }
}

export const getLocale = defaultValue => {
  if ('language' in navigator) {
    const locale = formatLocale(navigator.language)
    return Promise.resolve(locale)
  } else {
    return Promise.resolve(defaultValue)
  }
}

export const getLanguage = defaultValue => {
  if ('language' in navigator) {
    const language = formatLocale(navigator.language).slice(0, 2)
    return Promise.resolve(language)
  } else {
    return Promise.resolve(defaultValue)
  }
}

export const getCountryCode = defaultValue => {
  if ('language' in navigator) {
    const countryCode = formatLocale(navigator.language).slice(3, 5)
    return Promise.resolve(countryCode)
  } else {
    return Promise.resolve(defaultValue)
  }
}

export const getLatLon = defaultValue => {
  return new Promise(resolve => {
    const geoLocationSuccess = success => {
      const coords = success && success.coords
      return resolve([coords.latitude, coords.longitude])
    }
    const geoLocationError = error => {
      return resolve(defaultValue)
    }
    const geoLocationOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        geoLocationSuccess,
        geoLocationError,
        geoLocationOptions
      )
    } else {
      return resolve(defaultValue)
    }
  })
}
