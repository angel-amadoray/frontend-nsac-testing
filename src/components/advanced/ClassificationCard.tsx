import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { TemperatureGauge } from './TemperatureGauge'
import type { PairClassification } from '@/lib/types'
import { cn } from '@/lib/utils'

const META = {
  HOT_STAR: {
    emoji: '⭐',
    title: 'Estrella muy caliente',
    subtitle: 'Su luz es mayormente azul. Típico de estrellas tipo O, B o A.',
    color: 'text-sky-400',
    border: 'border-sky-500/40',
    bg: 'bg-sky-500/10',
  },
  SUN_LIKE_STAR: {
    emoji: '☀️',
    title: 'Estrella tipo solar',
    subtitle: 'Parecida a nuestro Sol. Tipo espectral F o G.',
    color: 'text-yellow-400',
    border: 'border-yellow-500/40',
    bg: 'bg-yellow-500/10',
  },
  COOL_STAR: {
    emoji: '🌟',
    title: 'Estrella fría',
    subtitle: 'Más roja y fría que el Sol. Tipo K o M.',
    color: 'text-orange-400',
    border: 'border-orange-500/40',
    bg: 'bg-orange-500/10',
  },
  VERY_COOL: {
    emoji: '❄️',
    title: 'Objeto muy frío',
    subtitle: 'Puede ser una enana marrón, un gigante gaseoso o una nube de polvo.',
    color: 'text-red-400',
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
  },
  COOL_DUSTY: {
    emoji: '☁️',
    title: 'Polvo o nube fría',
    subtitle: 'Material frío que emite principalmente en infrarrojo.',
    color: 'text-purple-400',
    border: 'border-purple-500/40',
    bg: 'bg-purple-500/10',
  },
  NO_SOURCE: {
    emoji: '⚫',
    title: 'Sin objeto detectado',
    subtitle: 'No hay una fuente clara en esta posición del cielo.',
    color: 'text-text-secondary',
    border: 'border-border',
    bg: 'bg-surface/40',
  },
  MASKED: {
    emoji: '🚫',
    title: 'Datos no confiables',
    subtitle: 'El detector está saturado o con flags en esta posición.',
    color: 'text-text-secondary',
    border: 'border-border',
    bg: 'bg-surface/40',
  },
  UNDETERMINED: {
    emoji: '❓',
    title: 'Sin clasificar',
    subtitle: 'No hay suficiente información para clasificar este objeto con confianza.',
    color: 'text-text-secondary',
    border: 'border-border',
    bg: 'bg-surface/40',
  },
} as const

// Los nombres viejos del backend se mapean al equivalente físico actual
const LEGACY_MAP: Record<string, keyof typeof META> = {
  STEEP_RED_SED: 'HOT_STAR',
  RED_SED: 'SUN_LIKE_STAR',
  FLAT_SED: 'COOL_STAR',
  RISING_SED: 'VERY_COOL',
  ABSORPTION: 'HOT_STAR',
  EMISSION: 'COOL_DUSTY',
  CONTINUUM: 'SUN_LIKE_STAR',
}

interface ClassificationCardProps {
  classification: PairClassification
}

export function ClassificationCard({ classification }: ClassificationCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const isRecognized =
    classification.classification in META
  const metaKey = isRecognized
    ? (classification.classification as keyof typeof META)
    : LEGACY_MAP[classification.classification] ?? 'UNDETERMINED'
  const meta = META[metaKey]
  const isLegacy = !isRecognized && classification.classification in LEGACY_MAP

  const T = classification.color_temperature_k
  const TErr = classification.color_temperature_err_k
  const confidencePct = Math.round(classification.confidence * 100)

  return (
    <div className={cn('rounded-xl border p-5', meta.border, meta.bg)}>
      <div className="flex items-start gap-4">
        <span className="text-4xl leading-none">{meta.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className={cn('font-display text-xl font-semibold', meta.color)}>
              {meta.title}
            </h3>
            {confidencePct > 0 && (
              <span className="shrink-0 rounded-full border border-border bg-background/40 px-2 py-0.5 font-mono text-[10px] text-text-secondary">
                {confidencePct}% conf.
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-text-secondary">{meta.subtitle}</p>

          {T !== null && T !== undefined && (
            <div className="mt-4 rounded-lg border border-border bg-background/40 p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary/70">
                Temperatura de color estimada
              </p>
              <p className="mt-0.5 font-mono text-2xl font-semibold text-text-primary">
                {T.toFixed(0)} K
                {TErr !== null && TErr !== undefined && (
                  <span className="ml-1.5 text-sm text-text-secondary">
                    ± {TErr.toFixed(0)} K
                  </span>
                )}
              </p>
              <div className="mt-2">
                <TemperatureGauge temperatureK={T} />
              </div>
            </div>
          )}

          {isLegacy && (
            <p className="mt-3 rounded-md border border-accent-amber/30 bg-accent-amber/5 p-2 font-mono text-[10px] text-accent-amber">
              ⚠ El backend devolvió un nombre antiguo ({classification.classification}).
              La interpretación mostrada es la equivalente física actual.
            </p>
          )}

          <button
            onClick={() => setShowDetails((v) => !v)}
            className="mt-3 flex items-center gap-1 font-mono text-xs text-text-secondary transition-colors hover:text-text-primary"
          >
            {showDetails ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            {showDetails ? 'Ocultar detalles técnicos' : 'Ver detalles técnicos'}
          </button>

          {showDetails && (
            <div className="mt-2 space-y-2 rounded-md border border-border/60 bg-background/60 p-3 text-xs">
              <DetailRow
                label="Clasificación interna"
                value={classification.classification}
              />
              <DetailRow label="Confianza" value={`${confidencePct}%`} />
              {classification.diagnostic_band && (
                <DetailRow
                  label="Banda diagnóstica"
                  value={classification.diagnostic_band}
                />
              )}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary/70">
                  Razón del algoritmo
                </p>
                <p className="mt-0.5 text-text-secondary">
                  {classification.reason}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-text-secondary/70">{label}</span>
      <span className="font-mono text-text-secondary">{value}</span>
    </div>
  )
}