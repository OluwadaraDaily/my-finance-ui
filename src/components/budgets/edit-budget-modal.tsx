"use client";
import React from "react";
import Modal from "@/components/modal";
import { SelectInput, TextInput } from "../input";
import { COLOR_TAG_OPTIONS } from "@/data/budget";
import PrimaryButton from "../button/primary-btn";
import { Budget, IUpdateBudget } from "@/lib/api/services/budgets/types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { budgetService } from "@/lib/api/services/budgets";
import { toast } from "sonner";
import { formatFormDatesForAPI, formatDateForInput, parseDateFromAPI } from "@/utils/date";

const editBudgetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  total_amount: z.number().min(0, "Amount must be positive"),
  color: z.string().min(1, "Color is required"),
  start_date: z.date(),
  end_date: z.date(),
}).refine(
  (data) => {
    // Ensure end_date is not before start_date
    return data.end_date >= data.start_date;
  },
  {
    message: "End date cannot be before start date",
    path: ["end_date"], // This will show the error on the end_date field
  }
);

type EditBudgetFormData = z.infer<typeof editBudgetSchema>;

export default function EditBudgetModal({
  isOpen,
  setIsOpen,
  budget,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  budget: Budget;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<EditBudgetFormData>({
    resolver: zodResolver(editBudgetSchema),
    mode: "onChange",
    defaultValues: {
      name: budget.name,
      total_amount: budget.total_amount,
      color: budget.color,
      start_date: parseDateFromAPI(budget.start_date.toString()),
      end_date: parseDateFromAPI(budget.end_date.toString()),
    },
  });

  // Reset form when budget changes
  React.useEffect(() => {
    reset({
      name: budget.name,
      total_amount: budget.total_amount,
      color: budget.color,
      start_date: parseDateFromAPI(budget.start_date.toString()),
      end_date: parseDateFromAPI(budget.end_date.toString()),
    });
  }, [budget, reset]);

  const { mutate: updateBudget, isPending } = useMutation({
    mutationFn: async (data: EditBudgetFormData) => {
      const apiData = formatFormDatesForAPI(data, ['start_date', 'end_date']);
      const response = await budgetService.updateBudget(budget.id, apiData as IUpdateBudget);
      return response;
    },
    onSuccess: () => {
      setIsOpen(false);
      // Bubble up an event to inform parent component to refetch budgets
      const event = new CustomEvent("fetchBudgets");
      document.dispatchEvent(event);
      toast.success("Budget updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update budget", {
        description: error.message || "An error occurred while updating the budget",
      });
    },
  });

  const onSubmit = (data: EditBudgetFormData) => {
    updateBudget(data);
  };

  return (
    <Modal
      title="Edit Budget"
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
                label="Color Tag"
                options={COLOR_TAG_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.color?.message}
                withColorTag
              />
            )}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <Controller
                name="start_date"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextInput
                    label="Start Date"
                    type="date"
                    value={value ? formatDateForInput(value) : ''}
                    onChange={(e) => {
                      const date = e.target.valueAsDate;
                      if (date) {
                        onChange(date);
                      }
                    }}
                    error={errors.start_date?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex-1">
              <Controller
                name="end_date"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextInput
                    label="End Date"
                    type="date"
                    value={value ? formatDateForInput(value) : ''}
                    onChange={(e) => {
                      const date = e.target.valueAsDate;
                      if (date) {
                        onChange(date);
                      }
                    }}
                    error={errors.end_date?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <PrimaryButton
            label={isPending ? "Updating Budget..." : "Update Budget"}
            type="submit"
            disabled={!isValid || isPending}
          />
        </form>
      </div>
    </Modal>
  );
}