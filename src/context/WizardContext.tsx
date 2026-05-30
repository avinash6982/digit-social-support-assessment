/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'

export interface FormData {
  personalInfo: string
  familyFinancialInfo: string
  situationDescription: string
}

interface WizardContextType {
  currentStep: number
  formData: FormData
  setStep: (step: number) => void
  updateFormData: (stepKey: keyof FormData, value: string) => void
  nextStep: () => void
  prevStep: () => void
  resetForm: () => void
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    personalInfo: '',
    familyFinancialInfo: '',
    situationDescription: ''
  })

  const setStep = (step: number) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step)
    }
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const updateFormData = (stepKey: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: value
    }))
  }

  const resetForm = () => {
    setCurrentStep(1)
    setFormData({
      personalInfo: '',
      familyFinancialInfo: '',
      situationDescription: ''
    })
  }

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        formData,
        setStep,
        updateFormData,
        nextStep,
        prevStep,
        resetForm
      }}
    >
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider')
  }
  return context
}
