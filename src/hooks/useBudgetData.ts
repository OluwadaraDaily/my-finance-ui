import { useMemo } from "react";
import { BudgetSummary } from "@/lib/api/services/budgets/types";
import { APIResponse } from "@/types/auth";
// import { BudgetChartData } from "@/types/budgets";

export function useBudgetData(summaryData?: APIResponse<BudgetSummary>) {
  return useMemo(() => {
    if (!summaryData?.data) return null;
    
    const summary = summaryData.data;
    return {
      budgets: summary.budgets,
      chartData: {
        total: summary.total_budget_amount,
        spent: summary.total_spent_amount,
        budgets: summary.budgets
      }
    };
  }, [summaryData]);
} 