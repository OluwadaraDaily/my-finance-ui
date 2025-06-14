"use client"
import { useRouter } from "next/navigation";
import { TertiaryButton, PrimaryButton } from "../button";
import Image from "next/image";
import { IPotItem } from "@/types/pots";
import PotItem from "./pot-item";
import { Pot, PotSummary } from "@/lib/api/services/pots/types";
import { formatCurrency } from "@/utils/format";
import { AlertCircle } from "lucide-react";
import { APIResponse } from "@/types/auth";

interface PotsSummaryProps {
  data?: APIResponse<PotSummary>
  isLoading: boolean
  error: Error | null
}

export default function PotsSummary({ data, isLoading, error }: PotsSummaryProps) {
  const router = useRouter();

  const transformPotToItem = (pot: Pot): IPotItem => ({
    label: pot.name,
    amount: pot.saved_amount,
    color: pot.color || '#000000'
  });

  if (isLoading) {
    return (
      <div className="py-6 px-5 bg-white rounded-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-col md:flex-row md:gap-5">
          <div className="p-4 flex items-center gap-4 bg-beige-100 rounded-xl mb-5 md:mb-0 md:flex-[45%]">
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-4 md:flex-[55%]">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="p-4 bg-grey-100 rounded-xl">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col md:flex-row md:gap-6">
        <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-app-red w-full mb-3 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5" />
            <p className="font-semibold">Error</p>
          </div>
          <p className="text-sm text-app-red">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        </div>
      </div>
    );
  }

  const potSummary = data?.data

  // If there are no pots, show the create pot button
  if (!potSummary?.pots?.length) {
    return (
      <div className="py-6 px-5 bg-white rounded-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Pots</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <Image
            src="/icons/pots.svg"
            alt=""
            width={48}
            height={48}
            className="mb-4 opacity-50"
          />
          <p className="text-grey-500 text-sm mb-4">No pots created yet</p>
          <div className="w-48">
            <PrimaryButton
              label="Create Your First Pot"
              onClick={() => router.push("/dashboard/pots")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-5 bg-white rounded-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Pots</h2>
        <div>
          <TertiaryButton
            label="See Details"
            onClick={() => router.push("/dashboard/pots")}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row lg:flex-col md:gap-5">
        <div className="py-4 px-6 flex items-center gap-4 bg-beige-100 rounded-xl mb-5 md:mb-0 md:flex-[45%] lg:w-max-content">
          <Image
            src="/icons/pots-jar.svg"
            alt=""
            width={40}
            height={40}
          />
          <div>
            <p className="text-sm text-grey-500 mb-2">Total Saved</p>
            <p className="text-xl font-bold">
              {formatCurrency(potSummary?.total_saved_amount || 0, { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:flex-[55%] auto-rows-fr">
          {potSummary?.pots?.map((pot) => (
            <PotItem
              key={pot.name}
              {...transformPotToItem(pot)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}