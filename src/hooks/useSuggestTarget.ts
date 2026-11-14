import { useMutation } from '@tanstack/react-query'
import { suggestTarget } from '@/lib/api'

export interface SuggestTargetInput {
  sectorId: string
  epoch: string
  obsId?: string
  visit?: number
  minSnr?: number
}

export function useSuggestTarget() {
  return useMutation({
    mutationFn: (input: SuggestTargetInput) =>
      suggestTarget(
        input.sectorId,
        input.epoch,
        1,
        4,
        input.obsId,
        input.visit,
        input.minSnr ?? 10,
      ),
  })
}