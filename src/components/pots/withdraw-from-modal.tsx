import { IPot } from "@/types/pots";
import Modal from "../modal";
import { PrimaryButton } from "../button";
import { TextInput } from "../input";
import { formatCurrency } from "@/utils/format";
import { useState, useEffect } from "react";


export default function WithdrawFromPotModal({
  isOpen,
  setIsOpen,
  pot,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pot: IPot;
}) {
  const [amountToWithdraw, setAmountToWithdraw] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setAmountToWithdraw(0);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Withdraw money from pot
    setIsOpen(false);
    setAmountToWithdraw(0);
    // TODO: Bubble up an event to inform parent component to refetch pots
    const event = new CustomEvent("fetchPots");
    document.dispatchEvent(event);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    
    if (amountToWithdraw === pot.savedAmount && value >= pot.savedAmount) {
      return;
    }
    
    const maxAmount = Math.min(value, pot.savedAmount);
    setAmountToWithdraw(maxAmount);
  };

  return (
    <Modal
      title={`Withdraw Money from '${pot.name}'`}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <p className="text-sm text-grey-500 mb-5">
        Withdraw money from your pot. Enter the amount you want to withdraw below.
        This will decrease your pot&apos;s balance and help you reach your savings goal faster.
      </p>
      {/* Pot progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-grey-500">New Amount</p>
          <p className="text-xl text-grey-900 font-semibold">{formatCurrency(pot.targetAmount)}</p>
        </div>
        <div className="w-full flex items-center gap-1 mb-3">
          <div className="h-2 bg-grey-900 rounded-tl-sm rounded-bl-sm" style={{ width: `${(pot.savedAmount - amountToWithdraw) / pot.targetAmount * 100}%` }}>
          </div>
          <div className="h-2 bg-app-red rounded-tr-sm rounded-br-sm -mr-1" style={{ width: `${amountToWithdraw / pot.targetAmount * 100}%` }}>
          </div>
          <div className="h-2 bg-beige-100 rounded-tr-sm rounded-br-sm" style={{ width: `${(pot.targetAmount - pot.savedAmount) / pot.targetAmount * 100}%` }}>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-app-red text-xs font-bold">
            {((amountToWithdraw / pot.targetAmount) * 100).toFixed(2)}%
          </p>
          <p className="text-xs text-grey-500">
            Target of {formatCurrency(pot.targetAmount)}
          </p>
        </div>
      </div>
      {/* Add money form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          label="Amount to Withdraw"
          name="amountToWithdraw"
          value={amountToWithdraw.toString()}
          onChange={handleAmountChange}
          withPrefix
          prefix="$"
          type="number"
        />
        <div className="w-full">
          <PrimaryButton
            label="Confirm Withdrawal"
            type="submit"
            disabled={amountToWithdraw <= 0}
          />
        </div>
      </form>
    </Modal>
  );
}