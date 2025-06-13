export enum TransactionType {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
}

export interface ICreateTransaction {
  description?: string;
  recipient?: string;
  amount: number;
  type: TransactionType;
  transaction_date: Date;
  meta_data?: Record<string, unknown>;
  budget_id?: number;
  pot_id?: number;
  sender?: string;
}

export interface Transaction {
  id: number;
  description: string;
  recipient: string;
  amount: number;
  type: TransactionType;
  transaction_date: Date;
  meta_data: Record<string, unknown>;
  account_id: number;
  category_id?: number;
  sender?: string;
  budget_id?: number;
  created_at: Date;
  pot_id?: number;
  updated_at: Date;
}

export interface TransactionSummary {
  total_amount: number;
  total_transactions: number;
  total_income: number;
  total_expense: number;
  net_amount: number;
}

export interface IUpdateTransaction {
  description?: string;
  recipient?: string;
  sender?: string;
  amount?: number;
  type?: TransactionType;
  transaction_date?: Date;
  category_id?: number;
  budget_id?: number;
  pot_id?: number;
  meta_data?: Record<string, unknown>;
}

export interface TransactionQueryParams {
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  start_date?: string;
  end_date?: string;
  type?: string;
  category_id?: number;
  budget_id?: number;
  min_amount?: number;
  max_amount?: number;
  recipient?: string;
  sender?: string;
}