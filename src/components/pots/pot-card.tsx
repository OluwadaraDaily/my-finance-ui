"use client";
import { IPot } from "@/types/pots";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SecondaryButton } from "../button";
import { formatCurrency } from "@/utils/format";

export default function PotCard({ pot, onEdit, onDelete, onAddMoney, onWithdraw }: { pot: IPot, onEdit: () => void, onDelete: () => void, onAddMoney: () => void, onWithdraw: () => void }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    <div className="bg-white rounded-xl py-6">
      <div className="w-[90%] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: pot.color }} />
            <h3 className="text-lg font-semibold">{pot.name}</h3>
          </div>
          {/* Menu */}
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
                  Edit Pot
                </button>
                <div className="h-[1px] bg-grey-100 my-3" />
                <button 
                  className="text-sm font-medium text-app-red" 
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                >
                  Delete Pot
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-grey-500 text-sm">Total Saved</p>
          <p className="text-grey-900 text-xl font-bold">{formatCurrency(pot.savedAmount)}</p>
        </div>
        <div className="mb-8">
          <div className="w-full h-2 bg-beige-100 rounded-sm mb-3">
            <div className="h-2  rounded-sm"
              style={{
                width:
                  `${(pot.savedAmount / pot.targetAmount) * 100}%`,
                background: pot.color
              }} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-grey-500">
              {((pot.savedAmount / pot.targetAmount) * 100).toFixed(2)}%
            </p>
            <p className="text-xs text-grey-500">
              Target of {formatCurrency(pot.targetAmount)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <SecondaryButton
              label="+ Add Money"
              onClick={() => onAddMoney()}
            />
          </div>
          <div className="flex-1">
            <SecondaryButton
              label="Withdraw"
              onClick={() => onWithdraw()}
            />
          </div>
        </div>
      </div>
    </div>
  )
}