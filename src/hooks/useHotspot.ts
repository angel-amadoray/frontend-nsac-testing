import { useQuery } from '@tanstack/react-query'
import { getHotspot } from '@/lib/api'

export function useHotspot(id: string | undefined) {
  return useQuery({
    queryKey: ['hotspot', id],
    queryFn: () => getHotspot(id!),
    enabled: Boolean(id),
  })
}