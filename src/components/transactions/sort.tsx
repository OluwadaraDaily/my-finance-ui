"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
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
        <div
          className="absolute top-[120%] right-0 md:left-1/2 md:translate-x-[-50%] bg-white rounded-lg px-5 py-3 w-[114px] shadow-[0_0_10px_rgba(0,0,0,0.1)]"
          onClick={handleOpen}
        >
          {sortOptions.map((option :string, index :number) => (
            <div key={option} className="z-10 bg-white">
              <div className={`cursor-pointer text-sm ${currentSort === option ? "font-bold" : ""}`} onClick={() => handleSort(option)}>
                {option}
              </div>
              {index !== sortOptions.length - 1 && (
                <div className="h-[1px] bg-grey-100 w-full my-3"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}