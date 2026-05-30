/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'

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
    name: '',
    nationalId: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
    maritalStatus: '',
    dependents: '',
    employmentStatus: '',
    monthlyIncome: '',
    housingStatus: '',
    currentFinancialSituation: '',
    employmentCircumstances: '',
    reasonForApplying: ''
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
      name: '',
      nationalId: '',
      dob: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      country: '',
      phone: '',
      email: '',
      maritalStatus: '',
      dependents: '',
      employmentStatus: '',
      monthlyIncome: '',
      housingStatus: '',
      currentFinancialSituation: '',
      employmentCircumstances: '',
      reasonForApplying: ''
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
