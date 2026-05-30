import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Chip from '../components/Chip'
import Text from '../components/Text'
import { GlobeIcon, ArrowIcon } from '../components/Icons'
import { useLanguage } from '../hooks/useLanguage'

export function Home() {
  const navigate = useNavigate()
  const { language, toggleLanguage, isRtl, t } = useLanguage()
  
  const [isExplored, setIsExplored] = useState(false)
  const [systemTime, setSystemTime] = useState('')

  // Live premium clock indicator
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const locale = language === 'ar' ? 'ar-EG' : 'en-US'
      setSystemTime(
        now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [language])

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
          onClick={toggleLanguage}
          className="py-1.5 px-4 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-all active:scale-95"
          aria-label="Toggle Language"
        >
          <GlobeIcon size={14} />
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

      {/* Primary Explorer & Application Action Buttons Row */}
      <div className={`flex flex-col sm:flex-row gap-4 mt-6 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
        <Button 
          variant="primary" 
          onClick={() => setIsExplored(!isExplored)}
          aria-label="Toggle Portal Exploration"
          className="active:scale-98 flex-1 justify-center"
          icon={
            <ArrowIcon 
              size={16}
              className={`transition-transform duration-300 ${isExplored ? (isRtl ? '-rotate-90' : 'rotate-90') : ''}`}
            />
          }
        >
          {isExplored ? t('i18n_5') : t('i18n_4')}
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate('/apply')}
          aria-label="Go to Apply Page"
          className="active:scale-98 border-dashed hover:border-solid border-teal-500/40 dark:border-teal-400/30 text-teal-600 dark:text-teal-400"
        >
          {t('i18n_12')}
        </Button>
      </div>

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

export default Home
