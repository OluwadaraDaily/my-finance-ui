"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { useDashboardData } from "@/hooks/useDashboardData"
import { useEffect } from "react"
import { ComponentLoader } from "@/components/ui/component-loader"
import { ErrorState } from "@/components/ui/error-state"

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