"use client";
import SearchBar from "@/components/transactions/search-bar";
import Sort from "@/components/transactions/sort";
import React, { useState, useMemo } from "react";
import TransactionListMobile from "@/components/transactions/transaction-list-mobile";
import TransactionsTable from "@/components/transactions/transactions-table";
import Pagination from "@/components/pagination";
import PrimaryButton from "@/components/button/primary-btn";
import AddTransactionModal from "@/components/transactions/add-transaction-modal";
import { useQuery } from "@tanstack/react-query";
import { transactionsService } from "@/lib/api/services/transactions";
import { BrushCleaning } from "lucide-react";
import { Transaction } from "@/lib/api/services/transactions/types";


const PER_PAGE = 10;  

const LoadingSkeleton = () => (
  <div className="py-6 bg-white rounded-xl">
    <div className="w-[90%] mx-auto">
      <div className="flex items-center gap-4 md:gap-6 justify-between mb-8">
        <div className="md:flex-[30%] lg:flex-[45%]">
          <div className="h-12 bg-gray-200 animate-pulse rounded-lg" />
        </div>
        <div className="flex items-center gap-6 md:flex-[70%] lg:flex-[55%] md:justify-end">
          <div className="h-12 w-32 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </div>
      <div className="block md:hidden">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-5 border-b border-grey-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full" />
                <div>
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-2" />
                  <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden md:block">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-grey-100">
              <div className="flex items-center gap-4 flex-[45%]">
                <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full" />
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="flex-[18.33%]">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="flex-[18.33%]">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="flex-[18.33%]">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function TransactionsPage() {
  const [sortOption, setSortOption] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);

  const { data: transactionsResponse, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionsService.getTransactions(),
    staleTime: 0,
  });

  const transactions: Transaction[] = useMemo(() => transactionsResponse?.data || [], [transactionsResponse]);

  console.log("Refetched transactions =>", transactions);
  
  // Derived state: Apply sorting only
  const processedData = useMemo(() => {
    return [...transactions].sort((a, b) => {
      switch (sortOption) {
        case "Latest":
          return new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime();
        case "Oldest":
          return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
        case "A to Z":
          return a.recipient.localeCompare(b.recipient);
        case "Z to A":
          return b.recipient.localeCompare(a.recipient);
        case "Highest":
          return b.amount - a.amount;
        case "Lowest":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  }, [sortOption, transactions]);

  const totalPages = Math.ceil((processedData.length * 2) / PER_PAGE);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  // Get paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, currentPage]);

  const PageHeader = () => (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-xl font-semibold">Transactions</h1>
      <div>
        <PrimaryButton
          label="+ Add Transaction"
          onClick={() => setIsAddTransactionModalOpen(true)}
        />
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="py-12 bg-white rounded-xl">
      <div className="w-[90%] mx-auto text-center">
        <BrushCleaning
          className="w-[100px] h-[100px] mx-auto mb-6 text-grey-900"
          strokeWidth={1}
        />
        <h2 className="text-xl font-semibold mb-2">No Transactions Yet</h2>
        <p className="text-grey-500 mb-6">
          Start tracking your finances by adding your first transaction.
        </p>
      </div>
    </div>
  );

  const TransactionList = () => {
    const [tableFilter, setTableFilter] = useState("");
    
    return (
      <div className="py-6 bg-white rounded-xl">
        <div className="w-[90%] mx-auto">
          <div className="flex items-center gap-4 md:gap-6 justify-between mb-8">
            <div className="md:flex-[30%] lg:flex-[45%]">
              <SearchBar
                type="transaction"
                onSearch={setTableFilter}
                value={tableFilter}
              />
            </div>
            <div className="flex items-center gap-6 md:flex-[70%] lg:flex-[55%] md:justify-end">
              <Sort onSort={setSortOption} />
              {/* <Filter onFilter={setActiveCategory} /> */}
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
              globalFilter={tableFilter}
              setGlobalFilter={setTableFilter}
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
    );
  };

  return (
    <>
      <div className="w-[95%] md:w-[90%] mx-auto">
        <PageHeader />
        {isLoading ? <LoadingSkeleton /> :
          transactions.length === 0 ? <EmptyState /> : <TransactionList />
        }
      </div>
      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        setIsOpen={setIsAddTransactionModalOpen}
      />
    </>
  );
}