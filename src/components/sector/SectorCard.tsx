import { Calendar, Crosshair, Telescope } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Hotspot } from '@/lib/types'
import { cn, formatDec, formatRA } from '@/lib/utils'

export function SectorCard({ hotspot }: { hotspot: Hotspot }) {
  return (
    <Link
      to={`/sector/${hotspot.id}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface',
        'transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-cyan/50',
        'hover:shadow-lg hover:shadow-accent-cyan/5',
      )}
    >
      {/* Preview: gradiente hasta que tengamos thumbnail real */}
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-accent-cyan/10 via-accent-purple/10 to-background">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
        <Telescope className="relative h-12 w-12 text-accent-cyan/60 transition-transform duration-300 group-hover:scale-110" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
            {hotspot.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
            {hotspot.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Crosshair className="h-3 w-3" />
            RA {formatRA(hotspot.ra)}
          </span>
          <span className="flex items-center gap-1.5">
            <Crosshair className="h-3 w-3" />
            Dec {formatDec(hotspot.dec)}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-1.5 font-mono text-xs text-text-secondary">
          <Calendar className="h-3 w-3" />
          {hotspot.epochs.length} época{hotspot.epochs.length !== 1 ? 's' : ''}
          <span className="text-text-secondary/50">·</span>
          {hotspot.epochs.join(' · ')}
        </div>
      </div>
    </Link>
  )
}