import { formatCurrency } from "@/utils/format";
import Modal from "../modal";
import { Pot } from "@/lib/api/services/pots/types";
import { useEffect } from "react";
import { TextInput, TextArea } from "../input";
import { PrimaryButton } from "../button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { potsService } from "@/lib/api/services/pots";
import { toast } from "sonner";

const addMoneySchema = z.object({
  amount: z.number()
    .min(1, "Amount must be greater than 0"),
  reason: z.string()
    .min(1, "Reason is required")
    .max(200, "Reason must be less than 200 characters")
});

type AddMoneyFormData = z.infer<typeof addMoneySchema>;

export default function AddMoneyToPotModal({
  isOpen,
  setIsOpen,
  pot,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pot: Pot;
}) {
  const queryClient = useQueryClient();
  const remainingAmount = pot.target_amount - pot.saved_amount;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<AddMoneyFormData>({
    resolver: zodResolver(addMoneySchema),
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

  const { mutate: addMoney, isPending } = useMutation({
    mutationFn: async (data: AddMoneyFormData) => {
      const response = await potsService.updateSavedAmount(pot.id, {
        amount: data.amount,
        reason: data.reason
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      setIsOpen(false);
      toast.success("Money added to pot successfully");
      reset();
    },
    onError: (error) => {
      toast.error("Failed to add money to pot", {
        description: error.message || "An error occurred while adding money to the pot",
      });
    },
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    
    if (value >= remainingAmount) {
      setValue("amount", remainingAmount);
      return;
    }
    
    setValue("amount", value);
  };

  const onSubmit = (data: AddMoneyFormData) => {
    addMoney(data);
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
          <p className="text-xl text-grey-900 font-semibold">{formatCurrency(pot.target_amount)}</p>
        </div>
        <div className="w-full flex items-center gap-1 mb-3">
          <div className="h-2 bg-grey-900 rounded-tl-sm rounded-bl-sm" style={{ width: `${pot.saved_amount / pot.target_amount * 100}%` }} />
          <div className="h-2 bg-beige-100 rounded-tr-sm rounded-br-sm" style={{ width: `${(pot.target_amount - pot.saved_amount) / pot.target_amount * 100}%` }}>
              <div className="h-2 bg-app-green rounded-tr-sm rounded-br-sm" style={{ width: `${amount / (pot.target_amount - pot.saved_amount) * 100}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-app-green text-xs font-bold">
            {((amount / pot.target_amount) * 100).toFixed(2)}%
          </p>
          <p className="text-xs text-grey-500">
            Target of {formatCurrency(pot.target_amount)}
          </p>
        </div>
      </div>
      {/* Add money form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextInput
          label="Amount to Add"
          placeholder="Enter amount to add"
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
          placeholder="Enter the reason for adding money"
          {...register("reason")}
          error={errors.reason?.message}
        />
        <div className="w-full">
          <PrimaryButton
            label={isPending ? "Adding Money..." : "Confirm Addition"}
            type="submit"
            disabled={!isValid || isPending || amount <= 0}
          />
        </div>
      </form>
    </Modal>
  );
}