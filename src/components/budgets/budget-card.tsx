"use client";

import { IBudget } from "@/types/budgets";
import { Transaction, TransactionType } from "@/lib/api/services/transactions/types";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { TertiaryButton } from "../button";

const LATEST_SPENDING_DATA: Transaction[] = [
  {
    id: 1,
    recipient: 'Papa Software',
    amount: -10,
    type: TransactionType.DEBIT,
    transaction_date: new Date('16 Aug 2024'),
    description: 'Software subscription',
    meta_data: {},
    account_id: 1,
    created_at: new Date('16 Aug 2024'),
    updated_at: new Date('16 Aug 2024')
  },
  {
    id: 2, 
    recipient: 'Quebec Services',
    amount: -5,
    type: TransactionType.DEBIT,
    transaction_date: new Date('12 Aug 2024'),
    description: 'Service fee',
    meta_data: {},
    account_id: 1,
    created_at: new Date('12 Aug 2024'),
    updated_at: new Date('12 Aug 2024')
  },
  {
    id: 3,
    recipient: 'Romeo Cloud Service', 
    amount: -10,
    type: TransactionType.DEBIT,
    transaction_date: new Date('5 Aug 2024'),
    description: 'Cloud storage',
    meta_data: {},
    account_id: 1,
    created_at: new Date('5 Aug 2024'),
    updated_at: new Date('5 Aug 2024')
  }
];

export default function BudgetCard({
  budget,
  onEdit,
  onDelete,
}: {
  budget: IBudget;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const spentPercentage = (budget.spent / budget.amount) * 100;

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
        <div className="my-5">
          <p className="text-sm text-gray-500">
            Maximum of {formatCurrency(budget.amount)}
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
                <p className="text-sm font-bold">{formatCurrency(budget.spent)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-1/2">
              <div className="w-1 h-[43px] rounded-lg bg-beige-100" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Free</p>
                <p className="text-sm font-bold">{formatCurrency(budget.amount - budget.spent)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-beige-100 p-4 rounded-xl">
          {/* Latest Spending Section */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">Latest Spending</h3>
            <TertiaryButton
              label="See All"
              onClick={() => {}}
            />
          </div>
          <div>
            {LATEST_SPENDING_DATA.map((transaction: Transaction, index: number, arr: Transaction[]) => (
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
      </div>
    </div>
  )
}