"use client";
import Modal from "@/components/modal";
import { SelectInput, TextInput, TextArea } from "../input";
import PrimaryButton from "../button/primary-btn";
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { COLOR_TAG_OPTIONS } from "@/data/budget";
import { formatFormDatesForAPI } from "@/utils/date";
import { useMutation } from "@tanstack/react-query";
import { budgetService } from "@/lib/api/services/budgets";

const addBudgetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  total_amount: z.number().min(0, "Amount must be positive"),
  start_date: z.date(),
  end_date: z.date(),
  color: z.string().min(1, "Color is required"),
})

type AddBudgetFormData = z.infer<typeof addBudgetSchema>;


export default function AddBudgetModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  }) {
  const { register, handleSubmit, control, formState: { errors, isValid } } = useForm<AddBudgetFormData>({
    resolver: zodResolver(addBudgetSchema),
    mode: "onChange",
  })

  const { mutate: createBudget, isPending } = useMutation({
    mutationFn: async (data: AddBudgetFormData) => {
      const apiData = formatFormDatesForAPI(data, ['start_date', 'end_date']);
      const response = await budgetService.createBudget(apiData);
      console.log("response", response);
      return response;
    },
    onSuccess: () => {
      setIsOpen(false);
      // Bubble up an event to inform parent component to refetch budgets
      const event = new CustomEvent("fetchBudgets");
      document.dispatchEvent(event);
    },
  });

  const onSubmit = (data: AddBudgetFormData) => {
    createBudget(data);
  };

  return (
    <Modal
      title="Add New Budget"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div>
        <p className="text-sm text-grey-500 mb-6">
          Create a new budget to track your spending.
          <br />
          Set a limit for each category and we&apos;ll help you
          stay on track with your financial goals.
        </p>
        {/* Budget Form */}
        <form className="flex flex-col gap-4 mt-5" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Budget Name"
            {...register("name")}
            error={errors.name?.message}
          />
          <TextArea
            label="Description"
            placeholder="Enter a brief description of your budget (optional)"
            {...register("description")}
            error={errors.description?.message}
          />
          <TextInput
            label="Maximum Spending"
            type="number"
            withPrefix
            prefix="₦"
            placeholder="e.g. 2000"
            {...register("total_amount", { valueAsNumber: true })}
            error={errors.total_amount?.message}
          />
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <SelectInput
                options={COLOR_TAG_OPTIONS}
                label="Color Tag"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.color?.message}
                withColorTag
              />
            )}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <TextInput
                label="Start Date"
                type="date"
                {...register("start_date", { valueAsDate: true })}
                error={errors.start_date?.message}
              />
            </div>
            <div className="flex-1">
              <TextInput
                label="End Date"
                type="date"
                {...register("end_date", { valueAsDate: true })}
                error={errors.end_date?.message}
              />
            </div>
          </div>
          <PrimaryButton
            label="Add Budget"
            type="submit"
            disabled={!isValid || isPending}
          />
        </form>

      </div>
    </Modal>
  )
}