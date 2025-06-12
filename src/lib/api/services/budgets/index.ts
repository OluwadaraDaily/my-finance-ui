import api from "@/lib/api/axios";
import { APIResponse } from "@/types/auth";
import { Budget, BudgetSummary, ICreateBudget, IUpdateBudget } from "./types";

const getBudgets = async ({skip = 0, limit = 100}: {skip?: number, limit?: number}): Promise<APIResponse<Budget[]>> => {
  const response = await api.get('/budgets', { params: { skip, limit } });
  return response.data;
}

const getBudgetById = async (id: number): Promise<APIResponse<Budget>> => {
  const response = await api.get(`/budgets/${id}`);
  return response.data;
}

const getBudgetSummary = async (): Promise<APIResponse<BudgetSummary>> => {
  const response = await api.get(`/budgets/summary`);
  return response.data;
}

const createBudget = async (budget: ICreateBudget): Promise<APIResponse<Budget>> => {
  const response = await api.post('/budgets', budget);
  return response.data;
}

const updateBudget = async (id: number, budget: IUpdateBudget): Promise<APIResponse<Budget>> => {
  const response = await api.put(`/budgets/${id}`, budget);
  return response.data;
}

const deleteBudget = async (id: number): Promise<APIResponse<boolean>> => {
  const response = await api.delete(`/budgets/${id}`);
  return response.data;
}

export const budgetService = {
  getBudgets,
  getBudgetById,
  getBudgetSummary,
  createBudget,
  updateBudget,
  deleteBudget,
}