"use client"

import BudgetsSummary from "@/components/budgets-summary"
import OverviewSummary from "@/components/overview-summary"
import PotsSummary from "@/components/pots-summary"
import TransactionsSummary from "@/components/transactions-summary"
import RecurringBillsSummary from "@/components/recurring-bills-summary"
import { useDashboardData } from "@/hooks/useDashboardData"

export default function Dashboard() {
  const {
    transactionSummary,
    recentTransactions,
    budgets,
    potSummary,
  } = useDashboardData()

  return (
    <div className="w-[95%] md:w-[90%] lg:w-[95%] mx-auto">
      <h1 className="text-xl font-semibold">Overview</h1>
      <div className="my-8">
        <OverviewSummary 
          data={transactionSummary.data}
          isLoading={transactionSummary.isLoading}
          error={transactionSummary.error}
        />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="flex flex-col gap-4 lg:flex-[50%]">
          <PotsSummary 
            data={potSummary.data}
            isLoading={potSummary.isLoading}
            error={potSummary.error}
          />
          <TransactionsSummary 
            data={recentTransactions.data}
            isLoading={recentTransactions.isLoading}
            error={recentTransactions.error}
          />
        </div>
        <div className="flex flex-col gap-4 lg:flex-[50%]">
          <BudgetsSummary 
            data={budgets.data}
            isLoading={budgets.isLoading}
            error={budgets.error}
          />
          <RecurringBillsSummary />
        </div>
      </div>
    </div>
  )
}