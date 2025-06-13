"use client";

import { COLOR_TAG_OPTIONS } from "@/data/budget";
import { ChevronDown } from "lucide-react";
import { useState, forwardRef } from "react";

// Define option type for flexibility
type Option = string | { label: string; value: string };

type SelectInputProps = {
  label: string;
  name?: string;
  options: Option[];
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  withColorTag?: boolean;
  error?: string;
  required?: boolean;
  placeholder?: string;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'onChange' | 'value' | 'onBlur'>

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      label,
      name,
      options,
      value = "",
      onChange,
      onBlur,
      withColorTag = false,
      error,
      required = true,
      placeholder = "Select an option",
      ...props
    },
    ref
  ) => {
    // Helper functions to handle both string and object options
    const getOptionValue = (option: Option): string => {
      return typeof option === 'string' ? option : option.value;
    };

    const getOptionLabel = (option: Option): string => {
      return typeof option === 'string' ? option : option.label;
    };

    const findOptionByValue = (searchValue: string): Option | undefined => {
      return options.find(option => getOptionValue(option) === searchValue);
    };

    const getDisplayLabel = (currentValue: string): string => {
      if (!currentValue) return "";
      const option = findOptionByValue(currentValue);
      return option ? getOptionLabel(option) : currentValue;
    };

    const filteredOptions = options.filter(option => getOptionValue(option) !== value);
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
      setIsOpen(!isOpen);
    };

    const handleSelect = (selectedOption: Option) => {
      const optionValue = getOptionValue(selectedOption);
      if (onChange) {
        // Always create a synthetic event for compatibility with react-hook-form
        const syntheticEvent = {
          target: { value: optionValue, name: name || '' },
          currentTarget: { value: optionValue, name: name || '' },
          type: 'change'
        } as React.ChangeEvent<HTMLSelectElement>;
        
        if (typeof onChange === 'function') {
          onChange(syntheticEvent);
        }
      }
      setIsOpen(false);
      if (onBlur) {
        // Create a synthetic event for onBlur
        const syntheticEvent = {
          target: { value: optionValue, name: name || '' },
          currentTarget: { value: optionValue, name: name || '' },
          type: 'blur'
        } as React.FocusEvent<HTMLSelectElement>;
        
        if (typeof onBlur === 'function') {
          onBlur(syntheticEvent);
        }
      }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <div className="relative">
        <label 
          htmlFor={name} 
          className="block text-gray-500 text-xs font-bold mb-1"
        >
          {label}
          {required && <span className="text-app-red ml-1">*</span>}
        </label>
        
        {/* Hidden select for form integration */}
        <select
          ref={ref}
          name={name}
          value={value}
          onChange={handleSelectChange}
          onBlur={handleBlur}
          className="sr-only"
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => {
            const optionValue = getOptionValue(option);
            const optionLabel = getOptionLabel(option);
            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>

        {/* Custom select UI */}
        <div
          className={`flex items-center justify-between px-5 py-3 rounded-lg border border-beige-500 text-grey-900 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-app-red focus:ring-app-red' : ''
          }`}
          onClick={handleClick}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
          role="button"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-4">
            {withColorTag && value && (
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: COLOR_TAG_OPTIONS.find((option) => option.value === value)?.value }} 
              />
            )}
            <span className={value ? 'text-grey-900' : 'text-gray-500'}>
              {getDisplayLabel(value) || placeholder}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>

        {/* Dropdown options */}
        {isOpen && (
          <div 
            className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg max-h-[200px] md:max-h-[300px] overflow-y-auto px-5 py-3 border border-gray-200" 
            style={{ zIndex: 56 }}
            role="listbox"
          >
            {filteredOptions.map((option, index) => {
              const optionValue = getOptionValue(option);
              const optionLabel = getOptionLabel(option);
              return (
                <div key={optionValue}>
                  <div
                    className="hover:bg-grey-100 cursor-pointer flex items-center gap-4 py-2 rounded"
                    onClick={() => handleSelect(option)}
                    role="option"
                    aria-selected={value === optionValue}
                  >
                    {withColorTag && (
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLOR_TAG_OPTIONS.find((opt) => opt.value === optionValue)?.value }} 
                      />
                    )}
                    {optionLabel}
                  </div>
                  {index !== filteredOptions.length - 1 && (
                    <div className="h-px w-full my-3 bg-grey-100" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="text-app-red text-xs mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

// Display name for React DevTools
SelectInput.displayName = 'SelectInput';

export default SelectInput;