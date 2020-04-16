import Profile from '../Profile/index'
import { loadTranslationFile, format } from './helpers'

const defaultLocale = 'en-US'
let loadedLanguageFile = undefined

// Init
export const initLocale = async () => {
  return Profile.locale().then(locale => {
    return setLocale(locale)
  })
}

// public API Locale
export default {
  get(attributeName, ...args) {
    if (!(loadedLanguageFile && loadedLanguageFile[attributeName])) return attributeName
    if (args && args.length > 0) return format(loadedLanguageFile[attributeName], args)
    return loadedLanguageFile[attributeName]
  },

  // Set ISO locale code aka: 'en-US, nl-NL, etc' default is en-US.
  setLocale(locale) {
    return setLocale(locale)
  },
}

const setLocale = locale => {
  return loadTranslationFile(locale, defaultLocale).then(languageFile => {
    if (languageFile) loadedLanguageFile = languageFile
  })
}
