import React from "react";
import Modal from "../modal";
import { TextInput, SelectInput, TextArea } from "../input";
import { Pot, UpdatePot } from "@/lib/api/services/pots/types";
import { COLOR_TAG_OPTIONS } from "@/data/budget";
import PrimaryButton from "../button/primary-btn";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { potsService } from "@/lib/api/services/pots";
import { toast } from "sonner";

const editPotSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  target_amount: z.number().min(1, "Target amount must be greater than 0"),
  color: z.string().min(1, "Color is required"),
});

type EditPotFormData = z.infer<typeof editPotSchema>;

export default function EditPotModal({
  isOpen,
  setIsOpen,
  pot,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pot: Pot;
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<EditPotFormData>({
    resolver: zodResolver(editPotSchema),
    mode: "onChange",
    defaultValues: {
      name: pot.name,
      description: pot.description,
      target_amount: pot.target_amount,
      color: pot.color || COLOR_TAG_OPTIONS[0].value,
    },
  });

  // Reset form when pot prop changes
  React.useEffect(() => {
    reset({
      name: pot.name,
      description: pot.description,
      target_amount: pot.target_amount,
      color: pot.color || COLOR_TAG_OPTIONS[0].value,
    });
  }, [pot, reset]);

  const { mutate: updatePot, isPending } = useMutation({
    mutationFn: async (data: EditPotFormData) => {
      const response = await potsService.updatePot(pot.id, data as UpdatePot);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      setIsOpen(false);
      toast.success("Pot updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update pot", {
        description: error.message || "An error occurred while updating the pot",
      });
    },
  });

  const onSubmit = (data: EditPotFormData) => {
    updatePot(data);
  };

  return (
    <Modal
      title="Edit Pot"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <p className="text-grey-500 text-sm mb-5">
        Edit the name and target amount of your pot.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <TextInput
          label="Pot Name"
          placeholder="Enter pot name"
          {...register("name")}
          error={errors.name?.message}
        />
        <TextArea
          label="Description"
          placeholder="Enter pot description (optional)"
          {...register("description")}
          error={errors.description?.message}
          required={false}
        />
        <TextInput
          label="Target"
          placeholder="e.g. 2000"
          type="number"
          withPrefix
          prefix="₦"
          {...register("target_amount", { valueAsNumber: true })}
          error={errors.target_amount?.message}
        />
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Color Tag"
              options={COLOR_TAG_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.color?.message}
              withColorTag
            />
          )}
        />
        <div className="w-full">
          <PrimaryButton
            label={isPending ? "Updating Pot..." : "Update Pot"}
            type="submit"
            disabled={!isValid || isPending}
          />
        </div>
      </form>
    </Modal>
  );
}