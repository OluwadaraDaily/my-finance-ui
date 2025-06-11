import React from 'react'
import { forwardRef } from 'react'

type TextInputProps = {
  label: string
  type?: string
  name?: string
  placeholder?: string
  error?: string
  withPrefix?: boolean
  prefix?: string
  required?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'>

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      type = 'text',
      name,
      placeholder,
      error,
      withPrefix = false,
      prefix = "",
      required = true,
      value,
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
        <div className="relative">
          {withPrefix && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={`appearance-none border border-beige-500 rounded-lg w-full py-3 px-5 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              error ? 'border-app-red focus:ring-app-red' : ''
            } ${withPrefix ? 'pl-10' : ''}`}
            id={name}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            autoComplete="off"
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
        </div>
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
TextInput.displayName = 'TextInput'

export default TextInput