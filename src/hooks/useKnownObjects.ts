import { useQuery } from '@tanstack/react-query'
import { getKnownObjects } from '@/lib/api'
import type { KnownObjectsParams } from '@/lib/types'

export function useKnownObjects(params: KnownObjectsParams, enabled = true) {
  return useQuery({
    queryKey: ['known-objects', params],
    queryFn: () => getKnownObjects(params),
    enabled,
    staleTime: 15 * 60_000, // 15 min: la lista no cambia en la sesión
    retry: 1,
  })
}