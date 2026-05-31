import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UnsavedChangesModal from '../../components/UnsavedChangesModal'

let mockIsRtl = false
jest.mock('../../hooks/useLanguage', () => ({
  useLanguage: () => ({ isRtl: mockIsRtl, t: (k: string) => k }),
}))

beforeEach(() => {
  mockIsRtl = false
})

function renderModal(overrides = {}) {
  const props = {
    onStay: jest.fn(),
    onLeaveWithoutSaving: jest.fn(),
    onSaveAndLeave: jest.fn(),
    ...overrides,
  }
  render(<UnsavedChangesModal {...props} />)
  return props
}

describe('UnsavedChangesModal', () => {
  it('renders with role=dialog and aria-modal', () => {
    renderModal()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('shows the title and description', () => {
    renderModal()
    expect(screen.getByText('You have unsaved changes')).toBeInTheDocument()
    expect(screen.getByText('Would you like to save your progress before leaving?')).toBeInTheDocument()
  })

  it('calls onStay when Stay on page is clicked', async () => {
    const { onStay } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Stay on page' }))
    expect(onStay).toHaveBeenCalledTimes(1)
  })

  it('calls onSaveAndLeave when Save and leave is clicked', async () => {
    const { onSaveAndLeave } = renderModal()
    await userEvent.click(screen.getByRole('button', { name: 'Save and leave' }))
    expect(onSaveAndLeave).toHaveBeenCalledTimes(1)
  })

  it('calls onLeaveWithoutSaving when Leave without saving is clicked', async () => {
    const { onLeaveWithoutSaving } = renderModal()
    await userEvent.click(screen.getByText('Leave without saving'))
    expect(onLeaveWithoutSaving).toHaveBeenCalledTimes(1)
  })

  it('calls onStay when Escape is pressed', () => {
    const { onStay } = renderModal()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onStay).toHaveBeenCalledTimes(1)
  })

  it('renders correct Arabic texts in RTL mode', () => {
    mockIsRtl = true
    renderModal()
    expect(screen.getByText('لديك تغييرات غير محفوظة')).toBeInTheDocument()
    expect(screen.getByText('هل تريد حفظ تقدمك قبل المغادرة؟')).toBeInTheDocument()
  })

  it('bypasses focus trap setup if modal is not found in DOM', () => {
    const spy = jest.spyOn(document, 'getElementById').mockReturnValue(null)
    renderModal()
    expect(document.activeElement).not.toBeNull()
    spy.mockRestore()
  })

  it('traps focus with Tab and Shift+Tab', () => {
    renderModal()
    
    // UnsavedChangesModal has 3 focusable elements:
    // 1. Stay on page button (StayButtonRef gets focused on mount)
    // 2. Save and leave button
    // 3. Leave without saving button
    const stayBtn = screen.getByRole('button', { name: 'Stay on page' })
    const saveLeaveBtn = screen.getByRole('button', { name: 'Save and leave' })
    const leaveBtn = screen.getByRole('button', { name: 'Leave without saving' })

    // Check that initial focus is on stayBtn
    expect(document.activeElement).toBe(stayBtn)

    // Shift+Tab from middle element (Save and leave button) should not wrap or preventDefault
    saveLeaveBtn.focus()
    const shiftTabMiddleEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
    jest.spyOn(shiftTabMiddleEvent, 'preventDefault')
    saveLeaveBtn.dispatchEvent(shiftTabMiddleEvent)
    expect(shiftTabMiddleEvent.preventDefault).not.toHaveBeenCalled()

    // Tab from middle element should not wrap or preventDefault
    const tabMiddleEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false, bubbles: true })
    jest.spyOn(tabMiddleEvent, 'preventDefault')
    saveLeaveBtn.dispatchEvent(tabMiddleEvent)
    expect(tabMiddleEvent.preventDefault).not.toHaveBeenCalled()

    // Shift+Tab from first element (Stay on page button) should wrap to last element (Leave without saving)
    stayBtn.focus()
    const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
    jest.spyOn(shiftTabEvent, 'preventDefault')
    stayBtn.dispatchEvent(shiftTabEvent)
    expect(shiftTabEvent.preventDefault).toHaveBeenCalled()
    expect(document.activeElement).toBe(leaveBtn)

    // Tab from last element (Leave without saving) should wrap to first element (Stay on page button)
    leaveBtn.focus()
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false, bubbles: true })
    jest.spyOn(tabEvent, 'preventDefault')
    leaveBtn.dispatchEvent(tabEvent)
    expect(tabEvent.preventDefault).toHaveBeenCalled()
    expect(document.activeElement).toBe(stayBtn)

    // Other keys keydown does not call preventDefault
    const otherEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    jest.spyOn(otherEvent, 'preventDefault')
    stayBtn.dispatchEvent(otherEvent)
    expect(otherEvent.preventDefault).not.toHaveBeenCalled()
  })
})
