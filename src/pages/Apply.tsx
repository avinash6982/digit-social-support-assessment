import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useBlocker } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Card from '../components/Card'
import Button from '../components/Button'
import FormField from '../components/FormField'
import FormSelect from '../components/FormSelect'
import FormTextarea from '../components/FormTextarea'
import UnsavedChangesModal from '../components/UnsavedChangesModal'
import AIAssistPopup from '../components/AIAssistPopup'
import { useLanguage } from '../hooks/useLanguage'
import { useAIAssist } from '../hooks/useAIAssist'
import { WizardProvider, useWizard } from '../context/WizardContext'
import { loadFormData, clearFormData, getSavedAt } from '../utils/localStorage'
import type { FormData } from '../context/WizardContext'
import type { AIFieldName } from '../services/aiService'

const stepFieldNames: Record<1 | 2 | 3, (keyof FormData)[]> = {
  1: ['name', 'nationalId', 'dob', 'gender', 'address', 'city', 'state', 'phone', 'email'],
  2: ['maritalStatus', 'dependents', 'employmentStatus', 'monthlyIncome', 'housingStatus'],
  3: ['currentFinancialSituation', 'employmentCircumstances', 'reasonForApplying'],
}

function ApplyContent() {
  const navigate = useNavigate()
  const { isRtl, t } = useLanguage()
  const {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    resetForm,
    isDirty,
    isSubmitted,
    saveProgress,
    clearProgress,
  } = useWizard()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const stepTitleRef = useRef<HTMLSpanElement>(null)
  const submittedRef = useRef(false)

  const maxDob = (() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 18)
    return d.toISOString().split('T')[0]
  })()

  // Restore banner
  const [showRestoreBanner, setShowRestoreBanner] = useState(() => loadFormData() !== null)
  const savedAtTime = getSavedAt()

  // Save Progress feedback
  const [savedFeedback, setSavedFeedback] = useState(false)
  const savedFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear saved confirmation
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [hasSavedData, setHasSavedData] = useState(() => loadFormData() !== null)

  useEffect(() => {
    stepTitleRef.current?.focus()
  }, [currentStep])

  // Browser close / tab close / reload
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitted) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty, isSubmitted])

  // React Router in-app navigation blocker
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && !isSubmitted && !submittedRef.current && currentLocation.pathname !== nextLocation.pathname
  )

  const ai = useAIAssist()

  const { register, trigger, getValues, watch, setValue, formState: { errors } } = useForm<FormData>({
    mode: 'onTouched',
    defaultValues: formData,
  })

  const maritalStatus = watch('maritalStatus')

  const handleAIAccept = () => {
    const value = ai.accept()
    if (ai.activeField) setValue(ai.activeField, value, { shouldValidate: true })
  }

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    const fields = stepFieldNames[currentStep as 1 | 2 | 3]
    const activeFields = currentStep === 2 && maritalStatus === 'Single'
      ? fields.filter((f) => f !== 'dependents')
      : fields

    const valid = await trigger(activeFields)
    if (!valid) return

    const values = getValues()
    activeFields.forEach((key) => updateFormData(key, values[key]))

    if (currentStep < 3) {
      nextStep()
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      submittedRef.current = true
      resetForm()
      navigate('/success')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) prevStep()
    else navigate('/')
  }

  const handleSaveProgress = () => {
    saveProgress(getValues())
    setHasSavedData(true)
    setSavedFeedback(true)
    if (savedFeedbackTimer.current) clearTimeout(savedFeedbackTimer.current)
    savedFeedbackTimer.current = setTimeout(() => setSavedFeedback(false), 3000)
  }

  const handleClearConfirmed = () => {
    clearProgress()
    setHasSavedData(false)
    setShowClearConfirm(false)
    setShowRestoreBanner(false)
  }

  const stepTitles = [
    isRtl ? 'المعلومات الشخصية' : 'Personal Information',
    isRtl ? 'المعلومات العائلية والمالية' : 'Family & Financial Info',
    isRtl ? 'شرح الحالة' : 'Situation Descriptions',
  ]

  const optionClasses = 'text-slate-800 dark:text-white dark:bg-slate-800'

  return (
    <>
      <Card hoverable={true} className="w-full max-w-4xl mx-auto">
        {/* Restore Banner */}
        {showRestoreBanner && (
          <div
            className={`mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-sm animate-[fadeIn_0.3s_ease-out_forwards] ${isRtl ? 'text-right' : 'text-left'}`}
            role="status"
          >
            <span className="text-teal-700 dark:text-teal-300 font-medium">
              {isRtl
                ? `لديك طلب محفوظ من ${savedAtTime ?? ''}. هل تريد الاستمرار من حيث توقفت؟`
                : `You have a saved application from ${savedAtTime ?? ''}. Continue where you left off?`}
            </span>
            <div className={`flex gap-2 shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={() => setShowRestoreBanner(false)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-teal-500 text-white hover:bg-teal-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                {isRtl ? 'استمرار' : 'Restore'}
              </button>
              <button
                type="button"
                onClick={() => {
                  clearFormData()
                  setShowRestoreBanner(false)
                  setHasSavedData(false)
                  window.location.reload()
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-200/60 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                {isRtl ? 'بدء من جديد' : 'Start Fresh'}
              </button>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-4 select-none animate-[fadeIn_0.3s_ease-out_forwards]">
          <div className={`flex items-center justify-between gap-4 mb-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {isRtl
                ? `الخطوة ${currentStep === 1 ? '١' : currentStep === 2 ? '٢' : '٣'} من ٣`
                : `Step ${currentStep} of 3`}
            </span>
            <span
              id="step-title"
              ref={stepTitleRef}
              tabIndex={-1}
              className="text-xs font-extrabold text-teal-500 dark:text-teal-400 uppercase tracking-wider outline-none"
            >
              {stepTitles[currentStep - 1]}
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={3}
            aria-label={isRtl ? `الخطوة ${currentStep} من 3` : `Step ${currentStep} of 3`}
            className="w-full h-1.5 bg-slate-200/30 dark:bg-white/5 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(20,184,166,0.4)]"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        <form
          onSubmit={handleNext}
          aria-labelledby="step-title"
          className="mt-4 flex flex-col gap-4"
          noValidate
        >
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <fieldset className="border-0 p-0 m-0 min-w-0">
              <legend className="sr-only">{stepTitles[0]}</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 animate-[fadeIn_0.3s_ease-out_forwards]">
                <FormField
                  id="name" label={t('i18n_14')} type="text" required
                  placeholder={isRtl ? 'أدخل اسمك الكامل' : 'John Doe'}
                  error={errors.name?.message}
                  {...register('name', {
                    required: t('i18n_70'),
                    minLength: { value: 2, message: t('i18n_71') },
                  })}
                />
                <FormField
                  id="nationalId" label={t('i18n_22')} type="text" required
                  placeholder={t('i18n_23')}
                  error={errors.nationalId?.message}
                  {...register('nationalId', {
                    required: t('i18n_70'),
                    pattern: { value: /^784-?\d{4}-?\d{7}-?\d$/, message: t('i18n_72') },
                  })}
                />
                <FormField
                  id="dob" label={t('i18n_24')} type="date" required
                  max={maxDob}
                  error={errors.dob?.message}
                  {...register('dob', {
                    required: t('i18n_70'),
                    validate: (v) => {
                      const dob = new Date(v)
                      const today = new Date()
                      const age = today.getFullYear() - dob.getFullYear()
                      const hasBirthdayPassed =
                        today.getMonth() > dob.getMonth() ||
                        (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())
                      return (age > 18 || (age === 18 && hasBirthdayPassed)) || t('i18n_79')
                    },
                  })}
                />
                <FormSelect
                  id="gender" label={t('i18n_25')} required
                  error={errors.gender?.message}
                  {...register('gender', { required: t('i18n_70') })}
                >
                  <option value="" className="text-slate-400 dark:bg-slate-800">{t('i18n_26')}</option>
                  <option value="Male" className={optionClasses}>{t('i18n_27')}</option>
                  <option value="Female" className={optionClasses}>{t('i18n_28')}</option>
                  <option value="Other" className={optionClasses}>{t('i18n_29')}</option>
                </FormSelect>
                <FormSelect
                  id="country" label={t('i18n_36')}
                  error={errors.country?.message}
                  {...register('country')}
                >
                  <option value="UAE" className={optionClasses}>{t('i18n_89')}</option>
                </FormSelect>
                <FormSelect
                  id="state" label={t('i18n_34')} required
                  error={errors.state?.message}
                  {...register('state', { required: t('i18n_70') })}
                >
                  <option value="" className="text-slate-400 dark:bg-slate-800">{t('i18n_81')}</option>
                  <option value="Abu Dhabi" className={optionClasses}>{t('i18n_82')}</option>
                  <option value="Dubai" className={optionClasses}>{t('i18n_83')}</option>
                  <option value="Sharjah" className={optionClasses}>{t('i18n_84')}</option>
                  <option value="Ajman" className={optionClasses}>{t('i18n_85')}</option>
                  <option value="Umm Al Quwain" className={optionClasses}>{t('i18n_86')}</option>
                  <option value="Ras Al Khaimah" className={optionClasses}>{t('i18n_87')}</option>
                  <option value="Fujairah" className={optionClasses}>{t('i18n_88')}</option>
                </FormSelect>
                <FormField
                  id="city" label={t('i18n_32')} type="text" required
                  placeholder={t('i18n_33')}
                  error={errors.city?.message}
                  {...register('city', { required: t('i18n_70') })}
                />
                <FormField
                  id="address" label={t('i18n_30')} type="text" required colSpan
                  placeholder={t('i18n_31')}
                  error={errors.address?.message}
                  {...register('address', {
                    required: t('i18n_70'),
                    minLength: { value: 5, message: t('i18n_78') },
                  })}
                />
                <FormField
                  id="phone" label={t('i18n_38')} type="tel" required
                  placeholder={t('i18n_39')}
                  error={errors.phone?.message}
                  {...register('phone', {
                    required: t('i18n_70'),
                    pattern: { value: /^\+?[\d\s\-()]{7,20}$/, message: t('i18n_75') },
                  })}
                />
                <FormField
                  id="email" label={t('i18n_15')} type="email" required
                  placeholder={t('i18n_40')}
                  error={errors.email?.message}
                  {...register('email', {
                    required: t('i18n_70'),
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('i18n_74') },
                  })}
                />
              </div>
            </fieldset>
          )}

          {/* Step 2: Family & Financial Info */}
          {currentStep === 2 && (
            <fieldset className="border-0 p-0 m-0 min-w-0">
              <legend className="sr-only">{stepTitles[1]}</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 animate-[fadeIn_0.3s_ease-out_forwards]">
                <FormSelect
                  id="maritalStatus" label={t('i18n_41')} required
                  error={errors.maritalStatus?.message}
                  {...register('maritalStatus', { required: t('i18n_70') })}
                >
                  <option value="" className="text-slate-400 dark:bg-slate-800">{t('i18n_42')}</option>
                  <option value="Single" className={optionClasses}>{t('i18n_43')}</option>
                  <option value="Married" className={optionClasses}>{t('i18n_44')}</option>
                  <option value="Divorced" className={optionClasses}>{t('i18n_45')}</option>
                  <option value="Widowed" className={optionClasses}>{t('i18n_46')}</option>
                </FormSelect>
                {maritalStatus && maritalStatus !== 'Single' && (
                  <FormField
                    id="dependents" label={t('i18n_47')} type="number" min="0" required
                    placeholder={t('i18n_48')}
                    error={errors.dependents?.message}
                    {...register('dependents', {
                      required: t('i18n_70'),
                      min: { value: 0, message: t('i18n_77') },
                    })}
                  />
                )}
                <FormSelect
                  id="employmentStatus" label={t('i18n_49')} required
                  error={errors.employmentStatus?.message}
                  {...register('employmentStatus', { required: t('i18n_70') })}
                >
                  <option value="" className="text-slate-400 dark:bg-slate-800">{t('i18n_50')}</option>
                  <option value="Employed" className={optionClasses}>{t('i18n_51')}</option>
                  <option value="Unemployed" className={optionClasses}>{t('i18n_52')}</option>
                  <option value="Self-Employed" className={optionClasses}>{t('i18n_53')}</option>
                  <option value="Retired" className={optionClasses}>{t('i18n_54')}</option>
                  <option value="Student" className={optionClasses}>{t('i18n_55')}</option>
                </FormSelect>
                <FormField
                  id="monthlyIncome" label={t('i18n_56')} type="number" min="0" required
                  placeholder={t('i18n_57')}
                  error={errors.monthlyIncome?.message}
                  {...register('monthlyIncome', {
                    required: t('i18n_70'),
                    min: { value: 0, message: t('i18n_77') },
                  })}
                />
                <FormSelect
                  id="housingStatus" label={t('i18n_58')} colSpan required
                  error={errors.housingStatus?.message}
                  {...register('housingStatus', { required: t('i18n_70') })}
                >
                  <option value="" className="text-slate-400 dark:bg-slate-800">{t('i18n_59')}</option>
                  <option value="Owned" className={optionClasses}>{t('i18n_60')}</option>
                  <option value="Rented" className={optionClasses}>{t('i18n_61')}</option>
                  <option value="Shared" className={optionClasses}>{t('i18n_62')}</option>
                  <option value="Temporary" className={optionClasses}>{t('i18n_63')}</option>
                </FormSelect>
              </div>
            </fieldset>
          )}

          {/* Step 3: Situation Descriptions */}
          {currentStep === 3 && (
            <fieldset className="border-0 p-0 m-0 min-w-0">
              <legend className="sr-only">{stepTitles[2]}</legend>
              <div className="flex flex-col gap-3 animate-[fadeIn_0.3s_ease-out_forwards]">
                {(
                  [
                    { id: 'currentFinancialSituation', labelKey: 'i18n_64', placeholderKey: 'i18n_65' },
                    { id: 'employmentCircumstances',   labelKey: 'i18n_66', placeholderKey: 'i18n_67' },
                    { id: 'reasonForApplying',         labelKey: 'i18n_68', placeholderKey: 'i18n_69' },
                  ] as { id: AIFieldName; labelKey: string; placeholderKey: string }[]
                ).map(({ id, labelKey, placeholderKey }) => (
                  <div key={id} className="flex flex-col gap-1.5">
                    <FormTextarea
                      id={id} label={t(labelKey)} required
                      rows={3} placeholder={t(placeholderKey)}
                      error={errors[id]?.message}
                      {...register(id, {
                        required: t('i18n_70'),
                        minLength: { value: 50, message: t('i18n_76') },
                      })}
                    />
                    <div className={`flex ${isRtl ? 'justify-start' : 'justify-end'}`}>
                      <button
                        type="button"
                        onClick={() => ai.open(id, getValues(id) ?? '')}
                        disabled={ai.popupState !== 'closed'}
                        className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded px-1"
                        aria-label={`${t('i18n_97')} — ${t(labelKey)}`}
                      >
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" /><path d="M12 8v4l3 3" />
                        </svg>
                        {t('i18n_97')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-6">
            <div className={`flex flex-col sm:flex-row gap-3 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
              <Button
                variant="primary" type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                aria-label={
                  isSubmitting
                    ? (isRtl ? 'جارٍ الإرسال، يرجى الانتظار' : 'Submitting, please wait')
                    : currentStep === 3
                      ? (isRtl ? 'إرسال الطلب' : 'Submit Request')
                      : (isRtl ? 'الخطوة التالية' : 'Next Step')
                }
                className="flex-1 justify-center active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('i18n_80')}
                  </span>
                ) : currentStep === 3
                  ? (isRtl ? 'إرسال الطلب' : 'Submit Request')
                  : (isRtl ? 'الخطوة التالية' : 'Next Step')}
              </Button>

              <Button
                variant="secondary" type="button"
                onClick={handleSaveProgress}
                aria-label={isRtl ? 'حفظ التقدم' : 'Save progress'}
                className="justify-center active:scale-98 border-teal-500/30 text-teal-600 dark:text-teal-400 hover:border-teal-500/60"
              >
                {isRtl ? 'حفظ' : 'Save'}
              </Button>

              <Button
                variant="secondary" type="button"
                onClick={handleBack}
                aria-label={currentStep > 1
                  ? (isRtl ? 'العودة للخطوة السابقة' : 'Go back to previous step')
                  : (isRtl ? 'العودة للرئيسية' : 'Go back to home')}
                className="justify-center active:scale-98"
              >
                {isRtl ? 'رجوع' : 'Go Back'}
              </Button>
            </div>

            {/* Save feedback — sits below the button row */}
            {savedFeedback && (
              <p
                role="status"
                aria-live="polite"
                className="text-xs text-center text-teal-500 dark:text-teal-400 font-medium animate-[fadeIn_0.2s_ease-out_forwards]"
              >
                {isRtl ? `آخر حفظ ${getSavedAt() ?? ''}` : `Last saved at ${getSavedAt() ?? ''}`}
              </p>
            )}
          </div>
        </form>

        {/* Clear Saved Data */}
        {hasSavedData && !showClearConfirm && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="text-xs text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 rounded"
            >
              {isRtl ? 'مسح البيانات المحفوظة' : 'Clear saved data'}
            </button>
          </div>
        )}

        {hasSavedData && showClearConfirm && (
          <div
            role="status"
            className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm animate-[fadeIn_0.2s_ease-out_forwards]"
          >
            <span className="text-slate-500 dark:text-slate-400">
              {isRtl ? 'هل أنت متأكد من مسح البيانات المحفوظة؟' : 'Clear all saved data? This cannot be undone.'}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClearConfirmed}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
              >
                {isRtl ? 'نعم، مسح' : 'Yes, clear'}
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-200/60 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* AI Assist Popup */}
      <AIAssistPopup
        state={ai.popupState}
        suggestion={ai.suggestion}
        editedSuggestion={ai.editedSuggestion}
        error={ai.error}
        lastInput=""
        onAccept={handleAIAccept}
        onEdit={ai.startEdit}
        onDiscard={ai.discard}
        onEditChange={ai.handleEditChange}
        onRetry={() => ai.retry(ai.activeField ? getValues(ai.activeField) ?? '' : '')}
      />

      {/* Unsaved Changes Modal */}
      {blocker.state === 'blocked' && (
        <UnsavedChangesModal
          onStay={() => blocker.reset()}
          onLeaveWithoutSaving={() => {
            clearFormData()
            blocker.proceed()
          }}
          onSaveAndLeave={() => {
            saveProgress(getValues())
            blocker.proceed()
          }}
        />
      )}
    </>
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
