import { cn } from '@/lib/utils'

interface DetectorSelectorProps {
  value: number
  onChange: (det: number) => void
}

const DETECTORS = [1, 2, 3, 4, 5, 6]

export function DetectorSelector({ value, onChange }: DetectorSelectorProps) {
  return (
    <div>
      <label className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-text-secondary">
        <span>Detector</span>
        <span className="text-text-secondary/50">1–6</span>
      </label>
      <div className="grid grid-cols-6 gap-1">
        {DETECTORS.map((d) => (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={cn(
              'rounded-md border py-2 font-mono text-sm transition-all',
              value === d
                ? 'border-accent-cyan bg-accent-cyan/15 text-accent-cyan'
                : 'border-border bg-surface text-text-secondary hover:border-accent-cyan/40 hover:text-text-primary',
            )}
          >
            D{d}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-text-secondary/60">
        La disponibilidad varía según la época.
      </p>
    </div>
  )
}