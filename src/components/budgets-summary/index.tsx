"use client"
import { useRouter } from "next/navigation";
import { TertiaryButton } from "../button";
import { BUDGET_SUMMARY_DATA } from "./data";
import PotItem from "../pots-summary/pot-item";
import { IPotItem } from "@/types/pots";
import dynamic from "next/dynamic";
import BudgetsChartFallback from "./budget-chart-fallback";

const BudgetsChart = dynamic(
  () => import("./budgets-chart").then(mod => mod.BudgetsChart),
  {
    ssr: false,
    loading: () => <BudgetsChartFallback />
  }
);

export default function BudgetsSummary() {
  const router = useRouter();
  return (
    <div className="bg-white rounded-xl p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Budgets</h2>
        <TertiaryButton
          label="See Details"
          onClick={() => router.push("/dashboard/budgets")}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-[300px] h-[300px]">
          <BudgetsChart />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {
            BUDGET_SUMMARY_DATA.map((item: IPotItem) => (
              <PotItem
                key={item.label}
                label={item.label}
                amount={item.amount}
                color={item.color}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}