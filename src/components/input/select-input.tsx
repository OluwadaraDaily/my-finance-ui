"use client";

import { COLOR_TAG_OPTIONS } from "@/data/budget";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function SelectInput({
  label,
  name,
  options,
  value,
  onChange,
  withColorTag = false,
}: {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  withColorTag?: boolean;
}) {
  const filteredOptions = options.filter(option => option !== value)
  const [isOpen, setIsOpen] = useState(false);


  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label htmlFor={name} className="block mb-1 text-grey-500 font-bold text-xs">{label}</label>
      <div
        className="flex items-center justify-between px-5 py-3 rounded-lg border border-beige-500 text-grey-900"
        onClick={handleClick}
      >
        <div className="flex items-center gap-4">
          {withColorTag && (
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLOR_TAG_OPTIONS.find((option) => option.label === value)?.value }} />
          )}
          {value}
        </div>
        <ChevronDown className={`w-4 h-4 ${isOpen ? "rotate-180" : ""} transition-transform duration-200`} />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg max-h-[200px] md:max-h-[300px] overflow-y-auto px-5 py-3" style={{ zIndex: 56 }}>
          {filteredOptions.map((option, index) => (
            <div key={option}>
              <div
                className="hover:bg-grey-100 cursor-pointer flex items-center gap-4"
                onClick={() => handleSelect(option) }
              >
                {withColorTag && (
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLOR_TAG_OPTIONS.find((opt) => opt.label === option)?.value }} />
                )}
                {option}
              </div>
              {index !== filteredOptions.length - 1 && (
                <div className="h-px w-full my-3 bg-grey-100" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}