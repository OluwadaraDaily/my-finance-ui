import { formatCurrency } from "@/utils/format";

export default function SpendingSummaryItem({
  label,
  color,
  labelAmount,
  totalAmount,
  showDivider = true,
}: {
  label: string;
  color: string;
  labelAmount: number;
  totalAmount: number;
  showDivider?: boolean;
}) {
  return (
    <div>
      <div className="flex items-stretch">
        <div
          className="w-1 h-[21px] rounded mr-5 flex-shrink-0"
          style={{ background: color }}
        />
        <div className="flex-1 flex items-center justify-between">
          <span className="text-sm text-grey-500">{label}</span>
          <span className="flex items-center gap-2">
            <span className="font-bold text-base text-grey-900">{formatCurrency(labelAmount)}</span>
            <span className="text-xs text-grey-500">of {formatCurrency(totalAmount)}</span>
          </span>
        </div>
      </div>
      {showDivider && (
        <div className="w-full h-[1px] bg-grey-100 my-4" />
      )}
    </div>
  )
}