import type { DetectorSample } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PairSpectrumCardProps {
  short: DetectorSample
  long: DetectorSample
  ratio: number | null
  ratioError: number | null
}

export function PairSpectrumCard({
  short,
  long,
  ratio,
  ratioError,
}: PairSpectrumCardProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Dos bandas espectrales
        </h3>
        <span className="font-mono text-xs text-text-secondary/60">
          {short.detector} + {long.detector}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DetectorBox sample={short} label="λ corta" />
        <DetectorBox sample={long} label="λ larga" />
      </div>

      {/* Ratio visual */}
      {ratio !== null && (
        <div className="rounded-lg border border-border bg-background/40 p-3">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">
              Ratio F(long) / F(short)
            </span>
            <span className="font-mono text-lg font-semibold text-text-primary">
              {ratio.toFixed(3)}
              {ratioError !== null && (
                <span className="ml-1 text-xs text-text-secondary">
                  ± {ratioError.toFixed(3)}
                </span>
              )}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 font-mono text-xs text-text-secondary/60">
            <span className="text-accent-cyan">← azul</span>
            <div className="relative h-1 flex-1 rounded-full bg-surface-elevated">
              <div
                className="absolute top-0 h-1 w-1 rounded-full bg-accent-cyan"
                style={{ left: `${Math.min(Math.max(ratio * 50, 0), 100)}%` }}
              />
              <div
                className="absolute top-0 left-1/2 h-1 w-px bg-text-secondary/40"
              />
            </div>
            <span className="text-accent-amber">rojo →</span>
          </div>
        </div>
      )}
    </div>
  )
}

function DetectorBox({
  sample,
  label,
}: {
  sample: DetectorSample
  label: string
}) {
  const valid = sample.available && sample.flux !== null
  return (
    <div
      className={cn(
        'rounded-lg border p-3',
        valid
          ? 'border-border bg-background/40'
          : 'border-border/50 bg-surface/30 opacity-60',
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary/70">
        {label}
      </p>
      <p className="mt-1 font-mono text-sm font-semibold text-text-primary">
        D{sample.detector} · {sample.wavelength_center_um.toFixed(2)} μm
      </p>
      <p className="mt-0.5 font-mono text-[11px] text-text-secondary/60">
        {sample.wavelength_range_um[0].toFixed(2)}–{sample.wavelength_range_um[1].toFixed(2)} μm
      </p>
      <div className="mt-2 space-y-0.5 font-mono text-xs">
        <p>
          <span className="text-text-secondary/60">Flux:</span>{' '}
          <span className="text-text-primary">
            {sample.flux !== null ? sample.flux.toFixed(2) : '—'}
          </span>
        </p>
        <p>
          <span className="text-text-secondary/60">S/N:</span>{' '}
          <span
            className={cn(
              (sample.snr ?? 0) >= 10 ? 'text-accent-green' : 'text-accent-amber',
            )}
          >
            {sample.snr !== null ? sample.snr.toFixed(1) : '—'}
          </span>
        </p>
        <p>
          <span className="text-text-secondary/60">Covertura:</span>{' '}
          <span className="text-text-primary">
            {(sample.valid_fraction_aperture * 100).toFixed(0)}%
          </span>
        </p>
      </div>
    </div>
  )
}