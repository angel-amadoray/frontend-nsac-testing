import { useMutation } from '@tanstack/react-query'
import { getBrightestValid } from '@/lib/api'

export interface BrightestValidInput {
  sectorId: string
  epoch: string
  obsId?: string
  visit?: number
  topN?: number
  minSnr?: number
}

export function useBrightestValid() {
  return useMutation({
    mutationFn: (input: BrightestValidInput) =>
      getBrightestValid(
        input.sectorId,
        input.epoch,
        1,
        4,
        input.obsId,
        input.visit,
        input.topN ?? 20,
        input.minSnr ?? 10,
      ),
  })
}