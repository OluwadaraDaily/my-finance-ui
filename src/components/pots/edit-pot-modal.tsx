import Modal from "../modal";
import { TextInput, SelectInput } from "../input";
import { IPot } from "@/types/pots";
import { useState, useEffect } from "react";
import { COLOR_TAG_OPTIONS } from "@/data/budget";
import PrimaryButton from "../button/primary-btn";

export default function EditPotModal({
  isOpen,
  setIsOpen,
  pot,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  pot: IPot
  }) {
  const [formData, setFormData] = useState<IPot>(pot)
  const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState<string | null>(null)

  // Update formData when pot prop changes
  useEffect(() => {
    setFormData(pot)
  }, [pot])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    console.log("Updating pot...", formData)
    // TODO: Update the pot
    setIsLoading(false)
    setIsOpen(false)
    // Bubble up an event to inform parent component to refetch pots
    const event = new CustomEvent("fetchPots");
    document.dispatchEvent(event);
  }

  return (
    <Modal
      title="Edit Pot"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <p className="text-grey-500 text-sm mb-5">
        Edit the name and target amount of your pot.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextInput
          label="Pot Name"
          name="name"
          placeholder="Enter pot name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextInput
          label="Target"
          name="target"
          placeholder="e.g. 2000"
          value={formData.targetAmount.toString()}
          onChange={(e) => setFormData({ ...formData, targetAmount: parseInt(e.target.value) })}
          type="number"
          withPrefix
          prefix="₦"
        />
        <SelectInput
          label="Color Tag"
          name="color-tag"
          options={COLOR_TAG_OPTIONS.map((option) => option.label)}
          value={COLOR_TAG_OPTIONS.find(option => option.value === formData.color)?.label || COLOR_TAG_OPTIONS[0].label}
          onChange={(value: string) => setFormData({ ...formData, color: value })}
          withColorTag
        />
        <div className="w-full">
          <PrimaryButton
            label="Update Pot"
            type="submit"
            disabled={isLoading}
          />
        </div>
      </form>
    </Modal>
  )
}