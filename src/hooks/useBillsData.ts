import { useMemo } from "react";
import { IBillsData } from "@/types/bills";

export function useBillsData(bills: IBillsData[], search: string, sortOption: string) {
  return useMemo(() => {
    // Filter the data based on the search query
    const filteredData = bills.filter(bill => {
      const nameMatch = bill.name.toLowerCase().includes(search.toLowerCase());
      return nameMatch;
    });

    return [...filteredData].sort((a, b) => {
      switch (sortOption) {
        case "Latest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "Oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "A to Z":
          return a.name.localeCompare(b.name);
        case "Z to A":
          return b.name.localeCompare(a.name);
        case "Highest":
          return b.amount - a.amount;
        case "Lowest":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  }, [bills, sortOption, search]);
} 