import Locale from './'
import Profile from '../Profile/index'
import { loadTranslationFile, format, isCorrectLocale } from './helpers'

const defaultLocale = 'en-US'
let loadedLanguageFile = undefined

// Init
export const initLocale = async () => {
  return Profile.locale().then(locale => {
    return Locale.setLocale(locale).then(isSet => {
      return isSet
    })
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
    return loadTranslationFile(isCorrectLocale(locale, defaultLocale)).then(languageFile => {
      if (languageFile) {
        loadedLanguageFile = languageFile
        return true
      }
      console.warn('Locale: could not set locale:' + locale)
      return false
    })
  },
}
