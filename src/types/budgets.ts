import { Transaction } from "@/lib/api/services/transactions/types";

export interface IBudget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  color: string;
  transactions: Transaction[];
}