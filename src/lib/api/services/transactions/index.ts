import api from "@/lib/api/axios";
import { APIResponse } from "@/types/auth";
import { ICreateTransaction, IUpdateTransaction, Transaction, TransactionSummary, TransactionQueryParams } from "./types";

const getTransactions = async (params?: TransactionQueryParams): Promise<APIResponse<Transaction[]>> => {
  const response = await api.get('/transactions', { params });
  return response.data;
}

const getTransactionById = async (id: number): Promise<APIResponse<Transaction>> => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
}

const createTransaction = async (transaction: ICreateTransaction): Promise<APIResponse<Transaction>> => {
  const response = await api.post('/transactions', transaction);
  return response.data;
}

const getTransactionSummary = async (): Promise<APIResponse<TransactionSummary>> => {
  const response = await api.get('/transactions/summary');
  return response.data;
}

const getTransactionsByBudgetId = async (budgetId: number): Promise<APIResponse<Transaction[]>> => {
  const response = await api.get(`/transactions/budgets/${budgetId}`);
  return response.data;
}

const getTransactionsByPotId = async (potId: number): Promise<APIResponse<Transaction[]>> => {
  const response = await api.get(`/transactions/pots/${potId}`);
  return response.data;
}

const getTransactionsByCategoryId = async (categoryId: number): Promise<APIResponse<Transaction[]>> => {
  const response = await api.get(`/transactions/categories/${categoryId}`);
  return response.data;
}

const updateTransaction = async (id: number, transaction: IUpdateTransaction): Promise<APIResponse<Transaction>> => {
  const response = await api.put(`/transactions/${id}`, transaction);
  return response.data;
}

const deleteTransaction = async (id: number): Promise<APIResponse<boolean>> => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
}

export const transactionsService = {
  getTransactions,
  getTransactionById,
  createTransaction,
  getTransactionSummary,
  getTransactionsByBudgetId,
  getTransactionsByPotId,
  getTransactionsByCategoryId,
  updateTransaction,
  deleteTransaction,
};