"use client"

import BudgetsSummary from "@/components/budgets-summary"
import OverviewSummary from "@/components/overview-summary"
import PotsSummary from "@/components/pots-summary"
import TransactionsSummary from "@/components/transactions-summary"
import RecurringBillsSummary from "@/components/recurring-bills-summary"


export default function Dashboard() {
  return (
    <div
      className="w-[95%] md:w-[90%] lg:w-[95%] mx-auto"
    >
      <h1 className="text-xl font-semibold">Overview</h1>
      <div className="my-8">
        <OverviewSummary/>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="flex flex-col gap-4 lg:flex-[50%]">
          <PotsSummary/>
          <TransactionsSummary />
        </div>
        <div className="flex flex-col gap-4 lg:flex-[50%]">
          <BudgetsSummary />
          <RecurringBillsSummary />
        </div>
      </div>
    </div>
  )
}