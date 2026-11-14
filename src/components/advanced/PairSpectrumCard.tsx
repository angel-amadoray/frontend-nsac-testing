import type { DetectorSample } from '@/lib/types'

interface PairSpectrumCardProps {
  short: DetectorSample
  long: DetectorSample
  ratio: number | null
  ratioError: number | null
}

export function PairSpectrumCard({ short, long }: PairSpectrumCardProps) {
  const fShort = short.flux ?? 0
  const fLong = long.flux ?? 0
  const max = Math.max(fShort, fLong, 1e-9)
  const pctShort = (fShort / max) * 100
  const pctLong = (fLong / max) * 100
  const brighterInShort = fShort >= fLong
  const factor =
    brighterInShort
      ? fShort / Math.max(fLong, 1e-9)
      : fLong / Math.max(fShort, 1e-9)

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-secondary">
          ¿Cómo brilla este objeto?
        </h3>
        <p className="mt-1 text-xs text-text-secondary/70">
          Comparamos su brillo en dos longitudes de onda distintas.
        </p>
      </div>

      <div className="space-y-4">
        <BandRow
          label="Banda 1 · Luz azul cercana"
          sublabel={`λ ≈ ${short.wavelength_center_um.toFixed(2)} μm · casi visible al ojo`}
          value={fShort}
          percent={pctShort}
          color="hsl(190 100% 60%)"
          icon="💙"
        />
        <BandRow
          label="Banda 4 · Infrarrojo medio"
          sublabel={`λ ≈ ${long.wavelength_center_um.toFixed(2)} μm · emisión de calor`}
          value={fLong}
          percent={pctLong}
          color="hsl(38 92% 55%)"
          icon="🔥"
        />
      </div>

      <div className="mt-5 rounded-lg border border-border bg-background/40 p-3">
        <p className="text-sm text-text-primary">
          {brighterInShort ? (
            <>
              Es{' '}
              <span className="font-semibold text-accent-cyan">
                {factor.toFixed(1)}×
              </span>{' '}
              más brillante en la banda azul que en el infrarrojo.
            </>
          ) : (
            <>
              Es{' '}
              <span className="font-semibold text-accent-amber">
                {factor.toFixed(1)}×
              </span>{' '}
              más brillante en el infrarrojo que en la banda azul.
            </>
          )}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
          {brighterInShort
            ? '💡 Las estrellas calientes emiten más luz azul que infrarroja.'
            : '💡 Los objetos fríos (polvo, enanas marrones, planetas gigantes) emiten más infrarrojo.'}
        </p>
      </div>
    </div>
  )
}

function BandRow({
  label,
  sublabel,
  value,
  percent,
  color,
  icon,
}: {
  label: string
  sublabel: string
  value: number
  percent: number
  color: string
  icon: string
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p className="font-mono text-[10px] text-text-secondary/60">
            {sublabel}
          </p>
        </div>
        <span className="shrink-0 font-mono text-sm text-text-primary">
          {icon} {value.toFixed(0)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.max(percent, 3)}%`, background: color }}
        />
      </div>
    </div>
  )
}