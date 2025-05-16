import { IPot } from "@/types/pots"
import Modal from "../modal"
import DestroyButton from "../button/destroy-btn"

export default function DeletePotModal({
  isOpen,
  setIsOpen,
  pot,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  pot: IPot
  }) {
  
  const handleDelete = () => {
    console.log("Deleting pot...", pot);
    // TODO: Delete the pot
    setIsOpen(false);
    // Bubble up an event to inform parent component to refetch pots
    const event = new CustomEvent("fetchPots");
    document.dispatchEvent(event);
  }

  return (
    <Modal
      title={`Delete '${pot.name}'?`}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <p className="text-sm text-grey-500 mb-5">
        Are you sure you want to delete this budget?
        This action cannot be reversed, and all the data inside it will be removed forever.
      </p>
      <div className="flex flex-col items-center gap-5">
        <div className="w-full">
          <DestroyButton
            label="Yes, Confirm Deletion"
            onClick={handleDelete}
          />
        </div>
        <button className="text-sm text-center text-grey-500" onClick={() => setIsOpen(false)}>
          No, I want to go back
        </button>
      </div>
    </Modal>
  )
}