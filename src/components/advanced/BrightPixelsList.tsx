import type { BrightPixelItem } from '@/lib/types'
import { cn } from '@/lib/utils'

interface BrightPixelsListProps {
  pixels: BrightPixelItem[]
  selectedRank: number | null
  onSelect: (pixel: BrightPixelItem) => void
}

export function BrightPixelsList({
  pixels,
  selectedRank,
  onSelect,
}: BrightPixelsListProps) {
  return (
    <div className="max-h-80 overflow-y-auto rounded-lg border border-border bg-background/40">
      <table className="w-full font-mono text-xs">
        <thead className="sticky top-0 bg-surface-elevated text-text-secondary">
          <tr>
            <th className="px-2 py-1.5 text-left">#</th>
            <th className="px-2 py-1.5 text-right">RA</th>
            <th className="px-2 py-1.5 text-right">Dec</th>
            <th className="px-2 py-1.5 text-right">F_s</th>
            <th className="px-2 py-1.5 text-right">F_l</th>
            <th className="px-2 py-1.5 text-right">Ratio</th>
          </tr>
        </thead>
        <tbody>
          {pixels.map((p) => {
            const active = selectedRank === p.rank
            return (
              <tr
                key={p.rank}
                onClick={() => onSelect(p)}
                className={cn(
                  'cursor-pointer border-t border-border/40 transition-colors',
                  active
                    ? 'bg-accent-cyan/15 text-accent-cyan'
                    : 'hover:bg-surface-elevated',
                )}
              >
                <td className="px-2 py-1.5">{p.rank}</td>
                <td className="px-2 py-1.5 text-right">{p.ra_deg.toFixed(3)}</td>
                <td className="px-2 py-1.5 text-right">{p.dec_deg.toFixed(3)}</td>
                <td className="px-2 py-1.5 text-right">{p.flux_short.toFixed(1)}</td>
                <td className="px-2 py-1.5 text-right">{p.flux_long.toFixed(1)}</td>
                <td
                  className={cn(
                    'px-2 py-1.5 text-right',
                    p.ratio < 0.8 ? 'text-accent-cyan' : p.ratio > 1.1 ? 'text-accent-amber' : 'text-accent-green',
                  )}
                >
                  {p.ratio.toFixed(2)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}