import { COLOR_TAG_OPTIONS } from "@/data/budget";
import { SelectInput, TextInput } from "../input";
import Modal from "../modal";
import { useState } from "react";
import { PrimaryButton } from "../button";

export default function AddPotModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  }) {
  const [formData, setFormData] = useState({
    potName: "",
    target: "",
    colorTag: COLOR_TAG_OPTIONS[0].value,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // Bubble up an event to inform parent component to refetch pots
    const event = new CustomEvent("fetchPots");
    document.dispatchEvent(event);
    setIsOpen(false);
  }

  return (
    <Modal
      title="Add New Pot"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div>
        <p className="text-sm text-grey-500 mb-6">
          Create a new pot to track your savings.
          <br />
          Set a limit for each pot and we&apos;ll help you
          stay on track with your financial goals.
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextInput
            label="Pot Name"
            name="pot-name"
            placeholder="Enter pot name"
            value={formData.potName}
            onChange={(e) => setFormData({ ...formData, potName: e.target.value })}
          />
          <TextInput
            label="Target"
            name="target"
            placeholder="e.g. 2000"
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
            type="number"
            withPrefix
            prefix="₦"
          />
          <SelectInput
            label="Color Tag"
            name="color-tag"
            options={COLOR_TAG_OPTIONS}
            value={formData.colorTag}
            onChange={(e) => setFormData({ ...formData, colorTag: e.target.value })}
            withColorTag
          />
          <div className="w-full">
            <PrimaryButton
              label="Add Pot"
              type="submit"
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}