import { useQuery } from '@tanstack/react-query'
import { getHotspots } from '@/lib/api'

export function useHotspots() {
  return useQuery({
    queryKey: ['hotspots'],
    queryFn: getHotspots,
  })
}