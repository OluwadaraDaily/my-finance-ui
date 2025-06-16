"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { useDashboardData } from "@/hooks/useDashboardData"
import { AlertCircle } from "lucide-react"
import { useEffect } from "react"

// Lazy load components
const OverviewSummary = dynamic(
  () => import("@/components/overview-summary"),
  {
    loading: () => <ComponentLoader className="h-32" />,
    ssr: false
  }
)

const BudgetsSummary = dynamic(
  () => import("@/components/budgets-summary"),
  {
    loading: () => <ComponentLoader className="h-[600px]" />,
    ssr: false
  }
)

const PotsSummary = dynamic(
  () => import("@/components/pots-summary"),
  {
    loading: () => <ComponentLoader className="h-[400px]" />,
    ssr: false
  }
)

const TransactionsSummary = dynamic(
  () => import("@/components/transactions-summary"),
  {
    loading: () => <ComponentLoader className="h-[400px]" />,
    ssr: false
  }
)

const RecurringBillsSummary = dynamic(
  () => import("@/components/recurring-bills-summary"),
  {
    loading: () => <ComponentLoader className="h-[400px]" />,
    ssr: false
  }
)

// Loading component with skeleton
function ComponentLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl p-8 animate-pulse ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

function ErrorState({ errors }: { errors: (Error | null)[] }) {
  const validErrors = errors.filter((error): error is Error => error !== null);
  
  if (validErrors.length === 0) return null;
  
  return (
    <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-8">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <h2 className="font-semibold text-red-700">Error Loading Dashboard Data</h2>
      </div>
      <ul className="list-disc list-inside space-y-1">
        {validErrors.map((error, index) => (
          <li key={index} className="text-sm text-red-600">
            {error.message}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Dashboard() {
  const {
    transactionSummary,
    recentTransactions,
    budgetsSummary,
    potSummary,
    isError,
    errors,
    prefetchDashboardData
  } = useDashboardData()

  // Set up prefetching when user is likely to need fresh data
  useEffect(() => {
    // Prefetch when user becomes active
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        prefetchDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [prefetchDashboardData]);

  return (
    <div className="w-[95%] md:w-[90%] lg:w-[95%] mx-auto">
      <h1 className="text-xl font-semibold">Overview</h1>
      
      {isError && <ErrorState errors={errors} />}

      <div className="my-8">
        <Suspense fallback={<ComponentLoader className="h-32" />}>
          <OverviewSummary data={transactionSummary} />
        </Suspense>
      </div>
      
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="flex flex-col gap-4 lg:flex-[50%]">
          <Suspense fallback={<ComponentLoader className="h-[400px]" />}>
            <PotsSummary data={potSummary} />
          </Suspense>
          <Suspense fallback={<ComponentLoader className="h-[400px]" />}>
            <TransactionsSummary data={recentTransactions} />
          </Suspense>
        </div>
        <div className="flex flex-col gap-4 lg:flex-[50%]">
          <Suspense fallback={<ComponentLoader className="h-[600px]" />}>
            <BudgetsSummary data={budgetsSummary} />
          </Suspense>
          <Suspense fallback={<ComponentLoader className="h-[400px]" />}>
            <RecurringBillsSummary />
          </Suspense>
        </div>
      </div>
    </div>
  )
}