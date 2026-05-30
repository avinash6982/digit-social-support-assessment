import { useTranslation } from 'react-i18next'

export function useLanguage() {
  const { t, i18n } = useTranslation()

  // Dynamic language/directionality toggler
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(nextLang)
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = nextLang
  }

  const isRtl = i18n.language === 'ar'

  return {
    language: i18n.language,
    toggleLanguage,
    isRtl,
    t
  }
}

export default useLanguage
