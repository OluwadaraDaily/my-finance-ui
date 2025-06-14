import { useQuery } from "@tanstack/react-query";
import { budgetService } from "@/lib/api/services/budgets";
import { potsService } from "@/lib/api/services/pots";

export const useCategoriesData = () => {
  const { data: budgetsResponse } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => budgetService.getBudgets({}),
  });
  const { data: potsResponse } = useQuery({
    queryKey: ['pots'],
    queryFn: () => potsService.getPots(),
  });

  const budgets = budgetsResponse?.data ?? [];
  const pots = potsResponse?.data ?? [];
  
  // Ensure we're working with arrays before spreading
  const categories = Array.isArray(budgets) && Array.isArray(pots) 
    ? [...budgets, ...pots]
    : [];

  return { budgets, pots, categories };
}