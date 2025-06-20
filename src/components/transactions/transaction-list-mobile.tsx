import Image from "next/image";
import { Transaction } from "@/lib/api/services/transactions/types";
import { formatCurrency } from "@/utils/format";
import { parseDateFromAPI } from "@/utils/date";

export default function TransactionListMobile({ data }: { data: Transaction[] }) {
  return (
    <ul className="divide-y divide-grey-100">
      {data.map((transaction: Transaction, index: number) => (
        <li key={transaction.id + transaction.transaction_date.toString() + index} className="flex items-center justify-between py-5">
          <div className="flex items-center gap-4">
            <Image
              src={'/icons/transactions.svg'}
              alt={transaction.type === "DEBIT" ? `Recipient: ${transaction.recipient}` : `Sender: ${transaction.recipient}`}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <div className="font-bold text-base text-grey-900">
                {transaction.type === "DEBIT" ? transaction.recipient : transaction.sender}
              </div>
              <div className="text-xs text-grey-500 font-normal mt-1">{transaction.budget?.name || transaction.pot?.name || '-'}</div>
            </div>
          </div>
          <div className="flex flex-col items-end min-w-[100px]">
            <span className={`font-bold text-base ${transaction.type === "DEBIT" ? 'text-grey-900' : 'text-app-green'}`}>
              {transaction.type === "DEBIT" ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
            </span>
            <span className="text-xs text-grey-500 font-normal mt-1">{parseDateFromAPI(transaction.transaction_date.toString()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </li>
      ))}
    </ul>
  );
} 