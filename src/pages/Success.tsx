import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Chip from '../components/Chip'
import Text from '../components/Text'
import { GlobeIcon } from '../components/Icons'
import { useLanguage } from '../hooks/useLanguage'

export function Success() {
  const navigate = useNavigate()
  const { toggleLanguage, isRtl, t } = useLanguage()

  return (
    <Card hoverable={true}>
      {/* Top Header Row */}
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

      {/* Pulsing Success Checkmark Illustration */}
      <div className="flex justify-center mb-6">
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-teal-500/10 dark:bg-teal-500/5 border border-teal-500/30 dark:border-teal-500/20 animate-pulse">
          {/* Internal glowing circle */}
          <div className="absolute inset-2 rounded-full bg-teal-500/20 dark:bg-teal-500/10 animate-ping opacity-75"></div>
          {/* Checkmark SVG */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-10 h-10 text-teal-500 dark:text-teal-400 z-10 drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      {/* Success Title */}
      <Text variant="h1">
        {t('i18n_19')}
      </Text>
      
      {/* Success Subtext */}
      <Text variant="body" className="max-w-md mx-auto">
        {t('i18n_20')}
      </Text>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-center">
        <Button 
          variant="primary" 
          onClick={() => navigate('/')}
          aria-label="Return Home"
          className="px-8 justify-center active:scale-98"
        >
          {t('i18n_21')}
        </Button>
      </div>
    </Card>
  )
}

export default Success
