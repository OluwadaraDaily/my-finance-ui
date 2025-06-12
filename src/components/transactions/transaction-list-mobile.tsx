import Image from "next/image";
import { Transaction } from "@/lib/api/services/transactions/types";
import { formatCurrency } from "@/utils/format";

export default function TransactionListMobile({ data }: { data: Transaction[] }) {
  return (
    <ul className="divide-y divide-grey-100">
      {data.map((transaction: Transaction, index: number) => (
        <li key={transaction.id + transaction.transaction_date.toString() + index} className="flex items-center justify-between py-5">
          <div className="flex items-center gap-4">
            <Image
              src={'/icons/transactions.svg'}
              alt={transaction.description}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <div className="font-bold text-base text-grey-900">{transaction.recipient}</div>
              <div className="text-xs text-grey-500 font-normal mt-1">{transaction.description}</div>
            </div>
          </div>
          <div className="flex flex-col items-end min-w-[100px]">
            <span className={`font-bold text-base ${transaction.amount < 0 ? 'text-grey-900' : 'text-app-green'}`}>
              {transaction.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
            </span>
            <span className="text-xs text-grey-500 font-normal mt-1">{transaction.transaction_date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </li>
      ))}
    </ul>
  );
} 