"use client"

import OverviewSummary from "@/components/overview-summary"
import PotsSummary from "@/components/pots-summary"
import TransactionsSummary from "@/components/transactions-summary"

export default function Dashboard() {
  return (
    <div
      className="w-[95%] mx-auto md:mx-0 h-[calc(100vh-52px)] md:h-[calc(100vh-74px)] lg:h-screen"
    >
      <h1 className="text-xl font-semibold">Overview</h1>
      <div className="my-8">
        <OverviewSummary/>
      </div>
      <div>
        <div className="mb-8">
          <PotsSummary/>
        </div>
        <div>
          <TransactionsSummary/>
        </div>
      </div>
    </div>
  )
}