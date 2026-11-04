import { useQuery } from '@tanstack/react-query'
import { getAvailableDetectors } from '@/lib/api'

export function useAvailableDetectors(sectorId: string, epoch: string) {
  return useQuery({
    queryKey: ['available-detectors', sectorId, epoch],
    queryFn: () => getAvailableDetectors(sectorId, epoch),
    enabled: Boolean(sectorId) && Boolean(epoch),
    staleTime: 10 * 60_000, // 10 min
  })
}