import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000, // 5 min
      gcTime: 30 * 60_000, // 30 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})