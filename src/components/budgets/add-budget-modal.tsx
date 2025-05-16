"use client";
import Modal from "@/components/modal";
import { SelectInput, TextInput } from "../input";
import { useState } from "react";
import { COLOR_TAG_OPTIONS, BUDGET_CATEGORY_OPTIONS } from "@/data/budget";
import PrimaryButton from "../button/primary-btn";


export default function AddBudgetModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  }) {
  const [formData, setFormData] = useState({
    budgetCategory: BUDGET_CATEGORY_OPTIONS[0].label,
    maximumSpending: "",
    colorTag: COLOR_TAG_OPTIONS[0].label,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Adding budget...", formData);
    setIsOpen(false);
    // Bubble up an event to inform parent component to refetch budgets
    const event = new CustomEvent("fetchBudgets");
    document.dispatchEvent(event);
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
        <form className="flex flex-col gap-4 mt-5" onSubmit={handleSubmit}>
          <SelectInput
            label="Budget Category"
            name="category"
            options={BUDGET_CATEGORY_OPTIONS.map((option) => option.label)}
            value={formData.budgetCategory}
            onChange={(value) => setFormData({ ...formData, budgetCategory: value })}
          />
          <TextInput
            label="Maximum Spending"
            type="number"
            name="maximum-spending"
            withPrefix
            prefix="₦"
            placeholder="e.g. 2000"
            value={formData.maximumSpending}
            onChange={(e) => setFormData({ ...formData, maximumSpending: e.target.value })}
            required
          />
          <SelectInput
            label="Color Tag"
            name="color-tag"
            options={COLOR_TAG_OPTIONS.map((option) => option.label)}
            value={formData.colorTag}
            onChange={(value) => setFormData({ ...formData, colorTag: value })}
            withColorTag
          />
          <PrimaryButton
            label="Add Budget"
            type="submit"
          />
        </form>

      </div>
    </Modal>
  )
}