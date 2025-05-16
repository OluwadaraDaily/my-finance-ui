import { IBudget } from "@/types/budgets";
import Modal from "../modal";
import DestroyButton from "../button/destroy-btn";

export default function DeleteBudgetModal({
  isOpen,
  setIsOpen,
  budget,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  budget: IBudget;
}) {
  const handleDelete = () => {
    console.log("Deleting budget...", budget);
    // TODO: Delete the budget
    setIsOpen(false);
    // Bubble up an event to inform parent component to refetch budgets
    const event = new CustomEvent("fetchBudgets");
    document.dispatchEvent(event);
  }

  return (
    <Modal
      title={`Delete '${budget.name}'?`}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}>
      <p className="text-sm text-grey-500 mb-5">
        Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever.
      </p>
      <div className="flex flex-col gap-4 items-center">
        <div className="w-full">
          <DestroyButton label="Yes, Confirm Deletion" onClick={handleDelete} />
        </div>
        <button className="text-sm text-center text-grey-500" onClick={() => setIsOpen(false)}>
          No, I want to go back
        </button>
      </div>
      
    </Modal>
  );
}
