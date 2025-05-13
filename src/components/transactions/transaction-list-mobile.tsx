import Image from "next/image";
import { ITransaction } from "@/types/transactions";
import { formatCurrency } from "@/utils/format";

export default function TransactionListMobile({ data }: { data: ITransaction[] }) {
  return (
    <ul className="divide-y divide-grey-100">
      {data.map((transaction: ITransaction, index: number) => (
        <li key={transaction.name + transaction.date + index} className="flex items-center justify-between py-5">
          <div className="flex items-center gap-4">
            <Image
              src={transaction.imageUrl}
              alt={transaction.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <div className="font-bold text-base text-grey-900">{transaction.name}</div>
              <div className="text-xs text-grey-500 font-normal mt-1">{transaction.category}</div>
            </div>
          </div>
          <div className="flex flex-col items-end min-w-[100px]">
            <span className={`font-bold text-base ${transaction.amount < 0 ? 'text-grey-900' : 'text-app-green'}`}>
              {transaction.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
            </span>
            <span className="text-xs text-grey-500 font-normal mt-1">{transaction.date}</span>
          </div>
        </li>
      ))}
    </ul>
  );
} 