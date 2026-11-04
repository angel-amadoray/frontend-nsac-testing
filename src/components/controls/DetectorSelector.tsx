import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface DetectorSelectorProps {
  value: number
  onChange: (det: number) => void
  availableDetectors?: number[]
  isLoading?: boolean
}

const DETECTORS = [1, 2, 3, 4, 5, 6]

export function DetectorSelector({ 
  value, 
  onChange, 
  availableDetectors,
  isLoading 
}: DetectorSelectorProps) {
  return (
    <div>
      <label className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-text-secondary">
        <span className="flex items-center gap-2">
          Detector
          {isLoading && <Loader2 className="h-3 w-3 animate-spin text-accent-cyan" />}
        </span>
        <span className="text-text-secondary/50">1–6</span>
      </label>
      <div className="grid grid-cols-6 gap-1">
        {DETECTORS.map((d) => {
          const isAvailable = !availableDetectors || availableDetectors.includes(d)
          const isActive = value === d
          
          return (
            <button
              key={d}
              onClick={() => isAvailable && onChange(d)}
              disabled={!isAvailable}
              title={!isAvailable ? 'Detector no disponible para esta época' : `Detector ${d}`}
              className={cn(
                'rounded-md border py-2 font-mono text-sm transition-all',
                isActive && 'border-accent-cyan bg-accent-cyan/15 text-accent-cyan',
                !isActive && isAvailable && 'border-border bg-surface text-text-secondary hover:border-accent-cyan/40 hover:text-text-primary',
                !isAvailable && 'border-border/50 bg-surface/50 text-text-secondary/30 cursor-not-allowed'
              )}
            >
              D{d}
            </button>
          )
        })}
      </div>
      <p className="mt-1.5 text-xs text-text-secondary/60">
        Los detectores atenuados no tienen datos en el bucket para esta época.
      </p>
    </div>
  )
}