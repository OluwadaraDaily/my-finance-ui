import { cn } from "@/lib/utils"

interface ComponentLoaderProps {
  className?: string
}

export function ComponentLoader({ className }: ComponentLoaderProps) {
  return (
    <div className={cn("bg-white rounded-xl p-8 animate-pulse", className)}>
      <div className="flex items-center justify-between mb-5">
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
} 