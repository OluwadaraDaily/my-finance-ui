"use client"
import { useEffect, useState } from "react";
import { PrimaryButton } from "@/components/button";
import AddPotModal from "@/components/pots/add-pot-modal";
import PotCard from "@/components/pots/pot-card";
import { POTS_DATA } from "@/data/pots";
import EditPotModal from "@/components/pots/edit-pot-modal";
import { IPot } from "@/types/pots";
import DeletePotModal from "@/components/pots/delete-pot-modal";
import AddMoneyToPotModal from "@/components/pots/add-money-to-pot-modal";
import WithdrawFromPotModal from "@/components/pots/withdraw-from-modal";

export default function PotsPage() {
  const [isAddPotModalOpen, setIsAddPotModalOpen] = useState(false);
  const [isEditPotModalOpen, setIsEditPotModalOpen] = useState(false);
  const [isDeletePotModalOpen, setIsDeletePotModalOpen] = useState(false);
  const [isAddMoneyToPotModalOpen, setIsAddMoneyToPotModalOpen] = useState(false);
  const [isWithdrawFromPotModalOpen, setIsWithdrawFromPotModalOpen] = useState(false);
  const [selectedPot, setSelectedPot] = useState<IPot | null>(null);

  useEffect(() => {
    const handleFetchPots = () => {
      // TODO: Fetch pots from API
      console.log("Fetching pots...");
    };

    document.addEventListener("fetchPots", handleFetchPots);

    return () => {
      document.removeEventListener("fetchPots", handleFetchPots);
    };
  }, []);

  const handleEditPot = (pot: IPot) => {
    setSelectedPot(pot)
    setIsEditPotModalOpen(true)
  }

  const handleDeletePot = (pot: IPot) => {
    setSelectedPot(pot)
    setIsDeletePotModalOpen(true)
  }

  const handleAddMoneyToPot = (pot: IPot) => {
    console.log("Adding money to pot =>", pot)
    setSelectedPot(pot)
    setIsAddMoneyToPotModalOpen(true)
  }

  const handleWithdrawFromPot = (pot: IPot) => {
    console.log("Withdrawing money from pot =>", pot)
    setSelectedPot(pot)
    setIsWithdrawFromPotModalOpen(true)
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
          {POTS_DATA.map((pot) => (
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