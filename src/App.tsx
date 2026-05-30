import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Card from './components/Card'
import Button from './components/Button'
import Chip from './components/Chip'
import Text from './components/Text'

function App() {
  const { t, i18n } = useTranslation()
  const [isExplored, setIsExplored] = useState(false)
  const [systemTime, setSystemTime] = useState('')

  // Live premium clock indicator
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // Adjust active clock display to respect language locale
      const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US'
      setSystemTime(
        now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [i18n.language])

  // Dynamic language/directionality toggler
  const handleLanguageToggle = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(nextLang)
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = nextLang
  }

  const isRtl = i18n.language === 'ar'

  return (
    <Card hoverable={true}>
      {/* Top Header Row with Version Badge and Language Switcher */}
      <div className={`flex items-center justify-between mb-8 pb-4 border-b border-slate-100/50 dark:border-white/5 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
        <Chip dot={true} dotColor="teal">
          {t('i18n_1')}
        </Chip>

        {/* Elegant Language Switcher Button */}
        <Button 
          variant="secondary" 
          onClick={handleLanguageToggle}
          className="py-1.5 px-4 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-all active:scale-95"
          aria-label="Toggle Language"
        >
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          {isRtl ? 'English' : 'العربية'}
        </Button>
      </div>

      {/* Main Hello World Title */}
      <Text variant="h1">
        {t('i18n_2')}
      </Text>
      
      {/* Beautiful Interactive Subtitle */}
      <Text variant="body">
        {t('i18n_3')}
      </Text>

      {/* Modern Interactive Action Button */}
      <Button 
        variant="primary" 
        onClick={() => setIsExplored(!isExplored)}
        aria-label="Toggle Portal Exploration"
        className="active:scale-98"
        icon={
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${isExplored ? (isRtl ? '-rotate-90' : 'rotate-90') : ''}`}
          >
            <path d={isRtl ? 'M19 12H5' : 'M5 12h14'}></path>
            <path d={isRtl ? 'm12 19-7-7 7-7' : 'm12 5 7 7-7 7'}></path>
          </svg>
        }
      >
        {isExplored ? t('i18n_5') : t('i18n_4')}
      </Button>

      {/* Dynamic explored panel */}
      {isExplored && (
        <div className="mt-6 p-4 bg-teal-500/5 border border-dashed border-teal-500/30 rounded-2xl text-sm text-teal-500 dark:text-teal-400 text-center animate-[fadeIn_0.5s_ease-out_forwards]">
          {t('i18n_6')}
        </div>
      )}

      {/* Sub-card details section showcasing structural metrics */}
      <div className={`mt-9 pt-6 border-t border-slate-200/50 dark:border-white/10 flex justify-around gap-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="flex flex-col items-center gap-1">
          <Text variant="label">{t('i18n_7')}</Text>
          <Text variant="value" className="text-teal-500 dark:text-teal-400">{t('i18n_8')}</Text>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Text variant="label">{t('i18n_9')}</Text>
          <Text variant="value">{t('i18n_10')}</Text>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Text variant="label">{t('i18n_11')}</Text>
          <Text variant="value">{systemTime || '--:--:--'}</Text>
        </div>
      </div>
    </Card>
  )
}

export default App
