
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { TemperatureGauge } from './TemperatureGauge'
import type { PairClassification } from '@/lib/types'
import { cn } from '@/lib/utils'
import { GlossaryText } from '@/components/glossary/GlossaryText'

const META = {
  HOT_STAR: {
    emoji: '⭐',
    title: 'Very Hot Star',
    subtitle:
      'Its light is predominantly blue. Typical of spectral types O, B, or A.',
    color: 'text-sky-400',
    border: 'border-sky-500/40',
    bg: 'bg-sky-500/10',
  },
  SUN_LIKE_STAR: {
    emoji: '☀️',
    title: 'Sun-like Star',
    subtitle:
      'Similar to our Sun. Typically associated with spectral types F or G.',
    color: 'text-yellow-400',
    border: 'border-yellow-500/40',
    bg: 'bg-yellow-500/10',
  },
  COOL_STAR: {
    emoji: '🌟',
    title: 'Cool Star',
    subtitle:
      'Redder and cooler than the Sun. Typically associated with types K or M.',
    color: 'text-orange-400',
    border: 'border-orange-500/40',
    bg: 'bg-orange-500/10',
  },
  VERY_COOL: {
    emoji: '❄️',
    title: 'Very Cool Object',
    subtitle:
      'May be a brown dwarf, a gas giant, or a dust cloud.',
    color: 'text-red-400',
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
  },
  COOL_DUSTY: {
    emoji: '☁️',
    title: 'Cool Dust or Cloud',
    subtitle:
      'Cold material that emits primarily in infrared wavelengths.',
    color: 'text-purple-400',
    border: 'border-purple-500/40',
    bg: 'bg-purple-500/10',
  },
  NO_SOURCE: {
    emoji: '⚫',
    title: 'No Object Detected',
    subtitle:
      'No clear astronomical source was detected at this sky position.',
    color: 'text-text-secondary',
    border: 'border-border',
    bg: 'bg-surface/40',
  },
  MASKED: {
    emoji: '🚫',
    title: 'Unreliable Data',
    subtitle:
      'The detector is saturated or has data quality flags at this position.',
    color: 'text-text-secondary',
    border: 'border-border',
    bg: 'bg-surface/40',
  },
  UNDETERMINED: {
    emoji: '❓',
    title: 'Unclassified',
    subtitle:
      'There is not enough information to classify this object reliably.',
    color: 'text-text-secondary',
    border: 'border-border',
    bg: 'bg-surface/40',
  },
} as const

// Legacy backend classifications mapped to their current physical equivalents.
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

export function ClassificationCard({
  classification,
}: ClassificationCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const isRecognized =
    classification.classification in META

  const metaKey = isRecognized
    ? (classification.classification as keyof typeof META)
    : LEGACY_MAP[classification.classification] ?? 'UNDETERMINED'

  const meta = META[metaKey]

  const isLegacy =
    !isRecognized &&
    classification.classification in LEGACY_MAP

  const T = classification.color_temperature_k
  const TErr = classification.color_temperature_err_k
  const confidencePct = Math.round(classification.confidence * 100)

  return (
    <div className={cn('border p-5', meta.border, meta.bg)}>
      <div className="flex items-start gap-4">
        <span className="text-4xl leading-none">{meta.emoji}</span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className={cn('font-display text-xl font-semibold', meta.color)}>
              {meta.title}
            </h3>

            {confidencePct > 0 && (
              <span className="shrink-0 rounded-full border border-border bg-background/40 px-2 py-0.5 font-mono text-[10px] text-text-secondary">
                {confidencePct}% confidence
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-text-secondary">
            <GlossaryText>{meta.subtitle}</GlossaryText>
          </p>

          {T !== null && T !== undefined && (
            <div className="mt-4 rounded-lg border border-border bg-background/40 p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary/70">
                Estimated Color Temperature
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
            <div className="mt-3 rounded-md border border-accent-amber/30 bg-accent-amber/5 p-2 font-mono text-[10px] text-accent-amber">
              <p>
                ⚠ The backend returned a legacy classification (
                {classification.classification}).
              </p>
              <p className="mt-1">
                <GlossaryText>
                  The displayed interpretation corresponds to its current physical equivalent.
                </GlossaryText>
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowDetails((value) => !value)}
            aria-expanded={showDetails}
            className="mt-3 flex items-center gap-1 font-mono text-xs text-text-secondary transition-colors hover:text-text-primary"
          >
            {showDetails ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}

            {showDetails
              ? 'Hide Technical Details'
              : 'View Technical Details'}
          </button>

          {showDetails && (
            <div className="mt-2 space-y-2 rounded-md border border-border/60 bg-background/60 p-3 text-xs">
              <DetailRow
                label="Internal Classification"
                value={classification.classification}
              />

              <DetailRow
                label="Confidence"
                value={`${confidencePct}%`}
              />

              {classification.diagnostic_band && (
                <DetailRow
                  label="Diagnostic Band"
                  value={classification.diagnostic_band}
                />
              )}

              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary/70">
                  Algorithm Explanation
                </p>

                <p className="mt-0.5 text-text-secondary">
                  <GlossaryText>{classification.reason}</GlossaryText>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-text-secondary/70">{label}</span>
      <span className="font-mono text-text-secondary">{value}</span>
    </div>
  )
}
