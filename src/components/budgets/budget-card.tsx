"use client";

import { Budget } from "@/lib/api/services/budgets/types";
import { Transaction } from "@/lib/api/services/transactions/types";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { TertiaryButton } from "../button";

interface LatestSpendingProps {
  transactions: Transaction[];
}

function LatestSpending({ transactions }: LatestSpendingProps) {
  if (!transactions?.length) {
    return null;
  }

  return (
    <div className="bg-beige-100 p-4 rounded-xl mt-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Latest Spending</h3>
        <TertiaryButton
          label="See All"
          onClick={() => {}}
        />
      </div>
      <div>
        {transactions.map((transaction: Transaction, index: number, arr: Transaction[]) => (
          <div key={transaction.recipient}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-xs mb-1">{transaction.recipient}</p>
              </div>
              <div>
                <p className="font-bold text-xs text-grey-900 text-right mb-1">
                  {transaction.amount < 0 ? `-${formatCurrency(Math.abs(transaction.amount))}` : formatCurrency(transaction.amount)}
                </p>
                <p className="text-grey-500 text-xs">{transaction.transaction_date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
            {index !== arr.length - 1 && (
              <div className="w-full h-[1px] bg-grey-500 opacity-[15%] my-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BudgetCard({
  budget,
  onEdit,
  onDelete,
}: {
  budget: Budget;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const spentPercentage = (budget.spent_amount / budget.total_amount) * 100;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-full bg-white rounded-lg py-6">
      <div className="w-[90%] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: budget.color }} />
            <h5 className="text-lg font-semibold">{budget.name}</h5>
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setShowMenu(!showMenu)}>
              <Image
                src="/icons/menu.svg"
                alt="Menu"
                width={16}
                height={16}
              />
            </button>
            {showMenu && (
              <div className="absolute top-full right-0 bg-white rounded-lg shadow-menu w-[134px] py-3 px-4">
                <button 
                  className="text-sm font-medium text-gray-900" 
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                >
                  Edit Budget
                </button>
                <div className="h-[1px] bg-grey-100 my-3" />
                <button 
                  className="text-sm font-medium text-app-red" 
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                >
                  Delete Budget
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-5">
          <p className="text-sm text-gray-500">
            Maximum of {formatCurrency(budget.total_amount)}
          </p>
          <div className="my-4 p-1 h-8 bg-beige-100 rounded-sm">
            <div
              className="h-full rounded-sm"
              style={{ width: `${spentPercentage}%`, backgroundColor: budget.color }}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1/2">
              <div className="w-1 h-[43px] rounded-lg" style={{ backgroundColor: budget.color }} />
              <div>
                <p className="text-xs text-gray-500 mb-1">Spent</p>
                <p className="text-sm font-bold">{formatCurrency(budget.spent_amount)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-1/2">
              <div className="w-1 h-[43px] rounded-lg bg-beige-100" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Free</p>
                <p className="text-sm font-bold">{formatCurrency(budget.total_amount - budget.spent_amount)}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Latest Spending */}
        <LatestSpending transactions={budget.transactions || []} />
      </div>
    </div>
  )
}
