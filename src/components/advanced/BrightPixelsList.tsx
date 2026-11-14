import type { BrightPixelItem } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Flame, HelpCircle, Snowflake, Sun } from 'lucide-react'

interface BrightPixelsListProps {
  pixels: BrightPixelItem[]
  selectedRank: number | null
  onSelect: (pixel: BrightPixelItem) => void
}

const LEVELS = {
  very_hot: {
    label: 'Muy azul',
    Icon: Flame,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
  },
  hot: {
    label: 'Azulado',
    Icon: Sun,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  neutral: {
    label: 'Neutro',
    Icon: HelpCircle,
    color: 'text-text-secondary',
    bg: 'bg-surface/40',
    border: 'border-border',
  },
  cool: {
    label: 'Rojizo',
    Icon: Sun,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  very_cool: {
    label: 'Muy rojo',
    Icon: Snowflake,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
  },
} as const

type LevelKey = keyof typeof LEVELS

function levelFromRatio(ratio: number): LevelKey {
  if (ratio < 0.3) return 'very_hot'
  if (ratio < 0.7) return 'hot'
  if (ratio < 1.1) return 'neutral'
  if (ratio < 1.6) return 'cool'
  return 'very_cool'
}

export function BrightPixelsList({
  pixels,
  selectedRank,
  onSelect,
}: BrightPixelsListProps) {
  return (
    <div className="max-h-96 overflow-y-auto rounded-lg border border-border bg-background/40">
      <table className="w-full text-xs">
        <thead className="sticky top-0 z-10 bg-surface-elevated">
          <tr className="text-left font-mono text-[10px] uppercase tracking-wider text-text-secondary">
            <th className="px-2 py-2">#</th>
            <th className="px-2 py-2">Aspecto</th>
            <th className="px-2 py-2 text-right">Brillo</th>
            <th className="px-2 py-2 text-right">Contraste</th>
          </tr>
        </thead>
        <tbody>
          {pixels.map((p) => {
            const active = selectedRank === p.rank
            const meta = LEVELS[levelFromRatio(p.ratio)]
            const { Icon } = meta
            return (
              <tr
                key={p.rank}
                onClick={() => onSelect(p)}
                className={cn(
                  'cursor-pointer border-t border-border/40 transition-colors',
                  active ? 'bg-accent-cyan/15' : 'hover:bg-surface-elevated',
                )}
              >
                <td className="px-2 py-2 font-mono text-text-secondary">{p.rank}</td>
                <td className="px-2 py-2">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium',
                      meta.border,
                      meta.bg,
                      meta.color,
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {meta.label}
                  </span>
                </td>
                <td className="px-2 py-2 text-right font-mono text-text-primary">
                  {p.flux_short.toFixed(0)}
                </td>
                <td className="px-2 py-2 text-right font-mono text-text-secondary">
                  {p.ratio.toFixed(2)}×
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}