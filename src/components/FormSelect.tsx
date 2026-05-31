import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { labelClasses, inputClasses, inputErrorClasses, errorMsgClasses } from './formStyles'

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  label: string
  error?: string
  colSpan?: boolean
  children: React.ReactNode
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ id, label, error, colSpan, children, className = '', ...props }, ref) => {
    const { isRtl } = useLanguage()
    const textAlign = isRtl ? 'text-right' : 'text-left'

    const errorId = `${id}-error`

    return (
      <div className={`flex flex-col gap-1.5 text-left${colSpan ? ' md:col-span-2' : ''}`}>
        <label htmlFor={id} className={`${labelClasses} ${textAlign}`}>{label}</label>
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={`${inputClasses} ${textAlign} pr-10 appearance-none${error ? ` ${inputErrorClasses}` : ''}${className ? ` ${className}` : ''}`}
            {...props}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          >
            {children}
          </select>
          <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 flex items-center px-4 text-slate-400 ${isRtl ? 'left-0' : 'right-0'}`}>
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {error && <p id={errorId} role="alert" className={errorMsgClasses}>{error}</p>}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'
export default FormSelect
