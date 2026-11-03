import { Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OverlayToggleProps {
  enabled: boolean
  count: number
  isLoading: boolean
  onChange: (v: boolean) => void
}

export function OverlayToggle({ enabled, count, isLoading, onChange }: OverlayToggleProps) {
  return (
    <div>
      <label className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-text-secondary">
        <span>Asteroides conocidos</span>
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <span className="text-text-secondary/60">{count}</span>
        )}
      </label>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          'flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-all',
          enabled
            ? 'border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan'
            : 'border-border bg-surface text-text-secondary hover:border-accent-cyan/30 hover:text-text-primary',
        )}
      >
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          {enabled ? 'Overlay activo' : 'Activar overlay'}
        </span>
        <span className="font-mono text-xs">{count}</span>
      </button>
      {enabled && count === 0 && !isLoading && (
        <p className="mt-1.5 font-mono text-xs text-text-secondary/60">
          No hay asteroides conocidos en este campo.
        </p>
      )}
    </div>
  )
}