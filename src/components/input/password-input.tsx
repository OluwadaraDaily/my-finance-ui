"use client"
import { Eye, EyeOff } from "lucide-react"
import React from "react"

export default function PasswordInput({
  label,
  name, 
  placeholder,
  value,
  required = true,
  onChange,
  error
}: {
  label: string
  name: string
  placeholder: string
  value: string
  required?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}
) {
  const [isVisible, setIsVisible] = React.useState(false)
  return (
    <div>
      <label className="block text-gray-500 text-xs font-bold mb-1" htmlFor={label}>
        {label}
      </label>
      <div className="flex items-center gap-4 border border-beige-500 rounded-lg overflow-hidden pr-5">
        <input
          className={`appearance-none w-full py-3 pl-5 text-gray-500 leading-tight focus:outline-none ${
            error ? 'border-red-500' : ''
          }`}
          id={label}
          type={isVisible ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="new-password"
          aria-autocomplete="none"
          aria-label={label}
          aria-invalid={error ? 'true' : 'false'}
          aria-errormessage={error ? `${label}-error` : undefined}
          aria-describedby={error ? `${label}-error` : undefined}
          aria-required="true"
          required={required}
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)} // Toggle visibility
          className="focus:outline-none hover:cursor-pointer"
        >
          {isVisible ? <EyeOff /> : <Eye />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>  
  )
}