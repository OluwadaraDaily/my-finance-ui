import { useForm } from "react-hook-form";
import Modal from "../modal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, SelectInput } from "../input";
import { PrimaryButton } from "../button";

const addTransactionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(1, "Amount is required"),
  type: z.enum(["DEBIT", "CREDIT"]),
  transaction_date: z.string().min(1, "Transaction date is required"),
  category_id: z.number().min(1, "Category is required").optional(),
  budget_id: z.number().min(1, "Budget is required").optional(),
  pot_id: z.number().min(1, "Pot is required").optional(),
  sender: z.string().min(1, "Sender is required").optional(),
  recipient: z.string().min(1, "Recipient is required").optional(),
})

type AddTransactionFormData = z.infer<typeof addTransactionSchema>;

const AddTransactionModal = (
  { isOpen, setIsOpen }:
  { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }
) => {

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddTransactionFormData>({
    resolver: zodResolver(addTransactionSchema),
    mode: "onChange",
  })

  const onSubmit = (data: AddTransactionFormData) => {
    console.log("Form data:", data);
    // TODO: Handle form submission
    setIsOpen(false);
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
          <TextInput
            label="Description"
            type="text"
            {...register("description")}
            placeholder="Enter your description"
            error={errors.description?.message}
          />          
          <TextInput
            label="Amount"
            type="number"
            {...register("amount", { valueAsNumber: true })}
            placeholder="Enter your amount"
            error={errors.amount?.message}
          />
          <SelectInput
            label="Type"
            options={["DEBIT", "CREDIT"]}
            {...register("type")}
            error={errors.type?.message}
            placeholder="Select transaction type"
          />
          <TextInput
            label="Sender"
            {...register("sender")}
            placeholder="Enter your sender"
            error={errors.sender?.message}
          />
          <TextInput
            label="Recipient"
            {...register("recipient")}
            placeholder="Enter your recipient"
            error={errors.recipient?.message}
          />
          <TextInput
            label="Transaction Date"
            type="date"
            {...register("transaction_date")}
            error={errors.transaction_date?.message}
          />
          <SelectInput
            label="Category"
            options={["DEBIT", "CREDIT"]}
            {...register("category_id")}
            error={errors.category_id?.message}
            placeholder="Select category"
          />
          <SelectInput
            label="Budget"
            options={["DEBIT", "CREDIT"]}
            {...register("budget_id")}
            error={errors.budget_id?.message}
            placeholder="Select budget"
          />
          <SelectInput
            label="Pot"
            options={["DEBIT", "CREDIT"]}
            {...register("pot_id")}
            error={errors.pot_id?.message}
            placeholder="Select pot"
          />
          <PrimaryButton type="submit" disabled={!isValid} label="Add Transaction" />
        </form>
      </div>
    </Modal>
  )
}

export default AddTransactionModal;