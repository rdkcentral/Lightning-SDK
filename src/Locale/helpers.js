// import Utils from '../Utils/index'

export const loadTranslationFile = isoLocale => {
  // const basePath = Utils.asset(`locale/${isoLocale}.json`) // Is too late
  const basePath = `static/locale/${isoLocale}.json` // Testing

  return fetch(basePath).then(response => {
    if (response.ok) return response.json()
    console.warn(`Locale: ${isoLocale}.json - ${response.statusText}`)
    return false
  })
}

// Replaces integers within brackets {0} or { 1 } with given arguments
export const format = (text, args) => {
  // Flatten array, accepts array or multiple arguments
  args = args.flat(Infinity)

  return args.reduce((previousText, currentText, index) => {
    // Takes accidental extra spaces into account within curly brackets {} and the number
    const integerWithinBrackets = new RegExp(`\\{\\s*(${index})\\s*}`)
    return previousText.replace(integerWithinBrackets, currentText)
  }, text)
}

// Returns corrected locale, en-US instead of EN_us or en-us
export const correctLocale = (locale, defaultLocale) => {
  try {
    Intl.getCanonicalLocales(locale)
    return Intl.getCanonicalLocales(locale)[0]
  } catch (e) {
    console.warn(e)
    return defaultLocale
  }
}
