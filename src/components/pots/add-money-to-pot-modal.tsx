import { formatCurrency } from "@/utils/format";
import Modal from "../modal";
import { IPot } from "@/types/pots";
import { useState, useEffect } from "react";
import { TextInput } from "../input";
import { PrimaryButton } from "../button";

export default function AddMoneyToPotModal({
  isOpen,
  setIsOpen,
  pot,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pot: IPot;
}) {
  const [amountToAdd, setAmountToAdd] = useState(0);
  const remainingAmount = pot.targetAmount - pot.savedAmount;

  useEffect(() => {
    if (isOpen) {
      setAmountToAdd(0);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("AMOUNT TO ADD =>", amountToAdd);
    setIsOpen(false);
    setAmountToAdd(0);
    // TODO: Add money to pot
    // Bubble up an event to inform parent component to refetch pots
    const event = new CustomEvent("fetchPots");
    document.dispatchEvent(event);
    setIsOpen(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    
    if (amountToAdd === remainingAmount && value >= remainingAmount) {
      return;
    }
    
    const maxAmount = Math.min(value, remainingAmount);
    setAmountToAdd(maxAmount);
  };

  return (
    <Modal
      title={`Add Money to '${pot.name}'`}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <p className="text-sm text-grey-500 mb-5">
        Add money to your pot. Enter the amount you want to add below.
        This will increase your pot&apos;s balance and help you reach your savings goal faster.
      </p>
      {/* Pot progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-grey-500">New Amount</p>
          <p className="text-xl text-grey-900 font-semibold">{formatCurrency(pot.targetAmount)}</p>
        </div>
        <div className="w-full flex items-center gap-1 mb-3">
          <div className="h-2 bg-grey-900 rounded-tl-sm rounded-bl-sm" style={{ width: `${pot.savedAmount / pot.targetAmount * 100}%` }} />
          <div className="h-2 bg-beige-100 rounded-tr-sm rounded-br-sm" style={{ width: `${(pot.targetAmount - pot.savedAmount) / pot.targetAmount * 100}%` }}>
              <div className="h-2 bg-app-green rounded-tr-sm rounded-br-sm" style={{ width: `${amountToAdd / (pot.targetAmount - pot.savedAmount) * 100}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-app-green text-xs font-bold">
            {((amountToAdd / pot.targetAmount) * 100).toFixed(2)}%
          </p>
          <p className="text-xs text-grey-500">
            Target of {formatCurrency(pot.targetAmount)}
          </p>
        </div>
      </div>
      {/* Add money form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          label="Amount to Add"
          name="amountToAdd"
          value={amountToAdd.toString()}
          onChange={handleAmountChange}
          withPrefix
          prefix="$"
          type="number"
        />
        <div className="w-full">
          <PrimaryButton
            label="Confirm Addition"
            type="submit"
            disabled={amountToAdd <= 0}
          />
        </div>
      </form>
    </Modal>
  );
}