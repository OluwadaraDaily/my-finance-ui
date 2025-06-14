"use client"
import { useRouter } from "next/navigation";
import { TertiaryButton, PrimaryButton } from "../button";
import PotItem from "../pots-summary/pot-item";
import dynamic from "next/dynamic";
import BudgetsChartFallback from "./budget-chart-fallback";
import { BudgetSummary } from "@/lib/api/services/budgets/types";
import Image from "next/image";
import { APIResponse } from "@/types/auth";
import { AlertCircle } from "lucide-react";
import { BudgetChartData, ChartBudget } from "@/types/budgets";

const BudgetsChart = dynamic(
  () => import("./budgets-chart").then(mod => mod.BudgetsChart),
  {
    ssr: false,
    loading: () => <BudgetsChartFallback />
  }
);

const adaptBudgetSummary = (summary: BudgetSummary): BudgetChartData =>({
    total: summary.total_budget_amount,
    spent: summary.total_spent_amount,
    budgets: summary.budgets
});

interface BudgetsSummaryProps {
  data?: APIResponse<BudgetSummary>
  isLoading: boolean
  error: Error | null
}

export default function BudgetsSummary({ data, isLoading, error }: BudgetsSummaryProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8">
        <div className="flex items-center justify-between mb-5">
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-[300px] h-[300px] md:flex-[80%]">
            <BudgetsChartFallback />
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-4 md:flex-[20%] md:grid-cols-1 md:grid-rows-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg animate-pulse">
                <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8">
        <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-app-red">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5" />
            <p className="font-semibold">Error loading budgets</p>
          </div>
          <p className="text-sm text-app-red">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    );
  }

  const budgets = data?.data?.budgets
  const summary = data?.data;
  const chartData = summary ? adaptBudgetSummary(summary) : undefined;

  // If there are no budgets, show the create budget button
  if (!budgets?.length) {
    return (
      <div className="bg-white rounded-xl p-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Budgets</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <Image
            src="/icons/budgets.svg"
            alt=""
            width={48}
            height={48}
            className="mb-4 opacity-50"
          />
          <p className="text-grey-500 text-sm mb-4">No budgets created yet</p>
          <div className="w-auto">
            <PrimaryButton
              label="Create Your First Budget"
              onClick={() => router.push("/dashboard/budgets")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Budgets</h2>
        <TertiaryButton
          label="See Details"
          onClick={() => router.push("/dashboard/budgets")}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-[300px] h-[300px] md:flex-[80%]">
          <BudgetsChart
            data={chartData}
            isLoading={isLoading}
            error={error}
          />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 md:flex-[20%] md:grid-cols-1 md:grid-rows-4">
          {budgets.map((budget: ChartBudget) => (
            <PotItem
              key={budget.label}
              label={budget.label}
              amount={budget.amount}
              color={budget.color}
              loading={false}
            />
          ))}
        </div>
      </div>
    </div>
  )
}