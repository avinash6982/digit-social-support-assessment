import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import type { RootState } from '../store/store'
import { toggleLanguage } from '../store/settingsSlice'

export function useLanguage() {
  const dispatch = useDispatch()
  const language = useSelector((state: RootState) => state.settings.language)
  const { t, i18n } = useTranslation()

  // Synchronize language state with i18next and HTML elements
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language)
    }
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language, i18n])

  const handleToggleLanguage = () => {
    dispatch(toggleLanguage())
  }

  const isRtl = language === 'ar'

  return {
    language,
    toggleLanguage: handleToggleLanguage,
    isRtl,
    t
  }
}

export default useLanguage
