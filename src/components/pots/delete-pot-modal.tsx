import { Pot } from "@/lib/api/services/pots/types"
import Modal from "../modal"
import DestroyButton from "../button/destroy-btn"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { potsService } from "@/lib/api/services/pots"
import { toast } from "sonner"

export default function DeletePotModal({
  isOpen,
  setIsOpen,
  pot,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  pot: Pot
}) {
  const queryClient = useQueryClient()
  const { mutate: deletePot, isPending } = useMutation({
    mutationFn: async () => {
      const response = await potsService.deletePot(pot.id)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] })
      setIsOpen(false)
      toast.success("Pot deleted successfully")
    },
    onError: (error) => {
      toast.error("Failed to delete pot", {
        description: error.message || "An error occurred while deleting the pot",
      })
    },
  })

  return (
    <Modal
      title={`Delete '${pot.name}'?`}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <p className="text-sm text-grey-500 mb-5">
        Are you sure you want to delete this pot?
        This action cannot be reversed, and all the data inside it will be removed forever.
      </p>
      <div className="flex flex-col items-center gap-5">
        <div className="w-full">
          <DestroyButton
            label={isPending ? "Deleting..." : "Yes, Confirm Deletion"}
            onClick={() => deletePot()}
            disabled={isPending}
          />
        </div>
        <button 
          className="text-sm text-center text-grey-500" 
          onClick={() => setIsOpen(false)}
          disabled={isPending}
        >
          No, I want to go back
        </button>
      </div>
    </Modal>
  )
}