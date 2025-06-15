"use client"

import { formatCurrency } from "@/utils/format"
import { AlertCircle } from "lucide-react"
import { APIResponse } from "@/types/auth"
import { TransactionSummary } from "@/lib/api/services/transactions/types"
import { UseQueryResult } from "@tanstack/react-query"

interface OverviewSummaryProps {
  data: UseQueryResult<APIResponse<TransactionSummary>, Error>
}

export default function OverviewSummary({ data }: OverviewSummaryProps) {
  const { data: summaryData, isLoading, isFetching, error } = data

  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col md:flex-row md:gap-6">
        <div className="p-5 rounded-xl bg-grey-900 text-white w-full mb-3 md:mb-0">
          <div className="h-4 w-24 bg-grey-700 rounded mb-6 animate-pulse bg-white"></div>
          <div className="h-8 w-32 bg-grey-700 rounded animate-pulse bg-white"></div>
        </div>
        <div className="p-5 rounded-xl bg-white w-full mb-3 md:mb-0">
          <div className="h-4 w-24 bg-grey-200 rounded mb-6 animate-pulse bg-grey-900"></div>
          <div className="h-8 w-32 bg-grey-200 rounded animate-pulse bg-grey-900"></div>
        </div>
        <div className="p-5 rounded-xl bg-white w-full">
          <div className="h-4 w-24 bg-grey-200 rounded mb-6 animate-pulse bg-grey-900"></div>
          <div className="h-8 w-32 bg-grey-200 rounded animate-pulse bg-grey-900"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col md:flex-row md:gap-6">
        <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-app-red w-full mb-3 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5" />
            <p className="font-semibold">Error loading summary</p>
          </div>
          <p className="text-sm text-app-red">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        </div>
      </div>
    )
  }

  const summary = summaryData?.data
  
  return (
    <div className="flex flex-col md:flex-row md:gap-6">
      <div className="p-5 rounded-xl bg-grey-900 text-white w-full mb-3 md:mb-0">
        <p className="text-sm mb-3">Current Balance</p>
        <p className="text-xl font-bold">{formatCurrency(summary?.net_amount ?? 0, { maximumFractionDigits: 0, minimumFractionDigits: 0 })}</p>
      </div>
      <div className="p-5 rounded-xl bg-white w-full mb-3 md:mb-0">
        <p className="text-sm mb-3 text-grey-500">Income</p>
        <p className="text-xl font-bold">{formatCurrency(summary?.total_income ?? 0, { maximumFractionDigits: 0, minimumFractionDigits: 0 })}</p>
      </div>
      <div className="p-5 rounded-xl bg-white w-full">
        <p className="text-sm mb-3 text-grey-500">Expenses</p>
        <p className="text-xl font-bold">{formatCurrency(summary?.total_expense ?? 0, { maximumFractionDigits: 0, minimumFractionDigits: 0 })}</p>
      </div>
    </div>
  )
}