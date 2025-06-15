"use client"

import BudgetsChartFallback from "@/components/budgets-summary/budget-chart-fallback";
import BudgetCard from "@/components/budgets/budget-card";
import SpendingSummaryItem from "@/components/budgets/spending-summary-item";
import { PrimaryButton } from "@/components/button";
import dynamic from "next/dynamic";
import { BudgetChartData } from "@/types/budgets";
import AddBudgetModal from "@/components/budgets/add-budget-modal";
import { useCallback, useEffect, useState } from "react";
import EditBudgetModal from "@/components/budgets/edit-budget-modal";
import DeleteBudgetModal from "@/components/budgets/delete-budget-modal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { budgetService } from "@/lib/api/services/budgets";
import { Budget, BudgetSummary } from "@/lib/api/services/budgets/types";
import { AlertCircle, PiggyBank } from "lucide-react";

// Adapter function to convert API BudgetSummary to BudgetChartData
const adaptBudgetSummary = (summary: BudgetSummary): BudgetChartData =>({
    total: summary.total_budget_amount,
    spent: summary.total_spent_amount,
    budgets: summary.budgets
});

const BudgetsChart = dynamic(
  () => import("@/components/budgets-summary/budgets-chart").then(mod => mod.BudgetsChart),
  {
    ssr: false,
    loading: () => <BudgetsChartFallback />
  }
);

// Loading state component
function LoadingState() {
  return (
    <div className="w-[95%] md:w-[90%] mx-auto">
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-10 w-32 bg-gray-200 rounded" />
        </div>
        
        <div className="grid md:grid-cols-[1fr_1fr] gap-8">
          {/* Left column - Donut chart */}
          <div className="bg-white rounded-xl p-6 h-[600px]">
            <div className="flex justify-center">
              <BudgetsChartFallback />
            </div>
            <div className="mt-6">
              <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
              {/* Spending summary items */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center mb-4">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Budget cards */}
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                  <div className="h-8 w-8 bg-gray-200 rounded" />
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full mb-4" />
                <div className="flex justify-between mb-6">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
                {/* Latest spending section */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-5 w-32 bg-gray-200 rounded" />
                    <div className="h-5 w-16 bg-gray-200 rounded" />
                  </div>
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="mb-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gray-200 rounded-full" />
                          <div className="h-4 w-24 bg-gray-200 rounded" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="h-4 w-16 bg-gray-200 rounded" />
                          <div className="h-3 w-20 bg-gray-200 rounded" />
                        </div>
                      </div>
                      {j !== 2 && <div className="w-full h-[1px] bg-gray-200 my-4" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Error state component
function ErrorState({ error }: { error: unknown }) {
  return (
    <div className="flex flex-col md:flex-row md:gap-6">
      <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-app-red w-full mb-3 md:mb-0">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5" />
          <p className="font-semibold">Error loading budgets</p>
        </div>
        <p className="text-sm text-app-red">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState({ onAddBudget }: { onAddBudget: () => void }) {
  return (
    <div className="w-[95%] md:w-[90%] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold">Budgets</h1>
      </div>
      
      <div className="bg-white rounded-xl p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-beige-100 rounded-full">
              <PiggyBank className="w-12 h-12 text-gray-900" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-3">Create Your First Budget</h2>
          <p className="text-gray-600 mb-8">
            Start managing your finances by creating budgets for different categories. 
            Track your spending, set limits, and achieve your financial goals.
          </p>
          <div className="flex justify-center">
            <PrimaryButton
              label="Create Budget"
              onClick={onAddBudget}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Budget summary section component
function BudgetSummarySection({ 
  budgets,
  chartData,
  isSummaryLoading,
  summaryError
}: { 
  budgets: Budget[],
  chartData: BudgetChartData | undefined,
  isSummaryLoading: boolean,
  summaryError: Error | null | undefined
}) {
  return (
    <div className="py-6 bg-white rounded-xl w-full mb-6 lg:flex-1">
      <div className="w-[90%] mx-auto">
        <div className="flex flex-col justify-center lg:flex-col lg:items-baseline md:flex-row md:items-center gap-8">
          {/* Chart */}
          <div className="w-full flex items-center justify-center md:flex-1">
            <BudgetsChart 
              data={chartData}
              isLoading={isSummaryLoading}
              error={summaryError}
            />
          </div>
          {/* Spending Summary */}
          <div className="md:flex-1 lg:w-full">
            <h3 className="text-lg font-semibold mb-6">Spending Summary</h3>
            {Array.isArray(budgets) && budgets.slice(0, 5).map((budget: Budget, index: number, slicedArray: Budget[]) => (
              <SpendingSummaryItem
                key={budget.id}
                label={budget.name}
                spentAmount={budget.spent_amount}
                totalAmount={budget.total_amount}
                color={budget.color}
                showDivider={index !== slicedArray.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Budget cards section component
function BudgetCardsSection({ 
  budgets,
  onEdit,
  onDelete 
}: { 
  budgets: Budget[],
  onEdit: (budget: Budget) => void,
  onDelete: (budget: Budget) => void
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-1">
      {budgets.map((budget: Budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          onEdit={() => onEdit(budget)}
          onDelete={() => onDelete(budget)}
        />
      ))}
    </div>
  );
}

// Main page component
export default function BudgetsPage() {
  const queryClient = useQueryClient();
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
  const [isEditBudgetModalOpen, setIsEditBudgetModalOpen] = useState(false);
  const [isDeleteBudgetModalOpen, setIsDeleteBudgetModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  
  const { 
    data: budgetsResponse, 
    isLoading: isBudgetsLoading,
    error: budgetsError 
  } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => budgetService.getBudgets({})
  });

  const { 
    data: summaryResponse,
    isLoading: isSummaryLoading,
    error: summaryError
  } = useQuery({
    queryKey: ["budget-summary"],
    queryFn: () => budgetService.getBudgetSummary()
  });

  const handleFetchBudgets = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["budgets"] });
    queryClient.invalidateQueries({ queryKey: ["budget-summary"] });
  }, [queryClient]);

  useEffect(() => {
    document.addEventListener("fetchBudgets", handleFetchBudgets);
    return () => {
      document.removeEventListener("fetchBudgets", handleFetchBudgets);
    };
  }, [handleFetchBudgets]);

  const handleEdit = (budget: Budget) => {
    setIsEditBudgetModalOpen(true);
    setSelectedBudget(budget);
  };

  const handleDelete = (budget: Budget) => {
    setIsDeleteBudgetModalOpen(true);
    setSelectedBudget(budget);
  };

  if (isBudgetsLoading) {
    return <LoadingState />;
  }

  if (budgetsError) {
    return <ErrorState error={budgetsError} />;
  }

  const budgets = (budgetsResponse?.data || []);
  const summary = summaryResponse?.data;
  const chartData = summary ? adaptBudgetSummary(summary) : undefined;

  if (budgets.length === 0) {
    return (
      <>
        <EmptyState onAddBudget={() => setIsAddBudgetModalOpen(true)} />
        <AddBudgetModal
          isOpen={isAddBudgetModalOpen}
          setIsOpen={setIsAddBudgetModalOpen}
        />
      </>
    );
  }

  return (
    <>
      {/* Modals */}
      <AddBudgetModal
        isOpen={isAddBudgetModalOpen}
        setIsOpen={setIsAddBudgetModalOpen}
      />
      {selectedBudget && (
        <EditBudgetModal
          budget={selectedBudget}
          isOpen={isEditBudgetModalOpen}
          setIsOpen={setIsEditBudgetModalOpen}
        />
      )}
      {selectedBudget && (
        <DeleteBudgetModal
          budget={selectedBudget}
          isOpen={isDeleteBudgetModalOpen}
          setIsOpen={setIsDeleteBudgetModalOpen}
        />
      )}

      <div className="w-[95%] md:w-[90%] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold">Budgets</h1>
          <div>
            <PrimaryButton
              label="+ Add New Budget"
              onClick={() => setIsAddBudgetModalOpen(true)}
            />
          </div>
        </div>

        <div className="lg:flex lg:items-start lg:gap-8">
          <BudgetSummarySection 
            budgets={budgets}
            chartData={chartData}
            isSummaryLoading={isSummaryLoading}
            summaryError={summaryError}
          />
          <BudgetCardsSection 
            budgets={budgets}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
} 