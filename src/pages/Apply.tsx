import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Card from '../components/Card'
import Button from '../components/Button'
import FormField from '../components/FormField'
import FormSelect from '../components/FormSelect'
import FormTextarea from '../components/FormTextarea'
import { useLanguage } from '../hooks/useLanguage'
import { WizardProvider, useWizard } from '../context/WizardContext'
import type { FormData } from '../context/WizardContext'

const stepFieldNames: Record<1 | 2 | 3, (keyof FormData)[]> = {
  1: ['name', 'nationalId', 'dob', 'gender', 'address', 'city', 'state', 'country', 'phone', 'email'],
  2: ['maritalStatus', 'dependents', 'employmentStatus', 'monthlyIncome', 'housingStatus'],
  3: ['currentFinancialSituation', 'employmentCircumstances', 'reasonForApplying'],
}

function ApplyContent() {
  const navigate = useNavigate()
  const { isRtl, t } = useLanguage()
  const { currentStep, formData, updateFormData, nextStep, prevStep, resetForm } = useWizard()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, trigger, getValues, watch, formState: { errors } } = useForm<FormData>({
    mode: 'onTouched',
    defaultValues: formData,
  })

  const maritalStatus = watch('maritalStatus')

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

  const stepTitles = [
    isRtl ? 'المعلومات الشخصية' : 'Personal Information',
    isRtl ? 'المعلومات العائلية والمالية' : 'Family & Financial Info',
    isRtl ? 'شرح الحالة' : 'Situation Descriptions',
  ]

  const optionClasses = 'text-slate-800 dark:text-white dark:bg-slate-800'

  return (
    <Card hoverable={true} className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-6 select-none animate-[fadeIn_0.3s_ease-out_forwards]">
        <div className={`flex items-center justify-between gap-4 mb-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {isRtl
              ? `الخطوة ${currentStep === 1 ? '١' : currentStep === 2 ? '٢' : '٣'} من ٣`
              : `Step ${currentStep} of 3`}
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

      <form onSubmit={handleNext} className="mt-6 flex flex-col gap-6" noValidate>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 animate-[fadeIn_0.3s_ease-out_forwards]">
            <FormField
              id="name" label={t('i18n_14')} type="text"
              placeholder={isRtl ? 'أدخل اسمك الكامل' : 'John Doe'}
              error={errors.name?.message}
              {...register('name', {
                required: t('i18n_70'),
                minLength: { value: 2, message: t('i18n_71') },
              })}
            />
            <FormField
              id="nationalId" label={t('i18n_22')} type="text"
              placeholder={t('i18n_23')}
              error={errors.nationalId?.message}
              {...register('nationalId', {
                required: t('i18n_70'),
                pattern: { value: /^784-?\d{4}-?\d{7}-?\d$/, message: t('i18n_72') },
              })}
            />
            <FormField
              id="dob" label={t('i18n_24')} type="date"
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
              id="gender" label={t('i18n_25')}
              error={errors.gender?.message}
              {...register('gender', { required: t('i18n_70') })}
            >
              <option value="" className="text-slate-400 dark:bg-slate-800">{t('i18n_26')}</option>
              <option value="Male" className={optionClasses}>{t('i18n_27')}</option>
              <option value="Female" className={optionClasses}>{t('i18n_28')}</option>
              <option value="Other" className={optionClasses}>{t('i18n_29')}</option>
            </FormSelect>
            <FormField
              id="address" label={t('i18n_30')} type="text"
              placeholder={t('i18n_31')} colSpan
              error={errors.address?.message}
              {...register('address', {
                required: t('i18n_70'),
                minLength: { value: 5, message: t('i18n_78') },
              })}
            />
            <FormField
              id="city" label={t('i18n_32')} type="text"
              placeholder={t('i18n_33')}
              error={errors.city?.message}
              {...register('city', { required: t('i18n_70') })}
            />
            <FormField
              id="state" label={t('i18n_34')} type="text"
              placeholder={t('i18n_35')}
              error={errors.state?.message}
              {...register('state', { required: t('i18n_70') })}
            />
            <FormField
              id="country" label={t('i18n_36')} type="text"
              placeholder={t('i18n_37')}
              error={errors.country?.message}
              {...register('country', { required: t('i18n_70') })}
            />
            <FormField
              id="phone" label={t('i18n_38')} type="tel"
              placeholder={t('i18n_39')}
              error={errors.phone?.message}
              {...register('phone', {
                required: t('i18n_70'),
                pattern: { value: /^\+?[\d\s\-()]{7,20}$/, message: t('i18n_75') },
              })}
            />
            <FormField
              id="email" label={t('i18n_15')} type="email"
              placeholder={t('i18n_40')} colSpan
              error={errors.email?.message}
              {...register('email', {
                required: t('i18n_70'),
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('i18n_74') },
              })}
            />
          </div>
        )}

        {/* Step 2: Family & Financial Info */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 animate-[fadeIn_0.3s_ease-out_forwards]">
            <FormSelect
              id="maritalStatus" label={t('i18n_41')}
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
                id="dependents" label={t('i18n_47')} type="number" min="0"
                placeholder={t('i18n_48')}
                error={errors.dependents?.message}
                {...register('dependents', {
                  required: t('i18n_70'),
                  min: { value: 0, message: t('i18n_77') },
                })}
              />
            )}
            <FormSelect
              id="employmentStatus" label={t('i18n_49')}
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
              id="monthlyIncome" label={t('i18n_56')} type="number" min="0"
              placeholder={t('i18n_57')}
              error={errors.monthlyIncome?.message}
              {...register('monthlyIncome', {
                required: t('i18n_70'),
                min: { value: 0, message: t('i18n_77') },
              })}
            />
            <FormSelect
              id="housingStatus" label={t('i18n_58')} colSpan
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
        )}

        {/* Step 3: Situation Descriptions */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-5 animate-[fadeIn_0.3s_ease-out_forwards]">
            <FormTextarea
              id="currentFinancialSituation" label={t('i18n_64')}
              rows={3} placeholder={t('i18n_65')}
              error={errors.currentFinancialSituation?.message}
              {...register('currentFinancialSituation', {
                required: t('i18n_70'),
                minLength: { value: 50, message: t('i18n_76') },
              })}
            />
            <FormTextarea
              id="employmentCircumstances" label={t('i18n_66')}
              rows={3} placeholder={t('i18n_67')}
              error={errors.employmentCircumstances?.message}
              {...register('employmentCircumstances', {
                required: t('i18n_70'),
                minLength: { value: 50, message: t('i18n_76') },
              })}
            />
            <FormTextarea
              id="reasonForApplying" label={t('i18n_68')}
              rows={3} placeholder={t('i18n_69')}
              error={errors.reasonForApplying?.message}
              {...register('reasonForApplying', {
                required: t('i18n_70'),
                minLength: { value: 50, message: t('i18n_76') },
              })}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 mt-6 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
          <Button
            variant="primary" type="submit"
            disabled={isSubmitting}
            aria-label={currentStep === 3 ? 'Submit Request' : 'Next Step'}
            className="flex-1 justify-center active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t('i18n_80')}
              </span>
            ) : currentStep === 3
              ? (isRtl ? 'إرسال الطلب' : 'Submit Request')
              : (isRtl ? 'الخطوة التالية' : 'Next Step')}
          </Button>
          <Button
            variant="secondary" type="button"
            onClick={handleBack} aria-label="Go Back"
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
