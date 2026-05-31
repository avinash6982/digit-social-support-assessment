import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AIAssistPopup from '../../components/AIAssistPopup'
import type { AIPopupState } from '../../hooks/useAIAssist'

let mockIsRtl = false
jest.mock('../../hooks/useLanguage', () => ({
  useLanguage: () => ({ isRtl: mockIsRtl, t: (k: string) => k }),
}))

beforeEach(() => {
  mockIsRtl = false
})

const defaultProps = {
  suggestion: '',
  editedSuggestion: '',
  error: null,
  onAccept: jest.fn(),
  onEdit: jest.fn(),
  onDiscard: jest.fn(),
  onEditChange: jest.fn(),
  onRetry: jest.fn(),
}

function renderPopup(state: AIPopupState, overrides = {}) {
  return render(<AIAssistPopup state={state} {...defaultProps} {...overrides} />)
}

describe('AIAssistPopup — closed', () => {
  it('renders nothing', () => {
    const { container } = renderPopup('closed')
    expect(container).toBeEmptyDOMElement()
  })
})

describe('AIAssistPopup — loading', () => {
  it('shows a loading spinner', () => {
    renderPopup('loading')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // Spinner div is aria-hidden, check by text
    expect(screen.getByText('i18n_91')).toBeInTheDocument()
  })
})

describe('AIAssistPopup — suggestion (success)', () => {
  it('shows the suggestion text', () => {
    renderPopup('suggestion', { suggestion: 'Here is your suggestion.' })
    expect(screen.getByText('Here is your suggestion.')).toBeInTheDocument()
  })

  it('calls onAccept when Accept button is clicked', async () => {
    const onAccept = jest.fn()
    renderPopup('suggestion', { suggestion: 'Text', onAccept })
    await userEvent.click(screen.getByRole('button', { name: 'i18n_94' }))
    expect(onAccept).toHaveBeenCalledTimes(1)
  })

  it('calls onEdit when Edit button is clicked', async () => {
    const onEdit = jest.fn()
    renderPopup('suggestion', { suggestion: 'Text', onEdit })
    await userEvent.click(screen.getByRole('button', { name: 'i18n_95' }))
    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it('calls onDiscard when Discard button is clicked', async () => {
    const onDiscard = jest.fn()
    renderPopup('suggestion', { suggestion: 'Text', onDiscard })
    await userEvent.click(screen.getByRole('button', { name: 'i18n_96' }))
    expect(onDiscard).toHaveBeenCalledTimes(1)
  })
})

describe('AIAssistPopup — suggestion (error)', () => {
  it('shows the error message', () => {
    renderPopup('suggestion', { error: 'Rate limit exceeded' })
    expect(screen.getByText('Rate limit exceeded')).toBeInTheDocument()
  })

  it('shows Try Again and Discard buttons', () => {
    renderPopup('suggestion', { error: 'Something went wrong' })
    expect(screen.getByRole('button', { name: 'i18n_98' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'i18n_96' })).toBeInTheDocument()
  })

  it('calls onRetry when Try Again is clicked', async () => {
    const onRetry = jest.fn()
    renderPopup('suggestion', { error: 'Error', onRetry })
    await userEvent.click(screen.getByRole('button', { name: 'i18n_98' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})

describe('AIAssistPopup — editing', () => {
  it('renders a textarea with the edited suggestion', () => {
    renderPopup('editing', { editedSuggestion: 'Edited text' })
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('Edited text')
  })

  it('calls onEditChange when textarea changes', async () => {
    const onEditChange = jest.fn()
    renderPopup('editing', { editedSuggestion: '', onEditChange })
    await userEvent.type(screen.getByRole('textbox'), 'a')
    expect(onEditChange).toHaveBeenCalled()
  })

  it('calls onAccept when Accept button is clicked', async () => {
    const onAccept = jest.fn()
    renderPopup('editing', { editedSuggestion: 'text', onAccept })
    await userEvent.click(screen.getByRole('button', { name: 'i18n_94' }))
    expect(onAccept).toHaveBeenCalledTimes(1)
  })
})

describe('AIAssistPopup — keyboard and styling', () => {
  it('calls onDiscard when Escape is pressed', () => {
    const onDiscard = jest.fn()
    renderPopup('suggestion', { suggestion: 'text', onDiscard })
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onDiscard).toHaveBeenCalledTimes(1)
  })

  it('has role=dialog with aria-modal', () => {
    renderPopup('suggestion', { suggestion: 'text' })
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('handles isRtl correctly for layouts', () => {
    mockIsRtl = true
    const { rerender } = renderPopup('suggestion', { suggestion: 'text' })
    expect(screen.getByText('i18n_94').parentElement?.className).toContain('flex-row-reverse')

    rerender(<AIAssistPopup state="editing" {...defaultProps} editedSuggestion="edited" />)
    expect(screen.getByText('i18n_94').parentElement?.className).toContain('flex-row-reverse')
  })

  it('bypasses focus trap setup if modal is not found in DOM', () => {
    const spy = jest.spyOn(document, 'getElementById').mockReturnValue(null)
    renderPopup('suggestion', { suggestion: 'text' })
    // No error thrown, and event listener is bypassed safely
    expect(document.activeElement).not.toBeNull()
    spy.mockRestore()
  })

  it('traps focus with Tab and Shift+Tab', () => {
    renderPopup('suggestion', { suggestion: 'text' })
    const acceptBtn = screen.getByRole('button', { name: 'i18n_94' })
    const editBtn = screen.getByRole('button', { name: 'i18n_95' })
    const discardBtn = screen.getByRole('button', { name: 'i18n_96' })

    // In 'suggestion' state, Accept button has the ref and gets focused automatically on mount.
    expect(document.activeElement).toBe(acceptBtn)

    // Shift+Tab from middle element (Edit button) should NOT wrap or preventDefault
    editBtn.focus()
    const shiftTabMiddleEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
    jest.spyOn(shiftTabMiddleEvent, 'preventDefault')
    editBtn.dispatchEvent(shiftTabMiddleEvent)
    expect(shiftTabMiddleEvent.preventDefault).not.toHaveBeenCalled()

    // Tab from middle element (Edit button) should NOT wrap or preventDefault
    const tabMiddleEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false, bubbles: true })
    jest.spyOn(tabMiddleEvent, 'preventDefault')
    editBtn.dispatchEvent(tabMiddleEvent)
    expect(tabMiddleEvent.preventDefault).not.toHaveBeenCalled()

    // Shift+Tab from first element (Accept button) should wrap to last element (Discard button)
    acceptBtn.focus()
    const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
    jest.spyOn(shiftTabEvent, 'preventDefault')
    acceptBtn.dispatchEvent(shiftTabEvent)
    expect(shiftTabEvent.preventDefault).toHaveBeenCalled()
    expect(document.activeElement).toBe(discardBtn)

    // Tab from last element (Discard button) should wrap to first element (Accept button)
    discardBtn.focus()
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false, bubbles: true })
    jest.spyOn(tabEvent, 'preventDefault')
    discardBtn.dispatchEvent(tabEvent)
    expect(tabEvent.preventDefault).toHaveBeenCalled()
    expect(document.activeElement).toBe(acceptBtn)

    // Pressing another key (e.g. Enter) does not call preventDefault
    const otherEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    jest.spyOn(otherEvent, 'preventDefault')
    acceptBtn.dispatchEvent(otherEvent)
    expect(otherEvent.preventDefault).not.toHaveBeenCalled()
  })
})
