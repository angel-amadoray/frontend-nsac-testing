import { cn } from '@/lib/utils'

interface SingleEpochSelectorProps {
  epochs: string[]
  value: string
  onChange: (epoch: string) => void
  label?: string
}

export function SingleEpochSelector({
  epochs,
  value,
  onChange,
  label = 'Época',
}: SingleEpochSelectorProps) {
  return (
    <div>
      <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-secondary">
        {label}
      </label>
      <div className="flex flex-wrap gap-1">
        {epochs.map((ep) => (
          <button
            key={ep}
            onClick={() => onChange(ep)}
            className={cn(
              'rounded-md border px-3 py-1.5 font-mono text-xs transition-all',
              value === ep
                ? 'border-accent-cyan bg-accent-cyan/15 text-accent-cyan'
                : 'border-border bg-surface text-text-secondary hover:border-accent-cyan/40 hover:text-text-primary',
            )}
          >
            {ep}
          </button>
        ))}
      </div>
    </div>
  )
}

interface DualEpochSelectorProps {
  epochs: string[]
  from: string
  to: string
  onChange: (from: string, to: string) => void
}

export function DualEpochSelector({
  epochs,
  from,
  to,
  onChange,
}: DualEpochSelectorProps) {
  return (
    <div className="space-y-3">
      <SingleEpochSelector
        epochs={epochs}
        value={from}
        onChange={(ep) => onChange(ep, to)}
        label="Desde (T₁)"
      />
      <SingleEpochSelector
        epochs={epochs}
        value={to}
        onChange={(ep) => onChange(from, ep)}
        label="Hasta (T₂)"
      />
    </div>
  )
}