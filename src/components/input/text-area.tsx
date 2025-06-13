import React from 'react'
import { forwardRef } from 'react'

type TextAreaProps = {
  label: string
  name?: string
  placeholder?: string
  error?: string
  required?: boolean
  value?: string
  rows?: number
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      name,
      placeholder,
      error,
      required = false,
      value,
      rows = 4,
      onChange,
      ...props
    },
    ref
  ) => {
    return (
      <div>
        <label 
          className="block text-gray-500 text-xs font-bold mb-1" 
          htmlFor={name}
        >
          {label}
          {required && <span className="text-app-red ml-1">*</span>}
        </label>
        <textarea
          ref={ref}
          className={`appearance-none border border-beige-500 rounded-lg w-full py-3 px-5 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical ${
            error ? 'border-app-red focus:ring-app-red' : ''
          }`}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        {error && (
          <p className="text-app-red text-xs mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

// Display name for React DevTools
TextArea.displayName = 'TextArea'

export default TextArea 