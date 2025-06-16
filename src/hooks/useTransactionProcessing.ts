import { useMemo } from "react";
import { Transaction } from "@/lib/api/services/transactions/types";

const PER_PAGE = 10;

export function useTransactionProcessing(
  transactions: Transaction[],
  sortOption: string,
  currentPage: number
) {
  // Memoize sorted data
  const processedData = useMemo(() => {
    return [...transactions].sort((a, b) => {
      switch (sortOption) {
        case "Latest":
          return new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime();
        case "Oldest":
          return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
        case "A to Z":
          return a.recipient.localeCompare(b.recipient);
        case "Z to A":
          return b.recipient.localeCompare(a.recipient);
        case "Highest":
          return b.amount - a.amount;
        case "Lowest":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  }, [sortOption, transactions]);

  // Memoize paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, currentPage]);

  const totalPages = useMemo(() => 
    Math.ceil(processedData.length / PER_PAGE),
    [processedData]
  );

  return { processedData, paginatedData, totalPages };
} 