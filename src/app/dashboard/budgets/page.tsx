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
import { PiggyBank } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

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
            {budgets.length > 0 && <h3 className="text-lg font-semibold mb-6">Spending Summary</h3>}
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
      {Array.isArray(budgets) && budgets.map((budget: Budget) => (
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
    isFetching,
    error: budgetsError 
  } = useQuery({
    queryKey: ["budgets", "list"],
    queryFn: () => budgetService.getBudgets({})
  });

  const { 
    data: summaryResponse,
    isLoading: isSummaryLoading,
    error: summaryError
  } = useQuery({
    queryKey: ["budgets", "summary"],
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

  if (isBudgetsLoading || isFetching) {
    return <LoadingSkeleton />;
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