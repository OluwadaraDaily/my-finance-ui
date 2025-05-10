import { TertiaryButton } from "../button";
import { useRouter } from "next/navigation";
import BillItem from "./bill-item";

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
    <div className="py-6 px-5 bg-white rounded-xl">
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