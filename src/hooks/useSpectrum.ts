import { useQuery } from '@tanstack/react-query'
import { getSpectrum } from '@/lib/api'

export interface SpectrumInput {
  sectorId: string
  epoch: string
  detector: number
  pixelX: number
  pixelY: number
}

export function useSpectrum(input: SpectrumInput | null) {
  return useQuery({
    queryKey: ['spectrum', input],
    queryFn: () =>
      getSpectrum(
        input!.sectorId,
        input!.epoch,
        input!.detector,
        input!.pixelX,
        input!.pixelY,
      ),
    enabled: Boolean(input?.sectorId) && Boolean(input?.epoch),
    staleTime: 10 * 60_000,
  })
}