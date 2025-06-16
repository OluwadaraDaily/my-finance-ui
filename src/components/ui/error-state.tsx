import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  error?: Error | null | unknown
  errors?: (Error | null)[]
  title?: string
  className?: string
}

export function ErrorState({ 
  error,
  errors,
  title = "Error Loading Data",
  className
}: ErrorStateProps) {
  // Handle both single error and error array cases
  const validErrors = errors 
    ? errors.filter((err): err is Error => err !== null)
    : error
    ? [error instanceof Error ? error : new Error(String(error))]
    : []
  
  if (validErrors.length === 0) return null
  
  return (
    <div className={cn("rounded-xl bg-red-50 border border-red-200 p-4", className)}>
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <h2 className="font-semibold text-red-700">{title}</h2>
      </div>
      <ul className="list-disc list-inside space-y-1">
        {validErrors.map((error, index) => (
          <li key={index} className="text-sm text-red-600">
            {error.message}
          </li>
        ))}
      </ul>
    </div>
  )
} 