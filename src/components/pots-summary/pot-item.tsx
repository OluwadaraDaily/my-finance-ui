export default function PotItem({
  color,
  label,
  amount
}: {
  color: string
  label: string
  amount: number
}) {

  return (
    <div className="flex items-center gap-4 w-full">
      <div 
        className="w-1 h-full rounded-lg" 
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="text-xs mb-1">{label}</p>
        <p className="text-sm font-bold">₦{amount}</p>
      </div>
    </div>
  )
}