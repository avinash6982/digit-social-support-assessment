import { renderHook, act } from '@testing-library/react'
import { useAIAssist } from '../../hooks/useAIAssist'
import { getAISuggestion } from '../../services/aiService'

jest.mock('../../services/aiService')
const mockGetAISuggestion = getAISuggestion as jest.MockedFunction<typeof getAISuggestion>

describe('useAIAssist', () => {
  it('starts in closed state with empty values', () => {
    const { result } = renderHook(() => useAIAssist())
    expect(result.current.popupState).toBe('closed')
    expect(result.current.suggestion).toBe('')
    expect(result.current.error).toBeNull()
    expect(result.current.activeField).toBeNull()
  })

  it('transitions to suggestion state after a successful open()', async () => {
    mockGetAISuggestion.mockResolvedValue('Generated suggestion text')
    const { result } = renderHook(() => useAIAssist())

    await act(async () => {
      await result.current.open('currentFinancialSituation', 'some input')
    })

    expect(result.current.popupState).toBe('suggestion')
    expect(result.current.suggestion).toBe('Generated suggestion text')
    expect(result.current.editedSuggestion).toBe('Generated suggestion text')
    expect(result.current.activeField).toBe('currentFinancialSituation')
    expect(result.current.error).toBeNull()
  })

  it('shows error in suggestion state when API call fails', async () => {
    mockGetAISuggestion.mockRejectedValue(new Error('API rate limit'))
    const { result } = renderHook(() => useAIAssist())

    await act(async () => {
      await result.current.open('reasonForApplying', '')
    })

    expect(result.current.popupState).toBe('suggestion')
    expect(result.current.error).toBe('API rate limit')
  })

  it('transitions to editing state on startEdit()', async () => {
    mockGetAISuggestion.mockResolvedValue('Draft text')
    const { result } = renderHook(() => useAIAssist())

    await act(async () => {
      await result.current.open('employmentCircumstances', '')
    })

    act(() => {
      result.current.startEdit()
    })

    expect(result.current.popupState).toBe('editing')
  })

  it('handleEditChange updates editedSuggestion', async () => {
    mockGetAISuggestion.mockResolvedValue('Original')
    const { result } = renderHook(() => useAIAssist())

    await act(async () => {
      await result.current.open('currentFinancialSituation', '')
    })

    act(() => {
      result.current.startEdit()
      result.current.handleEditChange('User edited text')
    })

    expect(result.current.editedSuggestion).toBe('User edited text')
  })

  it('accept() in suggestion state returns the suggestion and closes', async () => {
    mockGetAISuggestion.mockResolvedValue('Accepted text')
    const { result } = renderHook(() => useAIAssist())

    await act(async () => {
      await result.current.open('currentFinancialSituation', '')
    })

    let accepted = ''
    act(() => {
      accepted = result.current.accept()
    })

    expect(accepted).toBe('Accepted text')
    expect(result.current.popupState).toBe('closed')
  })

  it('accept() in editing state returns the edited suggestion', async () => {
    mockGetAISuggestion.mockResolvedValue('Original')
    const { result } = renderHook(() => useAIAssist())

    await act(async () => {
      await result.current.open('currentFinancialSituation', '')
    })

    act(() => {
      result.current.startEdit()
      result.current.handleEditChange('Edited version')
    })

    let accepted = ''
    act(() => {
      accepted = result.current.accept()
    })

    expect(accepted).toBe('Edited version')
    expect(result.current.popupState).toBe('closed')
  })

  it('discard() closes the popup and clears state', async () => {
    mockGetAISuggestion.mockResolvedValue('Some suggestion')
    const { result } = renderHook(() => useAIAssist())

    await act(async () => {
      await result.current.open('reasonForApplying', '')
    })

    act(() => {
      result.current.discard()
    })

    expect(result.current.popupState).toBe('closed')
    expect(result.current.suggestion).toBe('')
    expect(result.current.error).toBeNull()
    expect(result.current.activeField).toBeNull()
  })

  it('retry() re-triggers the AI call with the same field', async () => {
    mockGetAISuggestion.mockResolvedValue('Retry suggestion')
    const { result } = renderHook(() => useAIAssist())

    await act(async () => {
      await result.current.open('employmentCircumstances', 'original input')
    })

    mockGetAISuggestion.mockResolvedValue('Retried suggestion')

    await act(async () => {
      await result.current.retry('original input')
    })

    expect(result.current.popupState).toBe('suggestion')
    expect(result.current.suggestion).toBe('Retried suggestion')
    expect(mockGetAISuggestion).toHaveBeenCalledTimes(2)
  })

  it('does not update state when signal is aborted mid-request', async () => {
    const abortError = new DOMException('Aborted', 'AbortError')
    mockGetAISuggestion.mockRejectedValue(abortError)
    const { result } = renderHook(() => useAIAssist())

    await act(async () => {
      await result.current.open('currentFinancialSituation', '')
    })

    // AbortError should be swallowed — popup stays loading until explicitly closed
    // (In practice, discard() is called first which triggers the abort)
    expect(result.current.error).toBeNull()
  })

  it('retry does nothing when activeField is null', () => {
    const { result } = renderHook(() => useAIAssist())
    act(() => {
      result.current.retry('some input')
    })
    expect(result.current.popupState).toBe('closed')
  })

  it('handles non-Error rejection values in open()', async () => {
    mockGetAISuggestion.mockRejectedValue('String reject error')
    const { result } = renderHook(() => useAIAssist())

    await act(async () => {
      await result.current.open('reasonForApplying', '')
    })

    expect(result.current.popupState).toBe('suggestion')
    expect(result.current.error).toBe('Failed to generate suggestion. Please try again.')
  })

  it('aborts previous active request when open() is called sequentially', async () => {
    let firstSignal: AbortSignal | undefined
    mockGetAISuggestion.mockImplementation(async (field, val, sig) => {
      if (val === 'first') {
        firstSignal = sig
        return new Promise((resolve) => setTimeout(() => resolve('First Result'), 100))
      }
      return 'Second Result'
    })

    const { result } = renderHook(() => useAIAssist())

    await act(async () => {
      const p1 = result.current.open('currentFinancialSituation', 'first')
      const p2 = result.current.open('currentFinancialSituation', 'second')
      await Promise.all([p1, p2])
    })

    expect(firstSignal?.aborted).toBe(true)
  })
})
