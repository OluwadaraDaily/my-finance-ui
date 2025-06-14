"use client"
import Image from "next/image"
import { formatCurrency } from "@/utils/format"
import { Transaction } from "@/lib/api/services/transactions/types";

interface TransactionItemProps {
  imageUrl?: string;
  transaction: Transaction;
  showDivider?: boolean;
}

export default function TransactionItem({
  imageUrl = '/icons/transactions.svg',
  transaction,
  showDivider = true
}: TransactionItemProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            width={48}
            height={48}
            src={imageUrl}
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-medium mb-1">{transaction.type === "CREDIT" ? transaction.sender : transaction.recipient}</p>
            <p className="text-sm text-grey-500">
              {new Date(transaction.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
        <p className={`font-bold ${transaction.type === "DEBIT" ? 'text-app-red' : 'text-app-green'}`}>
          {transaction.type === "DEBIT" ? '-' : '+'}
          {formatCurrency(Math.abs(transaction.amount))}
        </p>
      </div>
      {showDivider && (
        <div className="absolute bottom-[-20px] left-0 w-full h-[1px] bg-grey-200" />
      )}
    </div>
  )
}