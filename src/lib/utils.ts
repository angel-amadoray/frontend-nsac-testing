import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formatea RA decimal a "HH:MM:SS.S" (más legible para el usuario). */
export function formatRA(raDeg: number): string {
  const hours = raDeg / 15
  const h = Math.floor(hours)
  const m = Math.floor((hours - h) * 60)
  const s = ((hours - h) * 60 - m) * 60
  return `${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}:${s.toFixed(1).padStart(4, '0')}`
}

/** Formatea Dec decimal a "+DD° MM' SS\"". */
export function formatDec(decDeg: number): string {
  const sign = decDeg < 0 ? '−' : '+'
  const abs = Math.abs(decDeg)
  const d = Math.floor(abs)
  const m = Math.floor((abs - d) * 60)
  const s = ((abs - d) * 60 - m) * 60
  return `${sign}${d.toString().padStart(2, '0')}° ${m
    .toString()
    .padStart(2, '0')}′ ${s.toFixed(0).padStart(2, '0')}″`
}