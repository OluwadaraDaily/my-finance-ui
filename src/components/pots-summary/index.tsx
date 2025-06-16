"use client"
import { useRouter } from "next/navigation";
import { TertiaryButton, PrimaryButton } from "../button";
import { PotSummary, Pot } from "@/lib/api/services/pots/types";
import { Image } from "@/components/ui/image";
import { APIResponse } from "@/types/auth";
import { AlertCircle } from "lucide-react";
import { UseQueryResult } from "@tanstack/react-query";
import { memo, useMemo, useCallback } from "react";
import PotItem from "./pot-item";
import { formatCurrency } from "@/utils/format";
import { IPotItem } from "@/types/pots";

interface PotsSummaryProps {
  data: UseQueryResult<APIResponse<PotSummary>, Error>
}

// Custom hook for pots data processing
function usePotsData(summaryData?: APIResponse<PotSummary>) {
  return useMemo(() => {
    if (!summaryData?.data) return null;
    
    const summary = summaryData.data;
    return {
      pots: summary.pots.map((pot: Pot) => ({
        label: pot.name,
        amount: pot.saved_amount,
        color: pot.color || '#000000'
      })),
      totalSaved: summary.total_saved_amount
    };
  }, [summaryData]);
}

// Memoized loading state component
const LoadingState = memo(() => (
  <div className="bg-white rounded-xl p-8">
    <div className="flex items-center justify-between mb-5">
      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="flex flex-col md:flex-row md:gap-5">
      <div className="p-4 flex items-center gap-4 bg-beige-100 rounded-xl mb-5 md:mb-0 md:flex-[45%]">
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
        <div>
          <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-4 md:flex-[55%]">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg animate-pulse">
            <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
));
LoadingState.displayName = 'LoadingState';

// Memoized error state component
const ErrorState = memo(({ error }: { error: Error }) => (
  <div className="bg-white rounded-xl p-8">
    <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-app-red">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-5 h-5" />
        <p className="font-semibold">Error loading pots</p>
      </div>
      <p className="text-sm text-app-red">
        {error instanceof Error ? error.message : 'An unexpected error occurred'}
      </p>
    </div>
  </div>
));
ErrorState.displayName = 'ErrorState';

// Memoized empty state component
const EmptyState = memo(({ onCreatePot }: { onCreatePot: () => void }) => (
  <div className="bg-white rounded-xl p-8">
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
        priority
        sizes="48px"
      />
      <p className="text-grey-500 text-sm mb-4">No pots created yet</p>
      <div className="w-auto">
        <PrimaryButton
          label="Create Your First Pot"
          onClick={onCreatePot}
        />
      </div>
    </div>
  </div>
));
EmptyState.displayName = 'EmptyState';

// Memoized pots content component
const PotsContent = memo(({ 
  pots, 
  totalSaved, 
  onSeeDetails 
}: { 
  pots: IPotItem[],
  totalSaved: number,
  onSeeDetails: () => void
}) => (
  <>
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-semibold">Pots</h2>
      <TertiaryButton
        label="See Details"
        onClick={onSeeDetails}
      />
    </div>
    <div className="flex flex-col md:flex-row gap-4 lg:flex-col">
      <div className="p-4 flex items-center gap-4 bg-beige-100 rounded-xl mb-5 md:mb-0 md:flex-[45%]">
        <Image
          src="/icons/pots-active.svg"
          alt=""
          width={24}
          height={24}
          priority
          sizes="24px"
        />
        <div>
          <p className="text-sm text-grey-500 mb-1">Total Saved</p>
          <p className="text-xl font-semibold">{formatCurrency(totalSaved, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 auto-rows-fr gap-4 md:flex-[20%] md:grid-cols-1 lg:grid-cols-2 lg:gap-12">
        {pots.slice(0, 4).map((pot) => (
          <PotItem
            key={pot.label}
            label={pot.label}
            amount={pot.amount}
            color={pot.color}
            loading={false}
          />
        ))}
      </div>
    </div>
  </>
));
PotsContent.displayName = 'PotsContent';

export default function PotsSummary({ data }: PotsSummaryProps) {
  const router = useRouter();
  const { data: summaryData, isLoading, isFetching, error } = data;

  const processedData = usePotsData(summaryData);
  
  const handleSeeDetails = useCallback(() => {
    router.push("/dashboard/pots");
  }, [router]);

  const handleCreatePot = useCallback(() => {
    router.push("/dashboard/pots");
  }, [router]);

  if (isLoading || isFetching) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!processedData) {
    return <LoadingState />;
  }

  const { pots, totalSaved } = processedData;
  if (!pots?.length) {
    return <EmptyState onCreatePot={handleCreatePot} />;
  }

  return (
    <div className="bg-white rounded-xl p-8">
      <PotsContent
        pots={pots}
        totalSaved={totalSaved}
        onSeeDetails={handleSeeDetails}
      />
    </div>
  );
}