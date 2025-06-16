"use client"
import { useEffect, useState } from "react";
import { PrimaryButton } from "@/components/button";
import AddPotModal from "@/components/pots/add-pot-modal";
import PotCard from "@/components/pots/pot-card";
import EditPotModal from "@/components/pots/edit-pot-modal";
import DeletePotModal from "@/components/pots/delete-pot-modal";
import AddMoneyToPotModal from "@/components/pots/add-money-to-pot-modal";
import WithdrawFromPotModal from "@/components/pots/withdraw-from-modal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { potsService } from "@/lib/api/services/pots";
import { Pot } from "@/lib/api/services/pots/types";
import { CookingPot } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

function EmptyState({ onAddPot }: { onAddPot: () => void }) {
  return (
    <div className="w-[95%] md:w-[90%] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold">Pots</h1>
      </div>
      
      <div className="bg-white rounded-xl p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-beige-100 rounded-full">
              <CookingPot className="w-12 h-12 text-gray-900" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-3">Create Your First Pot</h2>
          <p className="text-gray-600 mb-8">
            Start saving for your goals by creating pots. Each pot can represent a different 
            savings goal, helping you organize and track your money effectively.
          </p>
          <div className="flex justify-center">
            <PrimaryButton
              label="Create Pot"
              onClick={onAddPot}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PotsPage() {
  const queryClient = useQueryClient();
  const [isAddPotModalOpen, setIsAddPotModalOpen] = useState(false);
  const [isEditPotModalOpen, setIsEditPotModalOpen] = useState(false);
  const [isDeletePotModalOpen, setIsDeletePotModalOpen] = useState(false);
  const [isAddMoneyToPotModalOpen, setIsAddMoneyToPotModalOpen] = useState(false);
  const [isWithdrawFromPotModalOpen, setIsWithdrawFromPotModalOpen] = useState(false);
  const [selectedPot, setSelectedPot] = useState<Pot | null>(null);

  const { data: potsResponse, isLoading, error, isFetching } = useQuery({
    queryKey: ["pots"],
    queryFn: () => potsService.getPots(),
  });

  useEffect(() => {
    const handleFetchPots = () => {
      console.log("Fetching pots...");
      queryClient.invalidateQueries({ queryKey: ["pots"] });
    };

    document.addEventListener("fetchPots", handleFetchPots);

    return () => {
      document.removeEventListener("fetchPots", handleFetchPots);
    };
  }, [queryClient]);

  const handleEditPot = (pot: Pot) => {
    setSelectedPot(pot)
    setIsEditPotModalOpen(true)
  }

  const handleDeletePot = (pot: Pot) => {
    setSelectedPot(pot)
    setIsDeletePotModalOpen(true)
  }

  const handleAddMoneyToPot = (pot: Pot) => {
    console.log("Adding money to pot =>", pot)
    setSelectedPot(pot)
    setIsAddMoneyToPotModalOpen(true)
  }

  const handleWithdrawFromPot = (pot: Pot) => {
    console.log("Withdrawing money from pot =>", pot)
    setSelectedPot(pot)
    setIsWithdrawFromPotModalOpen(true)
  }

  if (isLoading || isFetching) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const pots = potsResponse?.data || [];

  if (pots.length === 0) {
    return (
      <>
        <EmptyState onAddPot={() => setIsAddPotModalOpen(true)} />
        <AddPotModal
          isOpen={isAddPotModalOpen}
          setIsOpen={setIsAddPotModalOpen}
        />
      </>
    );
  }

  return (
    <>
      {/* Add Pot Modal */}
      <AddPotModal
        isOpen={isAddPotModalOpen}
        setIsOpen={setIsAddPotModalOpen}
      />

      {/* Edit Pot Modal */}
      {selectedPot && (
        <EditPotModal
          isOpen={isEditPotModalOpen}
          setIsOpen={setIsEditPotModalOpen}
          pot={selectedPot}
        />
      )}

      {/* Delete Pot Modal */}
      {selectedPot && (
        <DeletePotModal
          isOpen={isDeletePotModalOpen}
          setIsOpen={setIsDeletePotModalOpen}
          pot={selectedPot}
        />
      )}

      {/* Add Money to Pot Modal */}
      {selectedPot && (
        <AddMoneyToPotModal
          isOpen={isAddMoneyToPotModalOpen}
          setIsOpen={setIsAddMoneyToPotModalOpen}
          pot={selectedPot}
        />
      )}

      {/* Withdraw Money from Pot Modal */}
      {selectedPot && (
        <WithdrawFromPotModal
          isOpen={isWithdrawFromPotModalOpen}
          setIsOpen={setIsWithdrawFromPotModalOpen}
          pot={selectedPot}
        />
      )}

      <div className="w-[95%] md:w-[90%] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold">Pots</h1>
          <div>
            <PrimaryButton
              label="+ Add New Pot"
              onClick={() => setIsAddPotModalOpen(true)}
            />
          </div>
        </div>
        {/* Pots */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-6">
          {pots.map((pot: Pot) => (
            <PotCard
              key={pot.id}
              pot={pot}
              onEdit={() => handleEditPot(pot)}
              onDelete={() => handleDeletePot(pot)}
              onAddMoney={() => handleAddMoneyToPot(pot)}
              onWithdraw={() => handleWithdrawFromPot(pot)}
            />
          ))}
        </div>
      </div>
    </>
  )
} 