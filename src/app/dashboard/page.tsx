"use client"

import OverviewSummary from "@/components/overview-summary"
import PotsSummary from "@/components/pots"

export default function Dashboard() {
  return (
    <div
      className="w-[95%] mx-auto md:mx-0 h-[calc(100vh-52px)] md:h-[calc(100vh-74px)] lg:h-screen"
    >
      <h1 className="text-xl text-grey-900 font-semibold">Overview</h1>
      <div className="my-8">
        <OverviewSummary/>
      </div>
      <div className="mb-8">
        <PotsSummary/>
      </div>
    </div>
  )
}