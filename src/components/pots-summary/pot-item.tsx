import { formatCurrency } from "@/utils/format";

export default function PotItem({
  color,
  label,
  amount,
  loading = false
}: {
  color: string
  label: string
  amount: number
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-4 w-full animate-pulse">
        <div 
          className="min-w-1 h-12 rounded-lg bg-gray-300"
        />
        <div>
          <div className="h-3 w-16 bg-gray-300 rounded mb-2"/>
          <div className="h-5 w-20 bg-gray-300 rounded"/>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 w-full">
      <div 
        className="min-w-1 h-full rounded-lg" 
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="text-xs mb-1">{label}</p>
        <p className="text-sm font-bold">{formatCurrency(amount)}</p>
      </div>
    </div>
  )
}