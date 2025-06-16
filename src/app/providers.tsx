'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from '@/context/AuthContext'

// Define custom error type for API errors
interface APIError extends Error {
  response?: {
    status?: number;
  };
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
            gcTime: 30 * 60 * 1000,   // 30 minutes - keep unused data in cache longer
            refetchOnWindowFocus: false, // Only refetch when explicitly needed
            refetchOnMount: true,
            refetchOnReconnect: true,
            retry: (failureCount, error: APIError) => {
              // Don't retry on 404s and auth errors
              if (error?.response?.status === 404 || error?.response?.status === 401 || error?.response?.status === 403) {
                return false;
              }
              return failureCount < 3;
            },
          },
          mutations: {
            retry: 1,
            // Add default error handler for mutations
            onError: (error: Error) => {
              console.error('Mutation error:', error.message);
            },
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  )
} 