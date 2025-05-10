"use client"
import { formatCurrency } from "@/utils/format";

export default function BillItem({ label, amount }: { label: string, amount: number }) {
  const COLORS = ["#277C78", "#82C9D7", "#626070", "#F2CDAC", "#C94736", "#826CB0"];
  const colorIndex = Math.abs(label.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % COLORS.length;
  const color = COLORS[colorIndex];
  
  return (
    <div className={`flex items-center justify-between py-5 px-4 bg-beige-100 rounded-xl border-l-4`} style={{ borderColor: color }}>
        <h3 className="text-sm font-medium text-grey-500">{label}</h3>
        <p className="text-sm font-bold text-grey-900">{formatCurrency(amount)}</p>
    </div>
  )
}