import { useMemo } from "react";
import { PotSummary, Pot } from "@/lib/api/services/pots/types";
import { APIResponse } from "@/types/auth";

export function usePotsData(summaryData?: APIResponse<PotSummary>) {
  return useMemo(() => {
    if (!summaryData?.data) return null;
    
    const summary = summaryData.data;
    return {
      pots: summary.pots.map((pot: Pot) => ({
        label: pot.name,
        amount: pot.saved_amount,
        color: pot.color || '#000000'
      })),
      totalSaved: summary.total_saved_amount
    };
  }, [summaryData]);
} 