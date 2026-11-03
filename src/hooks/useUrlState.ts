import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Sincroniza estado del sector con los query params.
 * Cualquier cambio usa replace:true para no ensuciar el historial.
 */
export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams()

  const get = useCallback(
    (key: string, fallback: string): string =>
      searchParams.get(key) ?? fallback,
    [searchParams],
  )

  const getNumber = useCallback(
    (key: string, fallback: number): number => {
      const raw = searchParams.get(key)
      if (raw === null) return fallback
      const n = Number(raw)
      return Number.isFinite(n) ? n : fallback
    },
    [searchParams],
  )

  const set = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      const next = new URLSearchParams(searchParams)
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === '') {
          next.delete(key)
        } else {
          next.set(key, String(value))
        }
      }
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  return { get, getNumber, set }
}