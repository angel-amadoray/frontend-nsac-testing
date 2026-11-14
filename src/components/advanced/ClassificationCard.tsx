import { HelpCircle, Star, Snowflake, AlertTriangle } from "lucide-react";
import type { PairClassification } from "@/lib/types";
import { cn } from "@/lib/utils";

const STYLES = {
  HOT_STAR: {
    color: "text-accent-cyan",
    border: "border-accent-cyan/40",
    bg: "bg-accent-cyan/10",
    Icon: Star,
    label: "Estrella caliente",
    hint: "SED consistente con T_color > 10,000 K. Típico de estrellas O/B/A.",
  },
  SUN_LIKE_STAR: {
    color: "text-accent-green",
    border: "border-accent-green/40",
    bg: "bg-accent-green/10",
    Icon: Star,
    label: "Estrella tipo solar",
    hint: "T_color entre 5,500 y 10,000 K. Típico de estrellas F/G.",
  },
  COOL_STAR: {
    color: "text-accent-amber",
    border: "border-accent-amber/40",
    bg: "bg-accent-amber/10",
    Icon: Star,
    label: "Estrella fría",
    hint: "T_color entre 3,500 y 5,500 K. Típico de estrellas K/M.",
  },
  VERY_COOL: {
    color: "text-accent-amber",
    border: "border-accent-amber/30",
    bg: "bg-accent-amber/5",
    Icon: Snowflake,
    label: "Objeto muy frío",
    hint: "T_color < 3,500 K. Enana M tardía, enana marrón o polvo.",
  },
  COOL_DUSTY: {
    color: "text-text-secondary",
    border: "border-border",
    bg: "bg-surface/40",
    Icon: HelpCircle,
    label: "Polvo frío",
    hint: "T_color muy baja. Podría ser polvo o error de medición.",
  },
  NO_SOURCE: {
    color: "text-text-secondary",
    border: "border-border",
    bg: "bg-surface/40",
    Icon: HelpCircle,
    label: "Sin fuente",
    hint: "No hay flujo positivo en esta posición.",
  },
  MASKED: {
    color: "text-accent-amber",
    border: "border-accent-amber/30",
    bg: "bg-accent-amber/5",
    Icon: AlertTriangle,
    label: "Enmascarado",
    hint: "El detector está saturado o con flags en esta posición.",
  },
  UNDETERMINED: {
    color: "text-text-secondary",
    border: "border-border",
    bg: "bg-surface/40",
    Icon: HelpCircle,
    label: "No determinado",
    hint: "S/N insuficiente o cobertura parcial.",
  },
} as const;

export function ClassificationCard({
  classification,
}: {
  classification: PairClassification;
}) {
  const style = STYLES[classification.classification] ?? STYLES.UNDETERMINED;
  const { Icon } = style;
  const confidencePct = Math.round(classification.confidence * 100);

  return (
    <div className={cn("rounded-xl border p-5", style.border, style.bg)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 h-6 w-6 shrink-0", style.color)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3
              className={cn("font-display text-lg font-semibold", style.color)}
            >
              {style.label}
            </h3>
            {classification.confidence > 0 && (
              <span
                className={cn(
                  "shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px]",
                  style.border,
                  style.color,
                )}
              >
                {confidencePct}% conf.
              </span>
            )}
          </div>

          {classification.color_temperature_k != null && ( // 👈 != null (no !== null)
            <div className="mt-3 rounded-md border border-border bg-background/40 px-3 py-2">
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary/70">
                Temperatura de color
              </p>
              <p className="mt-0.5 font-mono text-lg font-semibold text-text-primary">
                {classification.color_temperature_k.toFixed(0)} K
                {classification.color_temperature_err_k != null && ( // 👈 != null
                  <span className="ml-1 text-xs text-text-secondary">
                    ± {classification.color_temperature_err_k.toFixed(0)} K
                  </span>
                )}
              </p>
            </div>
          )}

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
  );
}
