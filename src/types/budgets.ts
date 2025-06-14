import { Transaction } from "@/lib/api/services/transactions/types";

export interface ChartBudget {
  label: string;
  amount: number;
  color: string;
}

export interface BudgetChartData {
  total: number;
  spent: number;
  budgets: ChartBudget[];
}

export interface IBudget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  color: string;
  transactions: Transaction[];
}