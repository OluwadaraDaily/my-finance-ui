import { potsService } from "@/lib/api/services/pots";
import { transactionsService } from "@/lib/api/services/transactions";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { budgetService } from "@/lib/api/services/budgets";
import { useState, useEffect } from "react";

export function useDashboardData() {
  const queryClient = useQueryClient();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Batch all dashboard queries together
  const results = useQueries({
    queries: [
      {
        queryKey: ['transactionSummary'],
        queryFn: () => transactionsService.getTransactionSummary(),
        staleTime: 5 * 60 * 1000,
        retry: 2,
      },
      {
        queryKey: ['transactions', { skip: 0, limit: 5 }],
        queryFn: () => transactionsService.getTransactions({
          skip: 0,
          limit: 5,
          sort_by: 'transaction_date',
          sort_order: 'desc'
        }),
        staleTime: 2 * 60 * 1000,
        retry: 2,
      },
      {
        queryKey: ['budgets'],
        queryFn: () => budgetService.getBudgetSummary(),
        staleTime: 5 * 60 * 1000,
        retry: 2,
      },
      {
        queryKey: ['potSummary'],
        queryFn: () => potsService.getPotSummary(),
        staleTime: 5 * 60 * 1000,
        retry: 2,
      }
    ],
  });

  // Set initial load to false after first successful load
  useEffect(() => {
    if (results.every(result => !result.isLoading)) {
      setIsInitialLoad(false);
    }
  }, [results]);

  // Handle prefetching on hover
  const prefetchDashboardData = () => {
    queryClient.prefetchQuery({
      queryKey: ['transactionSummary'],
      queryFn: () => transactionsService.getTransactionSummary(),
    });
    queryClient.prefetchQuery({
      queryKey: ['transactions', { skip: 0, limit: 5 }],
      queryFn: () => transactionsService.getTransactions({
        skip: 0,
        limit: 5,
        sort_by: 'transaction_date',
        sort_order: 'desc'
      }),
    });
    queryClient.prefetchQuery({
      queryKey: ['budgets'],
      queryFn: () => budgetService.getBudgetSummary(),
    });
    queryClient.prefetchQuery({
      queryKey: ['potSummary'],
      queryFn: () => potsService.getPotSummary(),
    });
  };

  const [transactionSummary, recentTransactions, budgetsSummary, potSummary] = results;

  return {
    transactionSummary,
    recentTransactions,
    budgetsSummary,
    potSummary,
    isLoading: isInitialLoad && results.some(result => result.isLoading),
    isFetching: results.some(result => result.isFetching),
    isError: results.some(result => result.isError),
    errors: results.map(result => result.error).filter(Boolean),
    prefetchDashboardData,
  };
} 