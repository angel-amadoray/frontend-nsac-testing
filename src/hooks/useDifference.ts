import { useQuery } from '@tanstack/react-query'
import { getDifference } from '@/lib/api'
import type { DifferenceParams } from '@/lib/types'

export function useDifference(params: DifferenceParams, enabled = true) {
  return useQuery({
    queryKey: ['difference', params],
    queryFn: () => getDifference(params),
    enabled,
    staleTime: 30 * 60_000,
  })
}