"use client"
import Image from "next/image"
import { formatCurrency } from "@/utils/format"

export default function TransactionItem({
  imageUrl,
  name,
  transactionAmount,
  date,
  showDivider = true
}: {
  imageUrl: string
  name: string
  transactionAmount: number
  date: string
  showDivider: boolean
}) {
  const formattedAmount = formatCurrency(Math.abs(transactionAmount))

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-[50%]">
            <Image
              src={imageUrl}
              alt={`${name}'s picture`}
              width={40}
              height={40}
            />
          </div>
          <p className="text-sm font-bold">{name}</p>
        </div>
        <div>
          <p className={`text-sm font-bold mb-2 ${transactionAmount < 0 ? 'text-grey-900' : 'text-app-green'}`}>
            {transactionAmount < 0 ? '-' : '+'}{formattedAmount}
          </p>
          <p className="text-xs text-grey-500">{date}</p>
        </div>
      </div>
      {showDivider && (
        <div className="w-full border border-grey-100"></div>
      )}
    </>
  )
}