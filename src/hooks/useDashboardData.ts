import { potsService } from "@/lib/api/services/pots";
import { transactionsService } from "@/lib/api/services/transactions";
import { useQuery } from "@tanstack/react-query";
import { budgetService } from "@/lib/api/services/budgets";

export function useDashboardData() {
  const transactionSummary = useQuery({
    queryKey: ['transactionSummary'],
    queryFn: () => transactionsService.getTransactionSummary(),
    staleTime: 5 * 60 * 1000,
  });

  const recentTransactions = useQuery({
    queryKey: ['transactions', { skip: 0, limit: 5 }],
    queryFn: () => transactionsService.getTransactions({
      skip: 0, limit: 5, sort_by: 'transaction_date', sort_order: 'desc'
    }),
    staleTime: 2 * 60 * 1000,
  });

  const budgetsSummary = useQuery({
    queryKey: ['budgets'],
    queryFn: () => budgetService.getBudgetSummary(),
    staleTime: 5 * 60 * 1000,
  });

  const potSummary = useQuery({
    queryKey: ['potSummary'],
    queryFn: () => potsService.getPotSummary(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    transactionSummary,
    recentTransactions,
    budgetsSummary,
    potSummary,
    isLoading: transactionSummary.isLoading || recentTransactions.isLoading || budgetsSummary.isLoading || potSummary.isLoading,
  };
} 