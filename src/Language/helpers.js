import Log from '../Log/index'
import Utils from '../Utils/index'

export const loadTranslationFile = (isoLocale, defaultLocale) => {
  isoLocale = isCorrectLocale(isoLocale, defaultLocale)
  const languagePath = Utils.asset(`language/${isoLocale}.json`)
  const languageDefaultPath = Utils.asset(`language/${defaultLocale}.json`)
  const sameAsDefaultPath = languagePath === languageDefaultPath
  const noDefaultWarn = `Language: ${defaultLocale}.json does not exist, please add file to static/language/`
  const defaultingWarn = `Language: ${isoLocale}.json does not exist, defaulting to ${defaultLocale}.json`

  return fetch(languagePath)
    .then(response => response.json())
    .then(translationFile => {
      return translationFile
    })
    .catch(() => {
      Log.warn(sameAsDefaultPath ? noDefaultWarn : defaultingWarn)
      if (sameAsDefaultPath) return
      return fetch(languageDefaultPath)
        .then(response => response.json())
        .then(translationFile => {
          return translationFile
        })
        .catch(() => {
          Log.warn(noDefaultWarn)
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
  Log.warn(`Language: ${locale} is invalid, switching to default`)
  return defaultLocale
}

// Returns corrected locale, en-US instead of en-us or EN-us
const formatLocale = locale => {
  const prefix = locale.slice(0, 2).toLowerCase()
  const postfix = locale.slice(3, 5).toUpperCase()
  return `${prefix}-${postfix}`
}
