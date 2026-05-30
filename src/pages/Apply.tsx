import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import { useLanguage } from '../hooks/useLanguage'
import { WizardProvider, useWizard } from '../context/WizardContext'

const labelClasses = "text-[11px] font-bold tracking-wide text-slate-400 dark:text-slate-500 uppercase select-none";
const inputClasses = "bg-slate-500/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all duration-300 w-full text-slate-800 dark:text-white placeholder:text-slate-400/50";

function ApplyContent() {
  const navigate = useNavigate()
  const { isRtl, t } = useLanguage()
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

  const textAlignmentClass = isRtl ? 'text-right' : 'text-left';

  return (
    <Card hoverable={true} className="w-full max-w-4xl mx-auto">
      {/* Sleek Compact Progress Indicator */}
      <div className="mb-6 select-none animate-[fadeIn_0.3s_ease-out_forwards]">
        <div className={`flex items-center justify-between gap-4 mb-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {isRtl 
              ? `الخطوة ${currentStep === 1 ? '١' : currentStep === 2 ? '٢' : '٣'} من ٣` 
              : `Step ${currentStep} of 3`
            }
          </span>
          <span className="text-xs font-extrabold text-teal-500 dark:text-teal-400 uppercase tracking-wider">
            {stepTitles[currentStep - 1]}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-200/30 dark:bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(20,184,166,0.4)]"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Tactile Support Form */}
      <form onSubmit={handleNext} className="mt-6 flex flex-col gap-6">
        
        {/* Step 1 View: Personal Information */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 animate-[fadeIn_0.3s_ease-out_forwards]">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="name" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_14')}
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder={isRtl ? 'أدخل اسمك الكامل' : 'John Doe'}
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className={`${inputClasses} ${textAlignmentClass}`}
              />
            </div>

            {/* National ID / Iqama */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="nationalId" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_22')}
              </label>
              <input
                id="nationalId"
                type="text"
                required
                placeholder={t('i18n_23')}
                value={formData.nationalId}
                onChange={(e) => updateFormData('nationalId', e.target.value)}
                className={`${inputClasses} ${textAlignmentClass}`}
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="dob" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_24')}
              </label>
              <input
                id="dob"
                type="date"
                required
                value={formData.dob}
                onChange={(e) => updateFormData('dob', e.target.value)}
                className={`${inputClasses} ${textAlignmentClass}`}
              />
            </div>

            {/* Gender Dropdown */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="gender" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_25')}
              </label>
              <div className="relative">
                <select
                  id="gender"
                  required
                  value={formData.gender}
                  onChange={(e) => updateFormData('gender', e.target.value)}
                  className={`${inputClasses} ${textAlignmentClass} pr-10 appearance-none`}
                >
                  <option value="" disabled className="text-slate-400 dark:bg-slate-800">{t('i18n_26')}</option>
                  <option value="Male" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_27')}</option>
                  <option value="Female" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_28')}</option>
                  <option value="Other" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_29')}</option>
                </select>
                <div className={`pointer-events-none absolute inset-y-0 flex items-center px-4 text-slate-400 ${isRtl ? 'left-0' : 'right-0'}`}>
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Residence Address */}
            <div className="flex flex-col gap-1.5 text-left md:col-span-2">
              <label htmlFor="address" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_30')}
              </label>
              <input
                id="address"
                type="text"
                required
                placeholder={t('i18n_31')}
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                className={`${inputClasses} ${textAlignmentClass}`}
              />
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="city" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_32')}
              </label>
              <input
                id="city"
                type="text"
                required
                placeholder={t('i18n_33')}
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                className={`${inputClasses} ${textAlignmentClass}`}
              />
            </div>

            {/* State / Province */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="state" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_34')}
              </label>
              <input
                id="state"
                type="text"
                required
                placeholder={t('i18n_35')}
                value={formData.state}
                onChange={(e) => updateFormData('state', e.target.value)}
                className={`${inputClasses} ${textAlignmentClass}`}
              />
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="country" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_36')}
              </label>
              <input
                id="country"
                type="text"
                required
                placeholder={t('i18n_37')}
                value={formData.country}
                onChange={(e) => updateFormData('country', e.target.value)}
                className={`${inputClasses} ${textAlignmentClass}`}
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="phone" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_38')}
              </label>
              <input
                id="phone"
                type="tel"
                required
                placeholder={t('i18n_39')}
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className={`${inputClasses} ${textAlignmentClass}`}
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5 text-left md:col-span-2">
              <label htmlFor="email" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_15')}
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder={t('i18n_40')}
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className={`${inputClasses} ${textAlignmentClass}`}
              />
            </div>
          </div>
        )}

        {/* Step 2 View: Family & Financial Info */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 animate-[fadeIn_0.3s_ease-out_forwards]">
            {/* Marital Status */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="maritalStatus" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_41')}
              </label>
              <div className="relative">
                <select
                  id="maritalStatus"
                  required
                  value={formData.maritalStatus}
                  onChange={(e) => updateFormData('maritalStatus', e.target.value)}
                  className={`${inputClasses} ${textAlignmentClass} pr-10 appearance-none`}
                >
                  <option value="" disabled className="text-slate-400 dark:bg-slate-800">{t('i18n_42')}</option>
                  <option value="Single" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_43')}</option>
                  <option value="Married" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_44')}</option>
                  <option value="Divorced" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_45')}</option>
                  <option value="Widowed" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_46')}</option>
                </select>
                <div className={`pointer-events-none absolute inset-y-0 flex items-center px-4 text-slate-400 ${isRtl ? 'left-0' : 'right-0'}`}>
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Number of Dependents */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="dependents" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_47')}
              </label>
              <input
                id="dependents"
                type="number"
                min="0"
                required
                placeholder={t('i18n_48')}
                value={formData.dependents}
                onChange={(e) => updateFormData('dependents', e.target.value)}
                className={`${inputClasses} ${textAlignmentClass}`}
              />
            </div>

            {/* Employment Status */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="employmentStatus" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_49')}
              </label>
              <div className="relative">
                <select
                  id="employmentStatus"
                  required
                  value={formData.employmentStatus}
                  onChange={(e) => updateFormData('employmentStatus', e.target.value)}
                  className={`${inputClasses} ${textAlignmentClass} pr-10 appearance-none`}
                >
                  <option value="" disabled className="text-slate-400 dark:bg-slate-800">{t('i18n_50')}</option>
                  <option value="Employed" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_51')}</option>
                  <option value="Unemployed" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_52')}</option>
                  <option value="Self-Employed" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_53')}</option>
                  <option value="Retired" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_54')}</option>
                  <option value="Student" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_55')}</option>
                </select>
                <div className={`pointer-events-none absolute inset-y-0 flex items-center px-4 text-slate-400 ${isRtl ? 'left-0' : 'right-0'}`}>
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Monthly Income */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="monthlyIncome" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_56')}
              </label>
              <input
                id="monthlyIncome"
                type="number"
                min="0"
                required
                placeholder={t('i18n_57')}
                value={formData.monthlyIncome}
                onChange={(e) => updateFormData('monthlyIncome', e.target.value)}
                className={`${inputClasses} ${textAlignmentClass}`}
              />
            </div>

            {/* Housing Status */}
            <div className="flex flex-col gap-1.5 text-left md:col-span-2">
              <label htmlFor="housingStatus" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_58')}
              </label>
              <div className="relative">
                <select
                  id="housingStatus"
                  required
                  value={formData.housingStatus}
                  onChange={(e) => updateFormData('housingStatus', e.target.value)}
                  className={`${inputClasses} ${textAlignmentClass} pr-10 appearance-none`}
                >
                  <option value="" disabled className="text-slate-400 dark:bg-slate-800">{t('i18n_59')}</option>
                  <option value="Owned" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_60')}</option>
                  <option value="Rented" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_61')}</option>
                  <option value="Shared" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_62')}</option>
                  <option value="Temporary" className="text-slate-800 dark:text-white dark:bg-slate-800">{t('i18n_63')}</option>
                </select>
                <div className={`pointer-events-none absolute inset-y-0 flex items-center px-4 text-slate-400 ${isRtl ? 'left-0' : 'right-0'}`}>
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 View: Situation Descriptions */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-5 animate-[fadeIn_0.3s_ease-out_forwards]">
            {/* Current Financial Situation */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="currentFinancialSituation" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_64')}
              </label>
              <textarea
                id="currentFinancialSituation"
                required
                rows={3}
                placeholder={t('i18n_65')}
                value={formData.currentFinancialSituation}
                onChange={(e) => updateFormData('currentFinancialSituation', e.target.value)}
                className={`${inputClasses} ${textAlignmentClass} resize-none`}
              />
            </div>

            {/* Employment Circumstances */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="employmentCircumstances" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_66')}
              </label>
              <textarea
                id="employmentCircumstances"
                required
                rows={3}
                placeholder={t('i18n_67')}
                value={formData.employmentCircumstances}
                onChange={(e) => updateFormData('employmentCircumstances', e.target.value)}
                className={`${inputClasses} ${textAlignmentClass} resize-none`}
              />
            </div>

            {/* Reason for Applying */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="reasonForApplying" className={`${labelClasses} ${textAlignmentClass}`}>
                {t('i18n_68')}
              </label>
              <textarea
                id="reasonForApplying"
                required
                rows={3}
                placeholder={t('i18n_69')}
                value={formData.reasonForApplying}
                onChange={(e) => updateFormData('reasonForApplying', e.target.value)}
                className={`${inputClasses} ${textAlignmentClass} resize-none`}
              />
            </div>
          </div>
        )}

        {/* Action Buttons Row */}
        <div className={`flex flex-col sm:flex-row gap-4 mt-6 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
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
