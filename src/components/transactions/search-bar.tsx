"use client";
import { Search } from "lucide-react";
import { useEffect, useState, useCallback, memo } from "react";
import debounce from "lodash/debounce";

interface SearchBarProps {
  onSearch: (search: string) => void;
  type: string;
  value: string;
}

function SearchBar({ onSearch, type, value }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  const debouncedSearch = useCallback(
    (value: string) => {
      onSearch(value);
    },
    [onSearch]
  );

  const debouncedCallback = debounce(debouncedSearch, 300);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedCallback(newValue);
  };

  return (
    <div className="flex items-center gap-4 px-5 py-3 rounded-lg border border-grey-500 lg:max-w-[320px]">
      <input 
        type="search"
        placeholder={`Search ${type}`} 
        aria-label="Search transactions"
        className="w-full outline-none"
        value={localValue}
        onChange={handleSearch}
      />
      <Search className="w-4 h-4 text-grey-900"/>
    </div>
  );
}

export default memo(SearchBar);