import { formatCurrency } from "@/utils/format";
import Modal from "../modal";
import { PrimaryButton } from "../button";
import { TextInput, TextArea } from "../input";
import { Pot } from "@/lib/api/services/pots/types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { potsService } from "@/lib/api/services/pots";
import { toast } from "sonner";

const withdrawSchema = z.object({
  amount: z.number()
    .min(1, "Amount must be greater than 0"),
  reason: z.string()
    .min(1, "Reason is required")
    .max(200, "Reason must be less than 200 characters")
});

type WithdrawFormData = z.infer<typeof withdrawSchema>;

export default function WithdrawFromPotModal({
  isOpen,
  setIsOpen,
  pot,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pot: Pot;
}) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<WithdrawFormData>({
    resolver: zodResolver(withdrawSchema),
    mode: "onChange",
    defaultValues: {
      amount: 0,
      reason: "",
    },
  });

  const amount = watch("amount") || 0;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const { mutate: withdrawMoney, isPending } = useMutation({
    mutationFn: async (data: WithdrawFormData) => {
      // For withdrawal, we send a negative amount
      const response = await potsService.updateSavedAmount(pot.id, {
        amount: -data.amount,
        reason: data.reason
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      setIsOpen(false);
      toast.success("Money withdrawn from pot successfully");
      reset();
    },
    onError: (error) => {
      toast.error("Failed to withdraw money from pot", {
        description: error.message || "An error occurred while withdrawing money from the pot",
      });
    },
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    
    if (value >= pot.saved_amount) {
      setValue("amount", pot.saved_amount);
      return;
    }
    
    setValue("amount", value);
  };

  const onSubmit = (data: WithdrawFormData) => {
    withdrawMoney(data);
  };

  return (
    <Modal
      title={`Withdraw Money from '${pot.name}'`}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <p className="text-sm text-grey-500 mb-5">
        Withdraw money from your pot. Enter the amount you want to withdraw below.
        This will decrease your pot&apos;s balance.
      </p>
      {/* Pot progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-grey-500">New Amount</p>
          <p className="text-xl text-grey-900 font-semibold">{formatCurrency(pot.target_amount)}</p>
        </div>
        <div className="w-full flex items-center gap-1 mb-3">
          <div className="h-2 bg-grey-900 rounded-tl-sm rounded-bl-sm" style={{ width: `${(pot.saved_amount - amount) / pot.target_amount * 100}%` }}>
          </div>
          <div className="h-2 bg-app-red rounded-tr-sm rounded-br-sm -mr-1" style={{ width: `${amount / pot.target_amount * 100}%` }}>
          </div>
          <div className="h-2 bg-beige-100 rounded-tr-sm rounded-br-sm" style={{ width: `${(pot.target_amount - pot.saved_amount) / pot.target_amount * 100}%` }}>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-app-red text-xs font-bold">
            {((amount / pot.target_amount) * 100).toFixed(2)}%
          </p>
          <p className="text-xs text-grey-500">
            Target of {formatCurrency(pot.target_amount)}
          </p>
        </div>
      </div>
      {/* Withdraw form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextInput
          label="Amount to Withdraw"
          placeholder="Enter amount to withdraw"
          type="number"
          withPrefix
          prefix="₦"
          {...register("amount", { 
            valueAsNumber: true,
            onChange: handleAmountChange 
          })}
          error={errors.amount?.message}
        />
        <TextArea
          label="Reason"
          placeholder="Enter the reason for withdrawing money"
          {...register("reason")}
          error={errors.reason?.message}
        />
        <div className="w-full">
          <PrimaryButton
            label={isPending ? "Withdrawing Money..." : "Confirm Withdrawal"}
            type="submit"
            disabled={!isValid || isPending || amount <= 0}
          />
        </div>
      </form>
    </Modal>
  );
}