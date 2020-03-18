const formatLocale = locale => {
  if (locale && locale.length === 2) {
    return `${locale.toLowerCase()}-${locale.toUpperCase()}`
  } else {
    return locale
  }
}

export const getLocale = () => {
  if ('language' in navigator) {
    const locale = formatLocale(navigator.language)
    return Promise.resolve(locale)
  } else {
    return Promise.resolve('en-US')
  }
}

export const getLanguage = () => {
  if ('language' in navigator) {
    const language = formatLocale(navigator.language).slice(0, 2)
    return Promise.resolve(language)
  } else {
    return Promise.resolve('en')
  }
}

export const getCountryCode = () => {
  if ('language' in navigator) {
    const countryCode = formatLocale(navigator.language).slice(3, 5)
    return Promise.resolve(countryCode)
  } else {
    return Promise.resolve('US')
  }
}

export const getLatLon = () => {
  const geoLocationSuccess = success => {
    const coords = success && success.coords
    return Promise.resolve([coords.latitude, coords.longitude])
  }
  const geoLocationError = error => {
    console.warn('Could not load geolocation ', error)
    return Promise.resolve([40.7128, 74.006])
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
  }
}
