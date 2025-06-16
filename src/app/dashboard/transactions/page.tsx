"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useMemo, useCallback, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionsService } from "@/lib/api/services/transactions";
import { Transaction } from "@/lib/api/services/transactions/types";
import { BrushCleaning } from "lucide-react";
import { ComponentLoader } from "@/components/ui/component-loader";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useTransactionProcessing } from "@/hooks/useTransactionProcessing";

// Memoized components
const MemoizedSearchBar = memo(dynamic(() => import("@/components/transactions/search-bar")));
MemoizedSearchBar.displayName = 'MemoizedSearchBar';

const MemoizedSort = memo(dynamic(() => import("@/components/transactions/sort")));
MemoizedSort.displayName = 'MemoizedSort';

const MemoizedTransactionListMobile = memo(dynamic(
  () => import("@/components/transactions/transaction-list-mobile"),
  {
    loading: () => <ComponentLoader className="h-[400px]" />,
    ssr: false
  }
));
MemoizedTransactionListMobile.displayName = 'MemoizedTransactionListMobile';

const MemoizedTransactionsTable = memo(dynamic(
  () => import("@/components/transactions/transactions-table"),
  {
    loading: () => <ComponentLoader className="h-[400px]" />,
    ssr: false
  }
));
MemoizedTransactionsTable.displayName = 'MemoizedTransactionsTable';

const MemoizedPagination = memo(dynamic(() => import("@/components/pagination")));
MemoizedPagination.displayName = 'MemoizedPagination';

const AddTransactionModal = dynamic(
  () => import("@/components/transactions/add-transaction-modal"),
  {
    ssr: false
  }
);
const PrimaryButton = dynamic(() => import("@/components/button/primary-btn"));

// Memoized empty state
const EmptyState = memo(() => (
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
));
EmptyState.displayName = 'EmptyState';

// Memoized page header
const PageHeader = memo(({ onAddTransaction }: { onAddTransaction: () => void }) => (
  <div className="flex items-center justify-between mb-8">
    <h1 className="text-xl font-semibold">Transactions</h1>
    <div>
      <PrimaryButton
        label="+ Add Transaction"
        onClick={onAddTransaction}
      />
    </div>
  </div>
));
PageHeader.displayName = 'PageHeader';

// Memoized transaction list component
const TransactionList = memo(function TransactionList({ 
  paginatedData, 
  totalPages,
  currentPage,
  onPageChange,
  onSort
}: {
  paginatedData: Transaction[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSort: (option: string) => void;
}) {
  const [tableFilter, setTableFilter] = useState("");
  
  const handleSearch = useCallback((value: string) => {
    setTableFilter(value);
  }, []);
  
  return (
    <div className="py-6 bg-white rounded-xl">
      <div className="w-[90%] mx-auto">
        <div className="flex items-center gap-4 md:gap-6 justify-between mb-8">
          <div className="md:flex-[30%] lg:flex-[45%]">
            <Suspense fallback={<div className="h-10 bg-gray-200 rounded animate-pulse" />}>
              <MemoizedSearchBar
                type="transaction"
                onSearch={handleSearch}
                value={tableFilter}
              />
            </Suspense>
          </div>
          <div className="flex items-center gap-6 md:flex-[70%] lg:flex-[55%] md:justify-end">
            <Suspense fallback={<div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />}>
              <MemoizedSort onSort={onSort} />
            </Suspense>
          </div>
        </div>
        {/* Mobile List */}
        <div className="block md:hidden">
          <Suspense fallback={<ComponentLoader />}>
            <MemoizedTransactionListMobile data={paginatedData} />
          </Suspense>
        </div>
        {/* Table for md+ */}
        <div className="hidden md:block mb-6">
          <Suspense fallback={<ComponentLoader />}>
            <MemoizedTransactionsTable
              data={paginatedData}
              globalFilter={tableFilter}
              setGlobalFilter={setTableFilter}
            />
          </Suspense>
        </div>
        <div className="mt-6">
          <Suspense fallback={<div className="h-10 bg-gray-200 rounded animate-pulse" />}>
            <MemoizedPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
});

export default function TransactionsPage() {
  const [sortOption, setSortOption] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);

  const { data: transactionsResponse, isLoading, isFetching } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionsService.getTransactions(),
    staleTime: 0,
  });

  const transactions = useMemo(() => 
    transactionsResponse?.data || [], 
    [transactionsResponse]
  );

  const { paginatedData, totalPages } = useTransactionProcessing(
    transactions,
    sortOption,
    currentPage
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSort = useCallback((option: string) => {
    setSortOption(option);
    setCurrentPage(1); // Reset to first page when sorting changes
  }, []);

  const handleAddTransaction = useCallback(() => {
    setIsAddTransactionModalOpen(true);
  }, []);

  return (
    <>
      <div className="w-[95%] md:w-[90%] mx-auto">
        <PageHeader onAddTransaction={handleAddTransaction} />
        {isLoading || isFetching ? <LoadingSkeleton /> :
          transactions.length === 0 ? <EmptyState /> : 
          <TransactionList
            paginatedData={paginatedData}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onSort={handleSort}
          />
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