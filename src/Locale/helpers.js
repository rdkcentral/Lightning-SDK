import Utils from '../Utils/index'

export const loadTranslationFile = (isoLocale, defaultLocale) => {
  const localePath = Utils.asset(`locale/${isoLocale}.json`)
  const localeDefaultPath = Utils.asset(`locale/${defaultLocale}.json`)

  return fetch(localePath).then(response => {
    if (response.ok) return response.json()
    console.warn(`Locale: ${isoLocale}.json - ${response.statusText}`)
    console.warn(`Locale: Defaulting to /${defaultLocale}.json`)

    return fetch(localeDefaultPath).then(response => {
      if (response.ok) return response.json()
      console.warn(`Locale: ${isoLocale}.json - ${response.statusText}`)
      return false
    })
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

// Returns locale if naming is correct, else returns default locale
export const isCorrectLocale = (locale, defaultLocale) => {
  const isLocale = new RegExp('^([a-zA-Z][a-zA-Z]-[a-zA-Z][a-zA-Z])(?!.)')
  if (isLocale.test(locale)) return formatLocale(locale)
  console.warn(`Locale: ${locale} is invalid, switching to default`)
  return defaultLocale
}

// Returns corrected locale, en-US instead of en-us or EN-us
const formatLocale = locale => {
  const prefix = locale.slice(0, 2).toLowerCase()
  const postfix = locale.slice(3, 5).toUpperCase()
  return `${prefix}-${postfix}`
}
