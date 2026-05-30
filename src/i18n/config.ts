import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEN from './locales/en.json'
import translationAR from './locales/ar.json'

const resources = {
  en: {
    translation: translationEN
  },
  ar: {
    translation: translationAR
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes by default
    }
  })

export default i18n
