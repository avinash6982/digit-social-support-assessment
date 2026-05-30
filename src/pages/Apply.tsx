import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Chip from '../components/Chip'
import Text from '../components/Text'
import { GlobeIcon } from '../components/Icons'
import { useLanguage } from '../hooks/useLanguage'
import { WizardProvider, useWizard } from '../context/WizardContext'

function ApplyContent() {
  const navigate = useNavigate()
  const { toggleLanguage, isRtl, t } = useLanguage()
  const { currentStep, formData, updateFormData, nextStep, prevStep, resetForm } = useWizard()

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < 3) {
      nextStep()
    } else {
      resetForm()
      navigate('/success')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      prevStep()
    } else {
      navigate('/')
    }
  }

  // Define step headers in both English and Arabic
  const stepTitles = [
    isRtl ? 'المعلومات الشخصية' : 'Personal Information',
    isRtl ? 'المعلومات العائلية والمالية' : 'Family & Financial Info',
    isRtl ? 'شرح الحالة' : 'Situation Descriptions'
  ]

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

      {/* Stepper Progress Bar */}
      <div className="mb-8 select-none">
        <div className={`flex justify-between items-center gap-2 relative ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1
            const isActive = stepNum === currentStep
            const isCompleted = stepNum < currentStep

            return (
              <React.Fragment key={idx}>
                {/* Step Node */}
                <div className="flex flex-col items-center flex-1 relative z-10">
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 border ${
                      isActive 
                        ? 'bg-teal-500 text-white border-teal-500 shadow-[0_0_12px_rgba(20,184,166,0.4)]'
                        : isCompleted
                          ? 'bg-teal-500/10 text-teal-500 border-teal-500/40'
                          : 'bg-slate-500/5 text-slate-400 border-slate-200/50 dark:border-white/5'
                    }`}
                  >
                    {isCompleted ? '✓' : stepNum}
                  </div>
                  <span className={`text-[10px] mt-2 font-semibold tracking-wide whitespace-nowrap ${
                    isActive ? 'text-teal-500 font-bold' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {title}
                  </span>
                </div>
                
                {/* Connecting Line (except for last) */}
                {idx < 2 && (
                  <div className="flex-1 h-[2px] bg-slate-200/30 dark:bg-white/5 mx-[-8px] mb-6 relative">
                    <div 
                      className="absolute left-0 top-0 h-full bg-teal-500 transition-all duration-500" 
                      style={{ 
                        width: currentStep > idx + 1 ? '100%' : '0%',
                        right: isRtl ? 0 : 'auto',
                        left: isRtl ? 'auto' : 0
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Dynamic Step Content Title */}
      <Text variant="h1" className="text-xl sm:text-2xl">
        {stepTitles[currentStep - 1]}
      </Text>

      {/* Tactile Support Form */}
      <form onSubmit={handleNext} className="mt-6 flex flex-col gap-6 text-left">
        {/* Step 1 View */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-2 animate-[fadeIn_0.3s_ease-out_forwards]">
            <label 
              htmlFor="personalInfo"
              className={`text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500 uppercase ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {isRtl ? 'المعلومات الشخصية (الاسم أو التفاصيل)' : 'Personal Details'}
            </label>
            <input
              id="personalInfo"
              type="text"
              required
              placeholder={isRtl ? 'أدخل معلوماتك الشخصية...' : 'Enter your personal details...'}
              value={formData.personalInfo}
              onChange={(e) => updateFormData('personalInfo', e.target.value)}
              className={`bg-slate-500/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all duration-300 w-full text-slate-800 dark:text-white placeholder:text-slate-400/50 ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </div>
        )}

        {/* Step 2 View */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-2 animate-[fadeIn_0.3s_ease-out_forwards]">
            <label 
              htmlFor="familyFinancialInfo"
              className={`text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500 uppercase ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {isRtl ? 'معلومات العائلة والدخل المالي' : 'Family & Financial Details'}
            </label>
            <input
              id="familyFinancialInfo"
              type="text"
              required
              placeholder={isRtl ? 'أدخل التفاصيل المالية والعائلية...' : 'Enter family and financial details...'}
              value={formData.familyFinancialInfo}
              onChange={(e) => updateFormData('familyFinancialInfo', e.target.value)}
              className={`bg-slate-500/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all duration-300 w-full text-slate-800 dark:text-white placeholder:text-slate-400/50 ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </div>
        )}

        {/* Step 3 View */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-2 animate-[fadeIn_0.3s_ease-out_forwards]">
            <label 
              htmlFor="situationDescription"
              className={`text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500 uppercase ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {isRtl ? 'وصف الحالة بالتفصيل' : 'Situation & Case Descriptions'}
            </label>
            <textarea
              id="situationDescription"
              required
              rows={4}
              placeholder={isRtl ? 'صف ظروفك أو متطلبات الحالة هنا...' : 'Describe your current situation and details here...'}
              value={formData.situationDescription}
              onChange={(e) => updateFormData('situationDescription', e.target.value)}
              className={`bg-slate-500/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all duration-300 w-full text-slate-800 dark:text-white placeholder:text-slate-400/50 resize-none ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </div>
        )}

        {/* Action Buttons Row */}
        <div className={`flex flex-col sm:flex-row gap-4 mt-4 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
          <Button 
            variant="primary" 
            type="submit"
            aria-label={currentStep === 3 ? 'Submit Request' : 'Next Step'}
            className="flex-1 justify-center active:scale-98"
          >
            {currentStep === 3 
              ? (isRtl ? 'إرسال الطلب' : 'Submit Request') 
              : (isRtl ? 'الخطوة التالية' : 'Next Step')
            }
          </Button>

          <Button 
            variant="secondary"
            type="button"
            onClick={handleBack}
            aria-label="Go Back"
            className="justify-center active:scale-98"
          >
            {isRtl ? 'رجوع' : 'Go Back'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export function Apply() {
  return (
    <WizardProvider>
      <ApplyContent />
    </WizardProvider>
  )
}

export default Apply
