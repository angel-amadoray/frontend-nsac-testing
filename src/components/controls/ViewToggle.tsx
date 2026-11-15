
import { Image, Diff } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewMode = 'composite' | 'difference'

interface ViewToggleProps {
  value: ViewMode
  onChange: (v: ViewMode) => void
}

const OPTIONS: { id: ViewMode; label: string; icon: typeof Image }[] = [
  { id: 'composite', label: 'Spectral', icon: Image },
  { id: 'difference', label: 'Difference', icon: Diff },
]

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="grid grid-cols-2 border border-[var(--sector-border)]">
      {OPTIONS.map(({ id, label, icon: Icon }, index) => {
        const active = value === id

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={active}
            className={cn(
              'flex min-h-[38px] items-center justify-center gap-2 px-3 py-2',
              'border-0 text-[11px] font-medium transition-colors duration-200',
              'focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--sector-white)]',
              index > 0 && 'border-l border-l-[var(--sector-border)]',
              active
                ? 'bg-[var(--sector-white)] text-[#080808]'
                : 'bg-transparent text-[var(--sector-muted)] hover:bg-white/[0.06] hover:text-[var(--sector-white)]',
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
