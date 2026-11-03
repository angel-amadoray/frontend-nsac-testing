import { useMutation } from '@tanstack/react-query'
import { identify } from '@/lib/api'

export interface IdentifyInput {
  sectorId: string
  epoch: string
  detector: number
  pixelX: number
  pixelY: number
  toleranceArcsec?: number
}

export function useIdentify() {
  return useMutation({
    mutationFn: (input: IdentifyInput) =>
      identify(
        input.sectorId,
        input.epoch,
        input.detector,
        input.pixelX,
        input.pixelY,
        input.toleranceArcsec ?? 15,
      ),
  })
}