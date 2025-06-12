"use client"
import Image from "next/image"
import { formatCurrency } from "@/utils/format"

interface TransactionItemProps {
  imageUrl?: string;
  name?: string;
  description: string;
  transactionAmount: number;
  transactionDate: string;
  showDivider?: boolean;
}

export default function TransactionItem({
  imageUrl = '/icons/default-transaction.svg',
  name,
  description,
  transactionAmount,
  transactionDate,
  showDivider = true
}: TransactionItemProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={imageUrl}
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-medium mb-1">{name || description}</p>
            <p className="text-sm text-grey-500">{new Date(transactionDate).toLocaleDateString()}</p>
          </div>
        </div>
        <p className={`font-medium ${transactionAmount < 0 ? 'text-app-red' : 'text-green-600'}`}>
          {transactionAmount < 0 ? '-' : '+'}
          {formatCurrency(Math.abs(transactionAmount))}
        </p>
      </div>
      {showDivider && (
        <div className="absolute bottom-[-20px] left-0 w-full h-[1px] bg-grey-200" />
      )}
    </div>
  )
}