import { useEffect, useRef } from 'react'
import Button from './Button'
import { inputClasses } from './formStyles'
import { useLanguage } from '../hooks/useLanguage'
import type { AIPopupState } from '../hooks/useAIAssist'

interface AIAssistPopupProps {
  state: AIPopupState
  suggestion: string
  editedSuggestion: string
  error: string | null
  onAccept: () => void
  onEdit: () => void
  onDiscard: () => void
  onEditChange: (value: string) => void
  onRetry: () => void
}

export function AIAssistPopup({
  state,
  suggestion,
  editedSuggestion,
  error,
  onAccept,
  onEdit,
  onDiscard,
  onEditChange,
  onRetry,
}: AIAssistPopupProps) {
  const { isRtl, t } = useLanguage()
  const primaryButtonRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus primary action on state change
  useEffect(() => {
    if (state === 'suggestion') primaryButtonRef.current?.focus()
    if (state === 'editing') textareaRef.current?.focus()
  }, [state])

  // Focus trap + Escape to discard
  useEffect(() => {
    if (state === 'closed') return
    const modal = document.getElementById('ai-assist-modal')
    if (!modal) return

    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onDiscard(); return }
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [state, onDiscard])

  if (state === 'closed') return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
      <div
        id="ai-assist-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-modal-title"
        aria-describedby="ai-modal-body"
        className={`
          w-full max-w-lg p-7 rounded-[32px] text-center
          bg-white/80 dark:bg-[#111329]/95 backdrop-blur-3xl
          border border-white/10 dark:border-white/5
          shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7),0_0_50px_-10px_rgba(99,102,241,0.2)]
          animate-[fadeIn_0.2s_ease-out_forwards]
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div aria-hidden="true" className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-indigo-500 dark:text-indigo-400">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" /><path d="M12 8v4l3 3" />
            </svg>
          </div>
          <h2 id="ai-modal-title" className="text-sm font-extrabold text-slate-800 dark:text-white tracking-wide">
            {t('i18n_90')}
          </h2>
        </div>

        {/* Loading */}
        {state === 'loading' && (
          <div id="ai-modal-body" className="flex flex-col items-center gap-4 py-4">
            <div aria-hidden="true" className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('i18n_91')}</p>
          </div>
        )}

        {/* Suggestion / Error */}
        {state === 'suggestion' && (
          <div id="ai-modal-body" className="flex flex-col gap-4">
            {error ? (
              <div className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm text-red-500 dark:text-red-400 text-left">
                {error}
              </div>
            ) : (
              <>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left">
                  {t('i18n_92')}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200 text-left leading-relaxed bg-slate-500/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-2xl px-4 py-3">
                  {suggestion}
                </p>
              </>
            )}

            <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              {error ? (
                <>
                  <Button ref={primaryButtonRef} variant="primary" type="button" onClick={onRetry} className="flex-1 justify-center text-sm py-2.5">
                    {t('i18n_98')}
                  </Button>
                  <Button variant="secondary" type="button" onClick={onDiscard} className="flex-1 justify-center text-sm py-2.5">
                    {t('i18n_96')}
                  </Button>
                </>
              ) : (
                <>
                  <Button ref={primaryButtonRef} variant="primary" type="button" onClick={onAccept} className="flex-1 justify-center text-sm py-2.5">
                    {t('i18n_94')}
                  </Button>
                  <Button variant="secondary" type="button" onClick={onEdit} className="flex-1 justify-center text-sm py-2.5">
                    {t('i18n_95')}
                  </Button>
                  <Button variant="secondary" type="button" onClick={onDiscard} className="justify-center text-sm py-2.5">
                    {t('i18n_96')}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Edit mode */}
        {state === 'editing' && (
          <div id="ai-modal-body" className="flex flex-col gap-4">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left">
              {t('i18n_93')}
            </p>
            <textarea
              ref={textareaRef}
              rows={6}
              value={editedSuggestion}
              onChange={(e) => onEditChange(e.target.value)}
              className={`${inputClasses} resize-none text-left`}
              aria-label={t('i18n_93')}
            />
            <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Button ref={primaryButtonRef} variant="primary" type="button" onClick={onAccept} className="flex-1 justify-center text-sm py-2.5">
                {t('i18n_94')}
              </Button>
              <Button variant="secondary" type="button" onClick={onDiscard} className="flex-1 justify-center text-sm py-2.5">
                {t('i18n_96')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIAssistPopup
