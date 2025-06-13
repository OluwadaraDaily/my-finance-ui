"use client";

import SearchBar from "@/components/transactions/search-bar";
import Sort from "@/components/transactions/sort";
import { BILLS_SUMMARY } from "@/data/bills";
import { formatCurrency } from "@/utils/format";
import { ReceiptText } from "lucide-react";
import { useMemo, useState } from "react";
import { BILLS_DATA } from "@/data/bills";
import BillsListMobile from "@/components/bills/bills-list-mobile";
import BillsTable from "@/components/bills/bills-table";

export default function BillsPage() {
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("Latest");

  const processedData = useMemo(() => {
    // Filter the data based on the search query
    const filteredData = BILLS_DATA.filter(bill => {
      const nameMatch = bill.name.toLowerCase().includes(search.toLowerCase());
      return nameMatch;
    });

    return [...filteredData].sort((a, b) => {
      switch (sortOption) {
        case "Latest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "Oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "A to Z":
          return a.name.localeCompare(b.name);
        case "Z to A":
          return b.name.localeCompare(a.name);
        case "Highest":
          return b.amount - a.amount;
        case "Lowest":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  }, [sortOption, search]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="w-[95%] md:w-[90%] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold">Recurring Bills</h1>
      </div>
      <div className="lg:flex items-start gap-4">
        <div className="flex flex-col md:flex-row md:items-stretch lg:flex-col gap-4 mb-8 lg:flex-[40%]">
          {/* Total Bills */}
          <div className="bg-grey-900 py-6 px-5 rounded-xl flex md:flex-col md:items-start md:justify-end items-center gap-6 text-white md:flex-1">
            <ReceiptText />
            <div>
              <p className="text-sm  mb-2">Total Bills</p>
              <p className="text-xl font-bold">{formatCurrency(384.98)}</p>
            </div>
          </div>
          {/* Summary */}
          <div className="p-5 rounded-xl bg-white md:flex-1">
            <h2 className="text-base font-bold mb-4">Summary</h2>
            <div className="flex flex-col">
              {Object.entries(BILLS_SUMMARY).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs ${key === "Due Soon" ? "text-app-red" : "text-grey-900"}`}>
                      {key} 
                    </p>
                    <div className={`text-sm font-bold ${key === "Due Soon" ? "text-app-red" : "text-grey-900"}`}>
                      <span className="mr-px">{value.numberOfBills}</span>
                      <span>({formatCurrency(value.totalAmount)})</span>
                    </div>
                  </div>
                  {key !== Object.keys(BILLS_SUMMARY).slice(-1)[0] && (
                    <div className="h-px bg-grey-100 w-full my-4 opacity-85" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl py-6 lg:flex-[60%]">
          <div className="w-[90%] mx-auto">
            <div className="flex items-center gap-4 md:gap-6 justify-between mb-8">
              <div className="flex-[90%] md:flex-[70%] lg:flex-1">
                <SearchBar
                  type="bill"
                  onSearch={handleSearch}
                  value={search}
                />
              </div>
              <div className="flex items-center justify-end gap-6 flex-[10%] md:flex-[30%] lg:flex-1">
                <Sort onSort={setSortOption} />
              </div>
            </div>
            {/* Mobile List */}
            <div className="block md:hidden">
              <BillsListMobile data={processedData} />
            </div>
            {/* Table for md+ */}
            <div className="hidden md:block mb-6">
              <BillsTable
                data={processedData}
                globalFilter={search}
                setGlobalFilter={setSearch}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 