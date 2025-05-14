"use client";
import SearchBar from "@/components/transactions/search-bar";
import Sort from "@/components/transactions/sort";
import Filter from "@/components/transactions/filter";
import React, { useState, useMemo } from "react";
import { transactions } from "@/components/transactions-summary/data";
import TransactionListMobile from "@/components/transactions/transaction-list-mobile";
import TransactionsTable from "@/components/transactions/transactions-table";
import Pagination from "@/components/pagination";

const PER_PAGE = 10;  

export default function TransactionsPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sortOption, setSortOption] = useState("Latest");
  const [activeCategory, setActiveCategory] = useState("All Transactions");
  const [currentPage, setCurrentPage] = useState(1);
  
  
  const handleSearch = (search: string) => {
    setGlobalFilter(String(search));
  }

  // Derived state: Filter first, then sort
  const processedData = useMemo(() => {
    // Step 1: Apply filtering
    const filteredData = activeCategory === "All Transactions"
      ? [...transactions]
      : transactions.filter(transaction => transaction.category === activeCategory);

    // Step 2: Apply sorting
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
  }, [activeCategory, sortOption]);

  const totalPages = Math.ceil((processedData.length * 2) / PER_PAGE);
  console.log("totalPages = ", totalPages);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  // Get paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;
    return [...processedData, ...processedData].slice(startIndex, endIndex);
  }, [processedData, currentPage]);

  return (
    <div className="w-[95%] md:w-[90%] mx-auto">
      <h1 className="text-xl font-semibold mb-8">Transactions</h1>
      <div className="py-6 bg-white rounded-xl">
        <div className="w-[90%] mx-auto">
          <div className="flex items-center gap-4 md:gap-6 justify-between mb-8">
            <div className="md:flex-[30%] lg:flex-[45%]">
              <SearchBar
                onSearch={handleSearch}
              />
            </div>
            <div className="flex items-center gap-6 md:flex-[70%] lg:flex-[55%] md:justify-end">
              <Sort onSort={setSortOption} />
              <Filter onFilter={setActiveCategory} />
            </div>
          </div>
          {/* Mobile List */}
          <div className="block md:hidden">
            <TransactionListMobile data={paginatedData} />
          </div>
          {/* Table for md+ */}
          <div className="hidden md:block mb-6">
            <TransactionsTable
              data={paginatedData}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}