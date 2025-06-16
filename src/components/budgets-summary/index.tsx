"use client"
import { useRouter } from "next/navigation";
import { TertiaryButton, PrimaryButton } from "../button";
import dynamic from "next/dynamic";
import BudgetsChartFallback from "./budget-chart-fallback";
import { BudgetSummary } from "@/lib/api/services/budgets/types";
import { Image } from "@/components/ui/image";
import { APIResponse } from "@/types/auth";
import { AlertCircle } from "lucide-react";
import { BudgetChartData, ChartBudget } from "@/types/budgets";
import { UseQueryResult } from "@tanstack/react-query";
import { memo, useCallback } from "react";
import PotItem from "../pots-summary/pot-item";
import { useBudgetData } from "@/hooks/useBudgetData";

// Lazy load chart component
const BudgetsChart = dynamic(
  () => import("./budgets-chart").then(mod => mod.BudgetsChart),
  {
    ssr: false,
    loading: () => <BudgetsChartFallback />
  }
);

interface BudgetsSummaryProps {
  data: UseQueryResult<APIResponse<BudgetSummary>, Error>
}

// Memoized loading state component
const LoadingState = memo(() => (
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
));
LoadingState.displayName = 'LoadingState';

// Memoized error state component
const ErrorState = memo(({ error }: { error: Error }) => (
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
));
ErrorState.displayName = 'ErrorState';

// Memoized empty state component
const EmptyState = memo(({ onCreateBudget }: { onCreateBudget: () => void }) => (
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
        priority
        sizes="48px"
      />
      <p className="text-grey-500 text-sm mb-4">No budgets created yet</p>
      <div className="w-auto">
        <PrimaryButton
          label="Create Your First Budget"
          onClick={onCreateBudget}
        />
      </div>
    </div>
  </div>
));
EmptyState.displayName = 'EmptyState';

// Memoized budget content component
const BudgetContent = memo(({ 
  budgets, 
  chartData, 
  onSeeDetails 
}: { 
  budgets: ChartBudget[],
  chartData: BudgetChartData,
  onSeeDetails: () => void
}) => (
  <>
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-semibold">Budgets</h2>
      <TertiaryButton
        label="See Details"
        onClick={onSeeDetails}
      />
    </div>
    <div className="flex flex-col md:flex-row gap-4 lg:flex-col lg:items-center">
      <div className="relative w-[300px] h-[300px] md:flex-[80%]">
        <BudgetsChart
          data={chartData}
          isLoading={false}
          error={null}
        />
      </div>
      <div className="grid grid-cols-2 auto-rows-fr gap-4 md:flex-[20%] md:grid-cols-1 lg:grid-cols-2 lg:gap-12">
        {budgets.slice(0, 4).map((budget: ChartBudget) => (
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
  </>
));
BudgetContent.displayName = 'BudgetContent';

export default function BudgetsSummary({ data }: BudgetsSummaryProps) {
  const router = useRouter();
  const { data: summaryData, isLoading, isFetching, error } = data;

  const processedData = useBudgetData(summaryData);
  
  const handleSeeDetails = useCallback(() => {
    router.push("/dashboard/budgets");
  }, [router]);

  const handleCreateBudget = useCallback(() => {
    router.push("/dashboard/budgets");
  }, [router]);

  if (isLoading || isFetching) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!processedData) {
    return <LoadingState />;
  }

  const { budgets, chartData } = processedData;
  if (!budgets?.length) {
    return <EmptyState onCreateBudget={handleCreateBudget} />;
  }

  return (
    <div className="bg-white rounded-xl p-8">
      <BudgetContent
        budgets={budgets}
        chartData={chartData}
        onSeeDetails={handleSeeDetails}
      />
    </div>
  );
}