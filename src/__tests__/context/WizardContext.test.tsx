import { render, screen, act } from '@testing-library/react'
import { WizardProvider, useWizard, defaultFormData } from '../../context/WizardContext'
import { saveFormData, loadFormData, clearFormData } from '../../utils/localStorage'

jest.mock('../../utils/localStorage', () => ({
  saveFormData: jest.fn(),
  loadFormData: jest.fn().mockReturnValue(null),
  clearFormData: jest.fn(),
  getSavedAt: jest.fn().mockReturnValue(null),
}))

const mockSave = saveFormData as jest.MockedFunction<typeof saveFormData>
const mockLoad = loadFormData as jest.MockedFunction<typeof loadFormData>
const mockClear = clearFormData as jest.MockedFunction<typeof clearFormData>

function Consumer() {
  const {
    currentStep,
    formData,
    isDirty,
    isSubmitted,
    setStep,
    nextStep,
    prevStep,
    updateFormData,
    saveProgress,
    clearProgress,
    resetForm,
  } = useWizard()

  return (
    <div>
      <span data-testid="step">{currentStep}</span>
      <span data-testid="name">{formData.name}</span>
      <span data-testid="dirty">{String(isDirty)}</span>
      <span data-testid="submitted">{String(isSubmitted)}</span>
      <button onClick={nextStep}>next</button>
      <button onClick={prevStep}>prev</button>
      <button onClick={() => setStep(2)}>setStep2</button>
      <button onClick={() => setStep(0)}>setStep0</button>
      <button onClick={() => setStep(4)}>setStep4</button>
      <button onClick={() => updateFormData('name', 'Ahmed')}>setName</button>
      <button onClick={() => saveProgress()}>save</button>
      <button onClick={() => saveProgress({ ...formData, name: 'Live User' })}>saveLive</button>
      <button onClick={clearProgress}>clear</button>
      <button onClick={resetForm}>reset</button>
    </div>
  )
}

function renderConsumer() {
  return render(
    <WizardProvider>
      <Consumer />
    </WizardProvider>
  )
}

beforeEach(() => {
  mockLoad.mockReturnValue(null)
})

describe('WizardProvider — initial state', () => {
  it('starts on step 1', () => {
    renderConsumer()
    expect(screen.getByTestId('step')).toHaveTextContent('1')
  })

  it('isDirty starts false, isSubmitted starts false', () => {
    renderConsumer()
    expect(screen.getByTestId('dirty')).toHaveTextContent('false')
    expect(screen.getByTestId('submitted')).toHaveTextContent('false')
  })

  it('hydrates from saved storage', () => {
    mockLoad.mockReturnValue({
      data: { ...defaultFormData, name: 'Saved User', currentStep: 2 },
      savedAt: new Date().toISOString(),
    })
    renderConsumer()
    expect(screen.getByTestId('step')).toHaveTextContent('2')
    expect(screen.getByTestId('name')).toHaveTextContent('Saved User')
  })
})

describe('navigation', () => {
  it('nextStep increments step', () => {
    renderConsumer()
    act(() => screen.getByText('next').click())
    expect(screen.getByTestId('step')).toHaveTextContent('2')
  })

  it('nextStep does not go above 3', () => {
    renderConsumer()
    act(() => screen.getByText('next').click())
    act(() => screen.getByText('next').click())
    act(() => screen.getByText('next').click())
    expect(screen.getByTestId('step')).toHaveTextContent('3')
  })

  it('prevStep decrements step', () => {
    renderConsumer()
    act(() => screen.getByText('next').click())
    act(() => screen.getByText('prev').click())
    expect(screen.getByTestId('step')).toHaveTextContent('1')
  })

  it('prevStep does not go below 1', () => {
    renderConsumer()
    act(() => screen.getByText('prev').click())
    expect(screen.getByTestId('step')).toHaveTextContent('1')
  })
})

describe('updateFormData', () => {
  it('updates the field value and sets isDirty', () => {
    renderConsumer()
    act(() => screen.getByText('setName').click())
    expect(screen.getByTestId('name')).toHaveTextContent('Ahmed')
    expect(screen.getByTestId('dirty')).toHaveTextContent('true')
  })
})

describe('saveProgress', () => {
  it('calls saveFormData and clears isDirty', () => {
    renderConsumer()
    act(() => screen.getByText('setName').click())
    act(() => screen.getByText('save').click())
    expect(mockSave).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('dirty')).toHaveTextContent('false')
  })
})

describe('clearProgress', () => {
  it('calls clearFormData', () => {
    renderConsumer()
    act(() => screen.getByText('clear').click())
    expect(mockClear).toHaveBeenCalledTimes(1)
  })
})

describe('resetForm', () => {
  it('resets step and formData, sets isSubmitted', () => {
    renderConsumer()
    act(() => screen.getByText('next').click())
    act(() => screen.getByText('setName').click())
    act(() => screen.getByText('reset').click())
    expect(screen.getByTestId('step')).toHaveTextContent('1')
    expect(screen.getByTestId('name')).toHaveTextContent('')
    expect(screen.getByTestId('submitted')).toHaveTextContent('true')
    expect(mockClear).toHaveBeenCalled()
  })
})

describe('useWizard outside WizardProvider', () => {
  it('throws a descriptive error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Consumer />)).toThrow('useWizard must be used within a WizardProvider')
    spy.mockRestore()
  })
})

describe('setStep', () => {
  it('updates currentStep when value is between 1 and 3', () => {
    renderConsumer()
    act(() => screen.getByText('setStep2').click())
    expect(screen.getByTestId('step')).toHaveTextContent('2')
  })

  it('ignores setting currentStep if out of bounds (< 1)', () => {
    renderConsumer()
    act(() => screen.getByText('setStep2').click())
    act(() => screen.getByText('setStep0').click())
    expect(screen.getByTestId('step')).toHaveTextContent('2')
  })

  it('ignores setting currentStep if out of bounds (> 3)', () => {
    renderConsumer()
    act(() => screen.getByText('setStep2').click())
    act(() => screen.getByText('setStep4').click())
    expect(screen.getByTestId('step')).toHaveTextContent('2')
  })
})

describe('saveProgress with liveValues', () => {
  it('updates formData to the live values and clears isDirty', () => {
    renderConsumer()
    act(() => screen.getByText('setName').click())
    expect(screen.getByTestId('name')).toHaveTextContent('Ahmed')
    act(() => screen.getByText('saveLive').click())
    expect(screen.getByTestId('name')).toHaveTextContent('Live User')
    expect(screen.getByTestId('dirty')).toHaveTextContent('false')
    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Live User', currentStep: 1 })
    )
  })
})

describe('hydration default fallback', () => {
  it('defaults currentStep to 1 if not present in saved storage data', () => {
    mockLoad.mockReturnValue({
      data: { ...defaultFormData, name: 'Saved User' }, // currentStep is omitted
      savedAt: new Date().toISOString(),
    })
    renderConsumer()
    expect(screen.getByTestId('step')).toHaveTextContent('1')
    expect(screen.getByTestId('name')).toHaveTextContent('Saved User')
  })
})
