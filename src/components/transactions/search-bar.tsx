"use client";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar({ onSearch, type }: { onSearch: (search: string) => void, type: string }) {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  }

  return (
    <div className="flex items-center gap-4 px-5 py-3 rounded-lg border border-grey-500 lg:max-w-[320px]">
      <input 
        type="search"
        placeholder={`Search ${type}`} 
        aria-label="Search transactions"
        className="w-full outline-none"
        value={search}
        onChange={handleSearch}
      />
      <Search className="w-4 h-4 text-grey-900"/>
    </div>
  )
}