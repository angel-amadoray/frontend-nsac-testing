import { AlertTriangle, TrendingDown, HelpCircle, TrendingUp, Minus } from 'lucide-react'
import type { PairClassification } from '@/lib/types'
import { cn } from '@/lib/utils'

const STYLES = {
  STEEP_RED_SED: {
    color: 'text-accent-cyan',
    border: 'border-accent-cyan/40',
    bg: 'bg-accent-cyan/10',
    Icon: TrendingDown,
    label: 'SED rojo pronunciado',
    hint: 'Caída fuerte del flujo hacia λ largas. Esperado para estrellas calientes. NO es una detección de hielo de agua.',
  },
  RED_SED: {
    color: 'text-accent-cyan/80',
    border: 'border-accent-cyan/30',
    bg: 'bg-accent-cyan/5',
    Icon: TrendingDown,
    label: 'SED rojo moderado',
    hint: 'Continuo estelar cálido o fuente enrojecida por polvo.',
  },
  FLAT_SED: {
    color: 'text-accent-green',
    border: 'border-accent-green/40',
    bg: 'bg-accent-green/10',
    Icon: Minus,
    label: 'SED plano',
    hint: 'Ratio ≈ 1. Poco común; podría ser mixtura o artefacto.',
  },
  RISING_SED: {
    color: 'text-accent-amber',
    border: 'border-accent-amber/40',
    bg: 'bg-accent-amber/10',
    Icon: TrendingUp,
    label: 'SED creciente',
    hint: 'Más flujo a λ largas. Compatible con emisión de polvo caliente o cuerpo frío.',
  },
  NO_SOURCE: {
    color: 'text-text-secondary',
    border: 'border-border',
    bg: 'bg-surface/40',
    Icon: HelpCircle,
    label: 'Sin fuente',
    hint: 'No hay flujo positivo en esta posición.',
  },
  MASKED: {
    color: 'text-accent-amber',
    border: 'border-accent-amber/30',
    bg: 'bg-accent-amber/5',
    Icon: AlertTriangle,
    label: 'Enmascarado',
    hint: 'El detector está saturado o con flags en esta posición.',
  },
  UNDETERMINED: {
    color: 'text-text-secondary',
    border: 'border-border',
    bg: 'bg-surface/40',
    Icon: HelpCircle,
    label: 'No determinado',
    hint: 'S/N insuficiente o cobertura parcial.',
  },
} as const

export function ClassificationCard({
  classification,
}: {
  classification: PairClassification
}) {
  const style = STYLES[classification.classification] ?? STYLES.UNDETERMINED
  const { Icon } = style
  const confidencePct = Math.round(classification.confidence * 100)

  return (
    <div
      className={cn(
        'rounded-xl border p-5',
        style.border,
        style.bg,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('mt-0.5 h-6 w-6 shrink-0', style.color)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3
              className={cn(
                'font-display text-lg font-semibold',
                style.color,
              )}
            >
              {style.label}
            </h3>
            {classification.confidence > 0 && (
              <span
                className={cn(
                  'shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px]',
                  style.border,
                  style.color,
                )}
              >
                {(confidencePct)}% conf.
              </span>
            )}
          </div>
          {classification.diagnostic_band && (
            <p className="mt-0.5 font-mono text-xs text-text-secondary/70">
              Banda diagnóstica: {classification.diagnostic_band}
            </p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-text-primary">
            {classification.reason}
          </p>
          <p className="mt-1 text-xs text-text-secondary">{style.hint}</p>
        </div>
      </div>
    </div>
  )
}