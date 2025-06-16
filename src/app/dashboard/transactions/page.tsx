"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionsService } from "@/lib/api/services/transactions";
import { Transaction } from "@/lib/api/services/transactions/types";
import { BrushCleaning } from "lucide-react";

// Lazy load components
const SearchBar = dynamic(() => import("@/components/transactions/search-bar"));
const Sort = dynamic(() => import("@/components/transactions/sort"));
const TransactionListMobile = dynamic(
  () => import("@/components/transactions/transaction-list-mobile"),
  {
    loading: () => <ComponentLoader />,
    ssr: false
  }
);
const TransactionsTable = dynamic(
  () => import("@/components/transactions/transactions-table"),
  {
    loading: () => <ComponentLoader />,
    ssr: false
  }
);
const Pagination = dynamic(() => import("@/components/pagination"));
const AddTransactionModal = dynamic(
  () => import("@/components/transactions/add-transaction-modal"),
  {
    ssr: false
  }
);
const PrimaryButton = dynamic(() => import("@/components/button/primary-btn"));

const PER_PAGE = 10;

// Loading skeleton component
function ComponentLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded-lg w-full mb-4"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="mb-4">
          <div className="h-16 bg-gray-200 rounded-lg w-full"></div>
        </div>
      ))}
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="w-[95%] md:w-[90%] mx-auto">
    <div className="flex items-center justify-between mb-8">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
    </div>
    <div className="py-6 bg-white rounded-xl">
      <div className="w-[90%] mx-auto">
        <div className="flex items-center gap-4 md:gap-6 justify-between mb-8">
          <div className="md:flex-[30%] lg:flex-[45%]">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-6 md:flex-[70%] lg:flex-[55%] md:justify-end">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <ComponentLoader />
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="py-6 bg-white rounded-xl">
    <div className="w-[90%] mx-auto text-center">
      <BrushCleaning
          className="w-[100px] h-[100px] mx-auto mb-6 text-grey-900"
          strokeWidth={1}
        />
      <h3 className="text-lg font-semibold mb-2">No Transactions Yet</h3>
      <p className="text-gray-500 mb-6">Start adding your transactions to track your spending.</p>
    </div>
  </div>
);

const PageHeader = ({ onAddTransaction }: { onAddTransaction: () => void }) => (
  <div className="flex items-center justify-between mb-8">
    <h1 className="text-xl font-semibold">Transactions</h1>
    <div>
      <PrimaryButton
        label="+ Add Transaction"
        onClick={onAddTransaction}
      />
    </div>
  </div>
);

export default function TransactionsPage() {
  const [sortOption, setSortOption] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);

  const { data: transactionsResponse, isLoading, isFetching } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionsService.getTransactions(),
    staleTime: 0,
  });

  const transactions: Transaction[] = useMemo(() => transactionsResponse?.data || [], [transactionsResponse]);
  
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

  const totalPages = Math.ceil(processedData.length / PER_PAGE);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  // Get paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, currentPage]);

  const TransactionList = () => {
    const [tableFilter, setTableFilter] = useState("");
    
    return (
      <div className="py-6 bg-white rounded-xl">
        <div className="w-[90%] mx-auto">
          <div className="flex items-center gap-4 md:gap-6 justify-between mb-8">
            <div className="md:flex-[30%] lg:flex-[45%]">
              <Suspense fallback={<div className="h-10 bg-gray-200 rounded animate-pulse" />}>
                <SearchBar
                  type="transaction"
                  onSearch={setTableFilter}
                  value={tableFilter}
                />
              </Suspense>
            </div>
            <div className="flex items-center gap-6 md:flex-[70%] lg:flex-[55%] md:justify-end">
              <Suspense fallback={<div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />}>
                <Sort onSort={setSortOption} />
              </Suspense>
            </div>
          </div>
          {/* Mobile List */}
          <div className="block md:hidden">
            <Suspense fallback={<ComponentLoader />}>
              <TransactionListMobile data={paginatedData} />
            </Suspense>
          </div>
          {/* Table for md+ */}
          <div className="hidden md:block mb-6">
            <Suspense fallback={<ComponentLoader />}>
              <TransactionsTable
                data={paginatedData}
                globalFilter={tableFilter}
                setGlobalFilter={setTableFilter}
              />
            </Suspense>
          </div>
          <div className="mt-6">
            <Suspense fallback={<div className="h-10 bg-gray-200 rounded animate-pulse" />}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Suspense>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-[95%] md:w-[90%] mx-auto">
        <PageHeader onAddTransaction={() => setIsAddTransactionModalOpen(true)} />
        {isLoading || isFetching ? <LoadingSkeleton /> :
          transactions.length === 0 ? <EmptyState /> : <TransactionList />
        }
      </div>
      <Suspense fallback={null}>
        <AddTransactionModal
          isOpen={isAddTransactionModalOpen}
          setIsOpen={setIsAddTransactionModalOpen}
        />
      </Suspense>
    </>
  );
}