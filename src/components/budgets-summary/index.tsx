"use client"
import { useRouter } from "next/navigation";
import { TertiaryButton, PrimaryButton } from "../button";
import PotItem from "../pots-summary/pot-item";
import dynamic from "next/dynamic";
import BudgetsChartFallback from "./budget-chart-fallback";
import { budgetService } from "@/lib/api/services/budgets";
import { useQuery } from "@tanstack/react-query";
import { Budget } from "@/lib/api/services/budgets/types";
import Image from "next/image";

const BudgetsChart = dynamic(
  () => import("./budgets-chart").then(mod => mod.BudgetsChart),
  {
    ssr: false,
    loading: () => <BudgetsChartFallback />
  }
);

export default function BudgetsSummary() {
  const { data, isLoading } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await budgetService.getBudgets({ limit: 4 })
      return response.data
    }
  })

  const router = useRouter();

  // If there are no budgets, show the create budget button
  if (!data?.length) {
    return (
      <div className="bg-white rounded-xl p-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Budgets</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <Image
            src="/icons/budgets.svg"
            alt=""
            width={48}
            height={48}
            className="mb-4 opacity-50"
          />
          <p className="text-grey-500 text-sm mb-4">No budgets created yet</p>
          <div className="w-auto">
            <PrimaryButton
              label="Create Your First Budget"
              onClick={() => router.push("/dashboard/budgets")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Budgets</h2>
        <TertiaryButton
          label="See Details"
          onClick={() => router.push("/dashboard/budgets")}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-[300px] h-[300px] md:flex-[80%]">
          <BudgetsChart />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 md:flex-[20%] md:grid-cols-1 md:grid-rows-4">
          {
            data?.map((item: Budget) => (
              <PotItem
                key={item.id}
                label={item.name}
                amount={item.total_amount}
                color={"#000000"}
                loading={isLoading}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}