/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'
import { saveFormData, loadFormData, clearFormData } from '../utils/localStorage'

export interface FormData {
  // Step 1: Personal Information
  name: string
  nationalId: string
  dob: string
  gender: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  email: string

  // Step 2: Family & Financial Info
  maritalStatus: string
  dependents: string
  employmentStatus: string
  monthlyIncome: string
  housingStatus: string

  // Step 3: Situation Descriptions
  currentFinancialSituation: string
  employmentCircumstances: string
  reasonForApplying: string
}

export const defaultFormData: FormData = {
  name: '',
  nationalId: '',
  dob: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  country: 'UAE',
  phone: '',
  email: '',
  maritalStatus: '',
  dependents: '',
  employmentStatus: '',
  monthlyIncome: '',
  housingStatus: '',
  currentFinancialSituation: '',
  employmentCircumstances: '',
  reasonForApplying: '',
}

interface SavedPayload {
  currentStep?: number
}

function hydrateFromStorage(): { formData: FormData; currentStep: number } {
  const saved = loadFormData()
  if (!saved?.data) return { formData: defaultFormData, currentStep: 1 }
  const data = saved.data as Partial<FormData> & SavedPayload
  const { currentStep: savedStep, ...fields } = data
  return {
    formData: { ...defaultFormData, ...fields },
    currentStep: savedStep ?? 1,
  }
}

interface WizardContextType {
  currentStep: number
  formData: FormData
  isDirty: boolean
  isSubmitted: boolean
  setStep: (step: number) => void
  updateFormData: (stepKey: keyof FormData, value: string) => void
  nextStep: () => void
  prevStep: () => void
  resetForm: () => void
  saveProgress: (liveValues?: FormData) => void
  clearProgress: () => void
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const hydrated = hydrateFromStorage()

  const [currentStep, setCurrentStep] = useState(hydrated.currentStep)
  const [formData, setFormData] = useState<FormData>(hydrated.formData)
  const [isDirty, setIsDirty] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const setStep = (step: number) => {
    if (step >= 1 && step <= 3) setCurrentStep(step)
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3))

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const updateFormData = (stepKey: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [stepKey]: value }))
    setIsDirty(true)
  }

  const saveProgress = (liveValues?: FormData) => {
    const dataToSave = liveValues ?? formData
    // Sync context state with the live RHF values so both stay in agreement after saving
    if (liveValues) setFormData(liveValues)
    saveFormData({ ...dataToSave, currentStep })
    setIsDirty(false)
  }

  const clearProgress = () => {
    clearFormData()
    // The in-memory form data is still present in RHF — keep dirty so the nav guard fires
    setIsDirty(true)
  }

  const resetForm = () => {
    clearFormData()
    setCurrentStep(1)
    setFormData(defaultFormData)
    setIsDirty(false)
    setIsSubmitted(true)
  }

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        formData,
        isDirty,
        isSubmitted,
        setStep,
        updateFormData,
        nextStep,
        prevStep,
        resetForm,
        saveProgress,
        clearProgress,
      }}
    >
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const context = useContext(WizardContext)
  if (!context) throw new Error('useWizard must be used within a WizardProvider')
  return context
}
