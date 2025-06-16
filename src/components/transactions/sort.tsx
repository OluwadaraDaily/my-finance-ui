"use client";

import { ChevronDown } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useState, useEffect } from "react";

export default function Sort({ onSort }: { onSort: (sortOption: string) => void }) {
  const sortOptions = ["Latest", "Oldest", "A to Z", "Z to A", "Highest", "Lowest"];
  const [currentSort, setCurrentSort] = useState<string>(() => sortOptions[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onSort(currentSort);
  }, [currentSort, onSort]);

  const handleSort = (option: string) => {
    setCurrentSort(option);
    setIsOpen(false);
  }

  const handleOpen = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={handleOpen}>
        <div className="md:hidden inline-block">
          <Image
            src="/icons/sort.svg"
            alt="sort"
            width={20}
            height={20}
            priority
            sizes="20px"
          />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <p className="text-sm text-grey-500">Sort by</p>
          <div className="flex items-center gap-2 px-5 py-3 rounded-lg border border-grey-900 text-sm">
            {currentSort}
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg py-2 z-10">
          {sortOptions.map((option) => (
            <button
              key={option}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-grey-100 ${
                currentSort === option ? "font-semibold" : ""
              }`}
              onClick={() => handleSort(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}