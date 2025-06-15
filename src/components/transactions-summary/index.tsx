"use client"

import { useRouter } from "next/navigation";
import { TertiaryButton, PrimaryButton } from "../button";
import TransactionItem from "./transaction-item";
import { AlertCircle } from "lucide-react";
import { Transaction } from "@/lib/api/services/transactions/types";
import Image from "next/image";
import { APIResponse } from "@/types/auth";
import { UseQueryResult } from "@tanstack/react-query";

interface TransactionsSummaryProps {
  data: UseQueryResult<APIResponse<Transaction[]>, Error>
}

export default function TransactionsSummary({ data }: TransactionsSummaryProps) {
  const router = useRouter();
  const { data: summaryData, isLoading, isFetching, error } = data

  if (isLoading || isFetching) {
    return (
      <div className="bg-white rounded-xl p-8 relative">
        <div className="flex items-center justify-between mb-8">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-col gap-5">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 relative">
        <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-app-red">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5" />
            <p className="font-semibold">Error</p>
          </div>
          <p className="text-sm text-app-red">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    );
  }

  const transactions = summaryData?.data

  if (!transactions?.length) {
    return (
      <div className="bg-white rounded-xl p-8 relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">Transactions</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <Image
            src="/icons/transactions.svg"
            alt=""
            width={48}
            height={48}
            className="mb-4 opacity-50"
          />
          <p className="text-grey-500 text-sm mb-4">No transactions found</p>
          <div className="lg:w-auto md:w-48 sm:w-full">
            <PrimaryButton
              label="Create Your First Transaction"
              onClick={() => router.push("/dashboard/transactions")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <TertiaryButton
          label="View All"
          onClick={() => router.push("/dashboard/transactions")}
        />
      </div>
      <div className="flex flex-col gap-5">
        {transactions.slice(0, 5).map((transaction: Transaction, index: number) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            showDivider={index === transactions.length - 1 ? false : true}
          />
        ))}
      </div>
    </div>
  );
}