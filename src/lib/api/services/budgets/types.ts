import { ChartBudget } from "@/types/budgets";
import { Transaction } from "../transactions/types";

export interface Budget {
  name: string;
  description?: string;
  category_id: number;
  start_date: Date;
  end_date: Date;
  id: number;
  user_id: number;
  total_amount: number;
  spent_amount: number;
  remaining_amount: number;
  color: string;
  is_active: boolean;
  is_deleted: boolean;
  transactions?: Transaction[];
  created_at: Date;
  updated_at: Date;
}

export interface ICreateBudget {
  name: string;
  description?: string;
  total_amount: number;
  category_id?: number;
  start_date: Date;
  end_date: Date;
  color: string;
}

export interface IUpdateBudget {
  name?: string;
  description?: string;
  total_amount?: number;
  category_id?: number;
  start_date?: Date;
  end_date?: Date;
  is_active?: boolean;
  color?: string;
}

export interface BudgetSummary {
  total_spent_amount: number;
  total_remaining_amount: number;
  total_budget_amount: number;
  budgets: ChartBudget[];
}