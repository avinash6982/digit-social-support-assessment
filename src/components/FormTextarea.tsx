import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { labelClasses, inputClasses, inputErrorClasses, errorMsgClasses } from './formStyles'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  error?: string
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ id, label, error, className = '', ...props }, ref) => {
    const { isRtl } = useLanguage()
    const textAlign = isRtl ? 'text-right' : 'text-left'

    return (
      <div className="flex flex-col gap-1.5 text-left">
        <label htmlFor={id} className={`${labelClasses} ${textAlign}`}>{label}</label>
        <textarea
          ref={ref}
          id={id}
          className={`${inputClasses} ${textAlign} resize-none${error ? ` ${inputErrorClasses}` : ''}${className ? ` ${className}` : ''}`}
          {...props}
        />
        {error && <p className={errorMsgClasses}>{error}</p>}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'
export default FormTextarea
