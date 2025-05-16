"use client"

import BudgetsChartFallback from "@/components/budgets-summary/budget-chart-fallback";
import BudgetCard from "@/components/budgets/budget-card";
import SpendingSummaryItem from "@/components/budgets/spending-summary-item";
import { PrimaryButton } from "@/components/button";
import dynamic from "next/dynamic";
import { BUDGET_DATA } from "@/components/budgets-summary/data";
import { IBudget } from "@/types/budgets";
import AddBudgetModal from "@/components/budgets/add-budget-modal";
import { useState, useEffect } from "react";
import { SPENDING_SUMMARY_ITEMS } from "@/data/budget";
import EditBudgetModal from "@/components/budgets/edit-budget-modal";
import DeleteBudgetModal from "@/components/budgets/delete-budget-modal";


const BudgetsChart = dynamic(
  () => import("@/components/budgets-summary/budgets-chart").then(mod => mod.BudgetsChart),
  {
    ssr: false,
    loading: () => <BudgetsChartFallback />
  }
);

export default function BudgetsPage() {
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
  const [isEditBudgetModalOpen, setIsEditBudgetModalOpen] = useState(false);
  const [isDeleteBudgetModalOpen, setIsDeleteBudgetModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<IBudget | null>(null);
  const [budgets, setBudgets] = useState<IBudget[]>(BUDGET_DATA);
  
  useEffect(() => {
    const handleFetchBudgets = () => {
      // TODO: Fetch budgets from API
      console.log("Fetching budgets...");
      setBudgets(BUDGET_DATA);
    };

    document.addEventListener("fetchBudgets", handleFetchBudgets);

    return () => {
      document.removeEventListener("fetchBudgets", handleFetchBudgets);
    };
  }, []);

  const handleEdit = (budget: IBudget) => {
    setIsEditBudgetModalOpen(true);
    setSelectedBudget(budget);
  };

  const handleDelete = (budget: IBudget) => {
    setIsDeleteBudgetModalOpen(true);
    setSelectedBudget(budget);
  };

  return (
    <>
      {/* Add Budget Modal */}
      <AddBudgetModal
        isOpen={isAddBudgetModalOpen}
        setIsOpen={setIsAddBudgetModalOpen}
      />

      {/* Edit Budget Modal */}
      {selectedBudget && (
        <EditBudgetModal
          budget={selectedBudget}
          isOpen={isEditBudgetModalOpen}
          setIsOpen={setIsEditBudgetModalOpen}
        />
      )}

      {/* Delete Budget Modal */}
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
          <PrimaryButton
            label="+ Add New Budget"
            onClick={() => setIsAddBudgetModalOpen(true)}
          />
        </div>
        <div className="lg:flex lg:items-start lg:gap-8">
          {/* Spending Summary */}
          <div className="py-6 bg-white rounded-xl w-full mb-6 lg:flex-1">
            <div className="w-[90%] mx-auto">
              <div className="flex flex-col justify-center lg:flex-col lg:items-baseline md:flex-row md:items-center gap-8">
                {/* Chart */}
                <div className="w-full flex items-center justify-center md:flex-1">
                  <BudgetsChart />
                </div>
                {/* Spending Summary */}
                <div className="md:flex-1 lg:w-full">
                  <h3 className="text-lg font-semibold mb-6">Spending Summary</h3>
                  {SPENDING_SUMMARY_ITEMS.map((item, index) => (
                    <SpendingSummaryItem
                      key={item.label} {...item}
                      showDivider={index !== SPENDING_SUMMARY_ITEMS.length - 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Budgets */}
          <div className="flex flex-col gap-4 lg:flex-1">
            {budgets.map((budget: IBudget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={() => handleEdit(budget)}
                onDelete={() => handleDelete(budget)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
} 