import { ITransaction } from "./transactions";

export interface IBudget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  color: string;
  transactions: ITransaction[];
}