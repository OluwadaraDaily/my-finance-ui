import { TertiaryButton } from "../button";
import { useRouter } from "next/navigation";
import BillItem from "./bill-item";
import { Sparkles } from "lucide-react";

const ComingSoonOverlay = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/95 backdrop-blur-[2px] rounded-xl flex items-center justify-center z-10">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span className="font-medium">Coming Soon</span>
        </div>
      </div>
    </div>
  );

export default function RecurringBillsSummary() {
  const router = useRouter();
  const bills = [
    {
      label: "Paid Bills",
      amount: 190
    },
    {
      label: "Total Upcoming",
      amount: 194.98
    },
    {
      label: "Due Soon",
      amount: 59.98
    }
  ]
  return (
    <div className="py-6 px-5 bg-white rounded-xl relative">
      <ComingSoonOverlay />
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold">Recurring Bills</h2>
        <div>
          <TertiaryButton
            label="See Details"
            onClick={() => router.push("/dashboard/bills")}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {bills.map((bill) => (
          <BillItem key={bill.label} label={bill.label} amount={bill.amount} />
        ))}
      </div>
    </div>
  )
}