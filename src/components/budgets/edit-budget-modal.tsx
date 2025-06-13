"use client";
import Modal from "@/components/modal";
import { SelectInput, TextInput } from "../input";
import { useEffect, useState } from "react";
import { COLOR_TAG_OPTIONS, BUDGET_CATEGORY_OPTIONS } from "@/data/budget";
import PrimaryButton from "../button/primary-btn";
import { IBudget } from "@/types/budgets";

export default function EditBudgetModal({
  isOpen,
  setIsOpen,
  budget,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  budget: IBudget;
  }) {
  const [formData, setFormData] = useState({
    budgetCategory: budget.name,
    maximumSpending: budget.amount,
    colorTag: budget.color,
  });

  useEffect(() => {
    setFormData({
      budgetCategory: budget.name,
      maximumSpending: budget.amount,
      colorTag: budget.color,
    });
  }, [budget]);
  
  const hasChanges = () => {
    return formData.budgetCategory !== budget.name ||
           formData.maximumSpending !== budget.amount ||
           formData.colorTag !== budget.color;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hasChanges()) {
      console.log("Editing budget...", formData);
      setIsOpen(false);
      // Bubble up an event to inform parent component to refetch budgets
      const event = new CustomEvent("fetchBudgets");
      document.dispatchEvent(event);
    } else {
      setIsOpen(false);
    }
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
        <form className="flex flex-col gap-4 mt-5" onSubmit={handleSubmit}>
          <SelectInput
            label="Budget Category"
            name="category"
            options={BUDGET_CATEGORY_OPTIONS}
            value={formData.budgetCategory}
            onChange={(e) => setFormData({ ...formData, budgetCategory: e.target.value })}
          />
          <TextInput
            label="Maximum Spending"
            type="number"
            name="maximum-spending"
            withPrefix
            prefix="₦"
            placeholder="e.g. 2000"
            value={formData.maximumSpending?.toString() || ""}
            onChange={(e) => setFormData({ ...formData, maximumSpending: Number(e.target.value) })}
            required
          />
          <SelectInput
            label="Color Tag"
            name="color-tag"
            options={COLOR_TAG_OPTIONS}
            value={formData.colorTag}
            onChange={(e) => setFormData({ ...formData, colorTag: e.target.value })}
            withColorTag
          />
          <PrimaryButton
            label="Update Budget"
            type="submit"
          />
        </form>

      </div>
    </Modal>
  )
}