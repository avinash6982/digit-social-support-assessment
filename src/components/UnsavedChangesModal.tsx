import { useEffect, useRef } from 'react'
import Button from './Button'
import { useLanguage } from '../hooks/useLanguage'

interface UnsavedChangesModalProps {
  onStay: () => void
  onLeaveWithoutSaving: () => void
  onSaveAndLeave: () => void
}

export function UnsavedChangesModal({
  onStay,
  onLeaveWithoutSaving,
  onSaveAndLeave,
}: UnsavedChangesModalProps) {
  const { isRtl } = useLanguage()
  const stayButtonRef = useRef<HTMLButtonElement>(null)

  // Focus the Stay button on open
  useEffect(() => {
    stayButtonRef.current?.focus()
  }, [])

  // Trap focus inside the modal
  useEffect(() => {
    const modal = document.getElementById('unsaved-modal')
    if (!modal) return

    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onStay()
        return
      }
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onStay])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      aria-hidden="false"
    >
      <div
        id="unsaved-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        className={`
          w-full max-w-md p-8 rounded-[32px] text-center
          bg-white/80 dark:bg-[#111329]/90 backdrop-blur-3xl
          border border-white/10 dark:border-white/5
          shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]
          animate-[fadeIn_0.2s_ease-out_forwards]
        `}
      >
        {/* Icon */}
        <div aria-hidden="true" className="flex justify-center mb-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-7 h-7 text-amber-500"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>

        <h2
          id="modal-title"
          className="text-base font-extrabold text-slate-800 dark:text-white mb-2"
        >
          {isRtl ? 'لديك تغييرات غير محفوظة' : 'You have unsaved changes'}
        </h2>
        <p
          id="modal-desc"
          className="text-sm text-slate-500 dark:text-slate-400 mb-7"
        >
          {isRtl
            ? 'هل تريد حفظ تقدمك قبل المغادرة؟'
            : 'Would you like to save your progress before leaving?'}
        </p>

        <div className={`flex flex-col gap-3 ${isRtl ? 'items-stretch' : 'items-stretch'}`}>
          <Button
            ref={stayButtonRef}
            variant="primary"
            type="button"
            onClick={onStay}
            className="justify-center"
          >
            {isRtl ? 'البقاء في الصفحة' : 'Stay on page'}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={onSaveAndLeave}
            className="justify-center"
          >
            {isRtl ? 'حفظ ومغادرة' : 'Save and leave'}
          </Button>
          <button
            type="button"
            onClick={onLeaveWithoutSaving}
            className="text-sm text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors duration-200 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 rounded"
          >
            {isRtl ? 'مغادرة بدون حفظ' : 'Leave without saving'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UnsavedChangesModal
