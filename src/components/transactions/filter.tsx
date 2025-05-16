import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function Filter({ onFilter }: { onFilter: (filter: string) => void }) {
  const categories = ["All Transactions", "Entertainment", "Bills", "Groceries", "Dining Out", "Shopping", "Transportation", "Personal Care", "Education", "Lifestyle", "Shopping", "General"]

  const [isOpen, setIsOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<string>(() => categories[0]);

  useEffect(() => {
    onFilter(currentFilter);
  }, [currentFilter, onFilter]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  }

  const handleFilter = (option :string) => {
    setCurrentFilter(option);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={handleOpen}>
        <div className="md:hidden inline-block">
          <Image
            src="/icons/filter.svg"
            alt="filter"
            width={20}
            height={20}
          />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <p className="text-sm text-grey-500">Categories</p>
          <div className="flex items-center gap-2 px-5 py-3 rounded-lg border border-grey-900">
            <div className="truncate max-w-[70px] text-sm">{currentFilter}</div>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="absolute top-[120%] right-0 md:left-1/2 md:translate-x-[-50%] bg-white rounded-lg px-5 py-3 w-[177px] h-[300px] shadow-menu overflow-y-auto"
          onClick={handleOpen}
        >
          {categories.map((option :string, index :number) => (
            <div key={`${option}-${index}`}>
              <div className={`cursor-pointer text-sm ${currentFilter === option ? "font-bold" : ""}`} onClick={() => handleFilter(option)}>
                {option}
              </div>
              {index !== categories.length - 1 && (
                <div className="h-[1px] bg-grey-100 w-full my-3"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}