interface LoadingSkeletonProps {
  className?: string
  itemCount?: number
  type?: 'card' | 'list' | 'table'
}

export function LoadingSkeleton({ 
  className = "",
  itemCount = 4,
  type = 'card'
}: LoadingSkeletonProps) {
  return (
    <div className={`w-[95%] md:w-[90%] mx-auto ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
      </div>

      {type === 'card' && (
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-6">
          {[...Array(itemCount)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div>
                    <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded" />
                  <div className="w-8 h-8 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full mb-4" />
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'list' && (
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-full mb-4"></div>
          {[...Array(itemCount)].map((_, i) => (
            <div key={i} className="mb-4">
              <div className="h-16 bg-gray-200 rounded-lg w-full"></div>
            </div>
          ))}
        </div>
      )}

      {type === 'table' && (
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg w-full mb-4"></div>
          {[...Array(itemCount)].map((_, i) => (
            <div key={i} className="mb-4">
              <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 