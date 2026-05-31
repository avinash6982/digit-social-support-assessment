import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { labelClasses, inputClasses, inputErrorClasses, errorMsgClasses } from './formStyles'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
  colSpan?: boolean
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, label, error, colSpan, className = '', ...props }, ref) => {
    const { isRtl } = useLanguage()
    const textAlign = isRtl ? 'text-right' : 'text-left'

    const errorId = `${id}-error`

    return (
      <div className={`flex flex-col gap-1.5 text-left${colSpan ? ' md:col-span-2' : ''}`}>
        <label htmlFor={id} className={`${labelClasses} ${textAlign}`}>{label}</label>
        <input
          ref={ref}
          id={id}
          className={`${inputClasses} ${textAlign}${error ? ` ${inputErrorClasses}` : ''}${className ? ` ${className}` : ''}`}
          {...props}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        {error && <p id={errorId} role="alert" className={errorMsgClasses}>{error}</p>}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
export default FormField
