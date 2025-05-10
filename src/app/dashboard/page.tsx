"use client"

import BudgetsSummary from "@/components/budgets-summary"
import OverviewSummary from "@/components/overview-summary"
import PotsSummary from "@/components/pots-summary"
import TransactionsSummary from "@/components/transactions-summary"
import RecurringBillsSummary from "@/components/recurring-bills-summary"


export default function Dashboard() {
  return (
    <div
      className="w-[95%] md:w-[90%] mx-auto"
    >
      <h1 className="text-xl font-semibold">Overview</h1>
      <div className="my-8">
        <OverviewSummary/>
      </div>
      <div className="flex flex-col gap-8">
        <PotsSummary/>
        <TransactionsSummary />
        <BudgetsSummary />
        <RecurringBillsSummary />
      </div>
    </div>
  )
}