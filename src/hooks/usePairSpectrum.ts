import { useMutation } from '@tanstack/react-query'
import { getPairSpectrum } from '@/lib/api'

export interface PairSpectrumInput {
  sectorId: string
  epoch: string
  raDeg: number
  decDeg: number
  obsId?: string
  visit?: number
}

export function usePairSpectrum() {
  return useMutation({
    mutationFn: (input: PairSpectrumInput) =>
      getPairSpectrum(
        input.sectorId,
        input.epoch,
        input.raDeg,
        input.decDeg,
        input.obsId,
        input.visit,
      ),
  })
}