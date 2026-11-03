import { useEffect, useRef, useState } from 'react'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

export interface SliderControlProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  description?: string
  debounceMs?: number
  formatValue?: (v: number) => string
  onCommit: (value: number) => void
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  description,
  debounceMs = 600,
  formatValue,
  onCommit,
}: SliderControlProps) {
  const [local, setLocal] = useState(value)
  const debounced = useDebouncedValue(local, debounceMs)
  const lastCommitted = useRef(value)

  // Sincroniza si el valor externo cambia (reset, URL externa, etc.)
  useEffect(() => {
    if (value !== lastCommitted.current) {
      setLocal(value)
      lastCommitted.current = value
    }
  }, [value])

  // Commit solo cuando el debounce "se asienta"
  useEffect(() => {
    if (debounced !== lastCommitted.current) {
      onCommit(debounced)
      lastCommitted.current = debounced
    }
  }, [debounced, onCommit])

  const display = formatValue
    ? formatValue(local)
    : `${Number.isInteger(local) ? local : local.toFixed(1)}${unit}`

  const progress = ((local - min) / (max - min)) * 100

  return (
    <div>
      <label className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-text-secondary">
        <span>{label}</span>
        <span className="tabular-nums text-text-primary">{display}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={local}
        onChange={(e) => setLocal(Number(e.target.value))}
        className="slider-nasa h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-elevated accent-accent-cyan"
        style={{
          background: `linear-gradient(to right, hsl(var(--accent-cyan)) ${progress}%, hsl(var(--surface-elevated)) ${progress}%)`,
        }}
      />
      {description && (
        <p className="mt-1.5 font-mono text-xs text-text-secondary/60">{description}</p>
      )}
    </div>
  )
}