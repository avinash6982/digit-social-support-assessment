import { useState, useRef } from 'react'
import { getAISuggestion } from '../services/aiService'
import type { AIFieldName } from '../services/aiService'

export type AIPopupState = 'closed' | 'loading' | 'suggestion' | 'editing'

export function useAIAssist() {
  const [popupState, setPopupState] = useState<AIPopupState>('closed')
  const [activeField, setActiveField] = useState<AIFieldName | null>(null)
  const [suggestion, setSuggestion] = useState('')
  const [editedSuggestion, setEditedSuggestion] = useState('')
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const open = async (fieldName: AIFieldName, currentValue: string) => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setActiveField(fieldName)
    setPopupState('loading')
    setError(null)
    setSuggestion('')
    setEditedSuggestion('')

    try {
      const result = await getAISuggestion(fieldName, currentValue, abortRef.current.signal)
      setSuggestion(result)
      setEditedSuggestion(result)
      setPopupState('suggestion')
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Failed to generate suggestion. Please try again.')
      setPopupState('suggestion')
    }
  }

  const retry = (currentValue: string) => {
    if (activeField) open(activeField, currentValue)
  }

  const startEdit = () => setPopupState('editing')

  const handleEditChange = (value: string) => setEditedSuggestion(value)

  const accept = (): string => {
    const value = popupState === 'editing' ? editedSuggestion : suggestion
    close()
    return value
  }

  const discard = () => {
    abortRef.current?.abort()
    close()
  }

  const close = () => {
    abortRef.current = null
    setPopupState('closed')
    setActiveField(null)
    setSuggestion('')
    setEditedSuggestion('')
    setError(null)
  }

  return {
    popupState,
    activeField,
    suggestion,
    editedSuggestion,
    error,
    open,
    retry,
    startEdit,
    handleEditChange,
    accept,
    discard,
  }
}
