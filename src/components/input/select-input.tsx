"use client";

import { COLOR_TAG_OPTIONS } from "@/data/budget";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Option = string | { label: string; value: string | number };

type SelectInputProps = {
  label: string;
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  withColorTag?: boolean;
  error?: string;
  required?: boolean;
  placeholder?: string;
};

const SelectInput = ({
  label,
  options,
  value = "",
  onValueChange,
  withColorTag = false,
  error,
  required = true,
  placeholder = "Select an option",
}: SelectInputProps) => {
  const getOptionValue = (option: Option): string => {
    return typeof option === "string" ? option : option.value.toString();
  };

  const getOptionLabel = (option: Option): string => {
    return typeof option === "string" ? option : option.label;
  };

  const getColorForValue = (val: string): string | undefined => {
    return COLOR_TAG_OPTIONS.find((option) => option.value === val)?.value;
  };

  return (
    <div className="space-y-1">
      <label className="block text-gray-500 text-xs font-bold">
        {label}
        {required && <span className="text-app-red ml-1">*</span>}
      </label>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            "w-full px-5 py-3 h-auto rounded-lg border border-beige-500 text-grey-900 bg-transparent",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            error && "border-app-red focus:ring-app-red"
          )}
        >
          {withColorTag && value ? (
            <span className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: getColorForValue(value) }}
              />
              <span>
                {getOptionLabel(
                  options.find((opt) => getOptionValue(opt) === value) || value
                )}
              </span>
            </span>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>

        <SelectContent position="popper" sideOffset={4}>
          {options.map((option) => {
            const optionValue = getOptionValue(option);
            const optionLabel = getOptionLabel(option);
            return (
              <SelectItem key={optionValue} value={optionValue}>
                {withColorTag ? (
                  <span className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: getColorForValue(optionValue) }}
                    />
                    <span>{optionLabel}</span>
                  </span>
                ) : (
                  optionLabel
                )}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {error && (
        <p className="text-app-red text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

SelectInput.displayName = "SelectInput";

export default SelectInput;
