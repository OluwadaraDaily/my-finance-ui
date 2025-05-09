export default function PotItem({
  color,
  label,
  amount
}: {
  color: string
  label: string
  amount: number
}) {
  const colorMap: { [key: string]: string } = {
    'app-green': '#277C78',
    'app-cyan': '#82C9D7',
    'app-navy': '#626070',
    'app-yellow': '#F2CDAC',
    'app-red': '#C94736',
    'app-purple': '#826CB0',
    'app-purple-2': '#AF81BA',
    'app-torquoise': '#597C7C',
    'app-brown': '#93674F',
    'app-magenta': '#934F6F',
    'app-blue': '#3F82B2',
    'app-navy-grey': '#97A0AC',
    'app-army-green': '#7F9161',
    'app-gold': '#CAB361',
    'app-orange': '#BE6C49'
  }

  return (
    <div className="flex items-center gap-4 w-full">
      <div 
        className="w-1 h-full rounded-lg" 
        style={{ backgroundColor: colorMap[color] }}
      />
      <div>
        <p className="text-xs mb-1">{label}</p>
        <p className="text-sm font-bold">₦{amount}</p>
      </div>
    </div>
  )
}