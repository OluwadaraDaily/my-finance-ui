"use client"
import { Eye, EyeOff } from "lucide-react"
import React, { forwardRef } from "react"

type PasswordInputProps = {
  label: string
  name?: string
  placeholder?: string
  error?: string
  required?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'>

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      name,
      placeholder,
      error,
      required = true,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false)

    return (
      <div>
        <label 
          className="block text-gray-500 text-xs font-bold mb-1" 
          htmlFor={name}
        >
          {label}
          {required && <span className="text-app-red ml-1">*</span>}
        </label>
        <div className="flex items-center gap-4 border border-beige-500 rounded-lg overflow-hidden pr-5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
          <input
            ref={ref}
            className={`appearance-none w-full py-3 pl-5 text-gray-900 leading-tight focus:outline-none ${
              error ? 'text-app-red' : ''
            }`}
            id={name}
            type={isVisible ? 'text' : 'password'}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete="new-password"
            aria-label={label}
            aria-invalid={error ? 'true' : 'false'}
            required={required}
            {...props}
          />
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="focus:outline-none hover:cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={isVisible ? "Hide password" : "Show password"}
          >
            {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
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
PasswordInput.displayName = 'PasswordInput'

export default PasswordInput