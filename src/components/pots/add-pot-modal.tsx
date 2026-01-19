import { COLOR_TAG_OPTIONS } from "@/data/budget";
import { SelectInput, TextInput, TextArea } from "../input";
import Modal from "../modal";
import { PrimaryButton } from "../button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { potsService } from "@/lib/api/services/pots";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const addPotSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  target_amount: z.number().min(1, "Target amount must be greater than 0"),
  color: z.string().min(1, "Color is required"),
});

type AddPotFormData = z.infer<typeof addPotSchema>;

export default function AddPotModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<AddPotFormData>({
    resolver: zodResolver(addPotSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      target_amount: 0,
      color: COLOR_TAG_OPTIONS[0].value,
    },
  });

  const { mutate: createPot, isPending } = useMutation({
    mutationFn: potsService.createPot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      setIsOpen(false);
      toast.success("Pot created successfully");
      reset();
    },
    onError: (error) => {
      toast.error("Failed to create pot", {
        description: error.message || "An error occurred while creating the pot",
      });
    },
  });

  const onSubmit = (data: AddPotFormData) => {
    createPot(data);
  };

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
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Pot Name"
            {...register("name")}
            placeholder="Enter pot name"
            error={errors.name?.message}
          />
          <TextArea
            label="Description"
            {...register("description")}
            placeholder="Enter pot description (optional)"
            error={errors.description?.message}
            required={false}
          />
          <TextInput
            label="Target Amount"
            type="number"
            {...register("target_amount", { valueAsNumber: true })}
            placeholder="e.g. 2000"
            error={errors.target_amount?.message}
            withPrefix
            prefix="₦"
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
              label={isPending ? "Creating Pot..." : "Add Pot"}
              type="submit"
              disabled={!isValid || isPending}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}