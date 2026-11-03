import { Image, Diff } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewMode = 'composite' | 'difference'

interface ViewToggleProps {
  value: ViewMode
  onChange: (v: ViewMode) => void
}

const OPTIONS: { id: ViewMode; label: string; icon: typeof Image }[] = [
  { id: 'composite', label: 'Espectral', icon: Image },
  { id: 'difference', label: 'Diferencia', icon: Diff },
]

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-lg border border-border bg-surface p-1">
      {OPTIONS.map(({ id, label, icon: Icon }) => {
        const active = value === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
              active
                ? 'bg-accent-cyan/15 text-accent-cyan shadow-sm'
                : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        )
      })}
    </div>
  )
}