import { useForm, Controller } from "react-hook-form";
import Modal from "../modal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, SelectInput, TextArea } from "../input";
import { PrimaryButton } from "../button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatFormDatesForAPI } from "@/utils/date";
import { transactionsService } from "@/lib/api/services/transactions";
import { TransactionType } from "@/lib/api/services/transactions/types";
import { toast } from "sonner";
import { budgetService } from "@/lib/api/services/budgets";
import { Budget } from "@/lib/api/services/budgets/types";


const addTransactionSchema = z.object({
  description: z.string().optional(),
  amount: z.number().min(1, "Amount is required"),
  type: z.nativeEnum(TransactionType),
  transaction_date: z.date(),
  budget_id: z.number().optional(),
  sender: z.string().optional(),
  recipient: z.string().optional(),
})

type AddTransactionFormData = z.infer<typeof addTransactionSchema>;

const AddTransactionModal = (
  { isOpen, setIsOpen }:
  { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }
) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<AddTransactionFormData>({
    resolver: zodResolver(addTransactionSchema),
    mode: "onChange",
  })

  const transactionType = watch("type");

  const { data: budgetsResponse } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => budgetService.getBudgets({}),
  })

  const budgets = budgetsResponse?.data || [];

  const { mutate: createTransaction, isPending } = useMutation({
    mutationFn: async (data: AddTransactionFormData) => {
      const apiData = formatFormDatesForAPI(data, ['transaction_date']);
      const response = await transactionsService.createTransaction(apiData);
      return response;
    },
    onSuccess: () => {
      setIsOpen(false);
      // Bubble up an event to inform parent component to refetch transactions
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction created successfully");
      reset();
    },
    onError: (error) => {
      toast.error("Failed to create transaction", {
        description: error.message || "An error occurred while creating the transaction",
      });
    },
  });

  const onSubmit = (data: AddTransactionFormData) => {
    createTransaction(data);
  };

  return (
    <Modal
      title="Add Transaction"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div>
        <p className="text-sm text-grey-500 mb-6">
          Record any financial transaction like payments, purchases, or transfers. You can add transactions to your budget or savings pot, including deposits and withdrawals.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextArea
            label="Description"
            {...register("description")}
            placeholder="Enter your description"
            error={errors.description?.message}
            rows={3}
            required={false}
          />          
          <TextInput
            label="Amount"
            type="number"
            {...register("amount", { valueAsNumber: true })}
            placeholder="Enter your amount"
            error={errors.amount?.message}
            withPrefix
            prefix="₦"
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="Type"
                options={["DEBIT", "CREDIT"]}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.type?.message}
                placeholder="Select transaction type"
              />
            )}
          />
          {transactionType === "CREDIT" && (
            <TextInput
              label="Sender"
              {...register("sender")}
              placeholder="Enter your sender"
              error={errors.sender?.message}
              required={false}
            />
          )}
          {transactionType === "DEBIT" && (
            <TextInput
              label="Recipient"
              {...register("recipient")}
              placeholder="Enter your recipient"
              error={errors.recipient?.message}
              required={false}
            />
          )}
          <TextInput
            label="Transaction Date"
            type="date"
            {...register("transaction_date", { valueAsDate: true })}
            error={errors.transaction_date?.message}
          />
          <Controller
            name="budget_id"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="Budget"
                options={Array.isArray(budgets) ? budgets.map((budget: Budget) => ({
                  label: budget.name,
                  value: budget.id.toString(),
                })) : []}
                value={field.value ? field.value.toString() : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? undefined : Number(value));
                }}
                onBlur={field.onBlur}
                error={errors.budget_id?.message}
                placeholder="Select budget"
                required={false}
              />
            )}
          />
          <PrimaryButton 
            type="submit" 
            disabled={!isValid || isPending} 
            label={isPending ? "Adding Transaction..." : "Add Transaction"} 
          />
        </form>
      </div>
    </Modal>
  )
}

export default AddTransactionModal;