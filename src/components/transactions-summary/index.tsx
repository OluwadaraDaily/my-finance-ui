import { useRouter } from "next/navigation";
import { TertiaryButton } from "../button";
import { transactions } from "./data";
import { ITransaction } from "@/types/transactions";
import TransactionItem from "./transaction-item";

export default function TransactionsSummary() {
  const router = useRouter();
  
  return (
    <div className="bg-white rounded-xl p-8">
      <div className="flex items-center justify-between  mb-8">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <TertiaryButton
          label="View All"
          onClick={() => router.push("/dashboard/transactions")}
        />
      </div>
      <div className="flex flex-col gap-5">
        {transactions.slice(0, 5).map((transaction: ITransaction, index: number) => (
          <TransactionItem
            key={`${transaction.name}${index}`}
            imageUrl={transaction.imageUrl}
            name={transaction.name}
            transactionAmount={transaction.amount}
            date={transaction.date}
            showDivider={index === 4 ? false : true}
          />
        ))}

      </div>
    </div>
  )
}