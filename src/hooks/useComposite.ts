import { useQuery } from '@tanstack/react-query'
import { getComposite } from '@/lib/api'
import type { CompositeParams } from '@/lib/types'

export function useComposite(params: CompositeParams, enabled = true) {
  return useQuery({
    queryKey: ['composite', params],
    queryFn: () => getComposite(params),
    enabled,
    staleTime: 30 * 60_000, // 30 min: en backend ya hay caché en disco
  })
}