import { AlertCircle, Database, Loader2, Rotate3d, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Scene } from "@/components/three/Scene";
import { RockyBody } from "@/components/three/RockyBody";
import { StarBody } from "@/components/three/StarBody";
import { UnknownBody } from "@/components/three/UnknownBody";
import { useSpectrum, type SpectrumInput } from "@/hooks/useSpectrum";
import type { SpherexProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "3d" | "data";

interface ObjectVisualizerModalProps {
  open: boolean;
  onClose: () => void;
  input: SpectrumInput | null;
  /** Perfil ya obtenido (ej. de /identify). Se muestra mientras carga /spectrum. */
  initialProfile?: SpherexProfile | null;
}

export function ObjectVisualizerModal({
  open,
  onClose,
  input,
  initialProfile,
}: ObjectVisualizerModalProps) {
  const [tab, setTab] = useState<Tab>("3d");
  const spectrumQuery = useSpectrum(open ? input : null);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const profile = spectrumQuery.data?.profile ?? initialProfile ?? null;
  const isLoading = spectrumQuery.isLoading && !profile;
  const error = spectrumQuery.isError ? spectrumQuery.error : null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Rotate3d className="h-5 w-5 text-accent-cyan" />
              <h2 className="font-display text-lg font-semibold">
                Visualización del objeto
              </h2>
            </div>
            {profile && (
  <p className="mt-1 font-mono text-xs text-text-secondary">
    {profile.candidate_class.replace('_', ' ')} ·{' '}
    {profile.confidence > 0 && `conf ${(profile.confidence * 100).toFixed(0)}% · `}
    ratio {profile.color_ratio !== null ? profile.color_ratio.toFixed(3) : 'n/a'}
    {profile.color_ratio_error !== null && ` ± ${profile.color_ratio_error.toFixed(3)}`} ·{' '}
    {input?.pixelX},{input?.pixelY}
  </p>
)}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-md border border-border bg-surface-elevated p-1.5 text-text-secondary transition-colors hover:border-danger/40 hover:text-danger"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <TabButton
            active={tab === "3d"}
            onClick={() => setTab("3d")}
            icon={Rotate3d}
            label="Vista 3D"
          />
          <TabButton
            active={tab === "data"}
            onClick={() => setTab("data")}
            icon={Database}
            label="Datos espectrales"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex h-[420px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-accent-cyan" />
                <p className="font-mono text-xs text-text-secondary">
                  Extrayendo micro-espectro del píxel…
                </p>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex h-[420px] flex-col items-center justify-center gap-3 p-8 text-center">
              <AlertCircle className="h-8 w-8 text-danger" />
              <p className="font-display text-sm font-medium">
                No se pudo cargar el espectro
              </p>
              <p className="max-w-md font-mono text-xs text-text-secondary">
                {error.message}
              </p>
            </div>
          )}

          {profile && !isLoading && (
            <>
              {tab === "3d" && <View3D profile={profile} />}
              {tab === "data" && (
                <DataView spectrum={spectrumQuery.data ?? null} />
              )}
            </>
          )}
        </div>

        {/* Disclaimer */}
        <footer className="border-t border-border bg-background/50 px-5 py-3">
          <p className="font-mono text-[10px] leading-relaxed text-text-secondary/70">
            <span className="text-accent-amber">ℹ</span> Interpretación visual
            basada en el micro-espectro SPHEREx + identidad JPL. No es una
            imagen real del objeto. La clasificación usa la pendiente espectral
            sobre un rango de ~0.017 μm (un solo detector); para rigor
            científico se requiere combinar los 6 detectores.
          </p>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Rotate3d;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors",
        active
          ? "border-accent-cyan text-accent-cyan"
          : "border-transparent text-text-secondary hover:bg-surface-elevated hover:text-text-primary",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function View3D({ profile }: { profile: SpherexProfile }) {
  const hints = profile.visual_hints
  const conf = profile.confidence

  return (
    <div className="relative h-[420px] w-full">
      {/* Badge de confianza */}
      <div className="absolute top-3 left-3 z-10 rounded-md border border-border bg-surface/90 px-2.5 py-1 font-mono text-xs backdrop-blur">
        <span className={
          conf > 0.6 ? 'text-accent-green'
          : conf > 0.3 ? 'text-accent-amber'
          : 'text-text-secondary'
        }>
          {conf > 0.6 ? '● alta confianza' : conf > 0.3 ? '● media' : '● baja'}
        </span>
      </div>

      <Scene>
        {hints.suggested_3d_model === 'rocky' && (
          <RockyBody color={hints.base_color_hex} roughness={hints.roughness} metalness={hints.metalness} />
        )}
        {hints.suggested_3d_model === 'star' && (
          <StarBody color={hints.base_color_hex} emissiveIntensity={hints.emissive_intensity} />
        )}
        {hints.suggested_3d_model === 'unknown' && (
          <UnknownBody color={hints.base_color_hex} />
        )}
      </Scene>
    </div>
  )
}

function DataView({ spectrum }: { spectrum: import('@/lib/types').SpectrumResponse | null }) {
  if (!spectrum) {
    return (
      <div className="p-6 text-center text-sm text-text-secondary">
        Datos del espectro no disponibles.
      </div>
    )
  }

  const { profile } = spectrum

  const fmt = (v: number | null, d = 4) => (v !== null && v !== undefined ? v.toFixed(d) : '—')
  const fmtExp = (v: number | null) =>
    v !== null && v !== undefined ? v.toExponential(2) : '—'

  const ratioDisplay =
    profile.color_ratio !== null
      ? `${fmt(profile.color_ratio, 3)}${
          profile.color_ratio_error !== null ? ` ± ${fmt(profile.color_ratio_error, 3)}` : ''
        }`
      : '—'

  const confDisplay =
    profile.confidence > 0 ? `${(profile.confidence * 100).toFixed(0)}%` : 'baja'

  return (
    <div className="space-y-4 p-5">
      {/* Fila 1: clasificación y color */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard
          label="Clase candidata"
          value={profile.candidate_class.replace('_', ' ')}
          highlight
        />
        <MetricCard label="Confianza" value={confDisplay} />
        <MetricCard label="Ratio F(long/short)" value={ratioDisplay} />
        <MetricCard label="Color index" value={fmt(profile.color_index, 3)} />
      </div>

      {/* Fila 2: fotometría y cobertura */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Flujo" value={fmtExp(profile.total_flux)} />
        <MetricCard label="S/N" value={profile.snr !== null ? profile.snr.toFixed(1) : '—'} />
        <MetricCard label="Puntos λ" value={`${profile.n_spectral_points}`} />
        <MetricCard label="Rango λ" value={`${profile.wavelength_range_nm.toFixed(1)} nm`} />
      </div>

      {/* Aviso de rango insuficiente */}
      {!profile.reliable && (
        <div className="rounded-md border border-accent-amber/30 bg-accent-amber/5 p-3">
          <p className="font-mono text-xs text-accent-amber">
            ⚠ Rango espectral insuficiente ({profile.wavelength_range_nm.toFixed(1)} nm, mínimo 3 nm).
            La clasificación requiere combinar los 6 detectores para mayor cobertura.
          </p>
        </div>
      )}

      {/* Reasons */}
      {profile.reasons.length > 0 && (
        <div className="rounded-lg border border-border bg-background/40 p-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary/70">
            Razones
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {profile.reasons.map((r) => (
              <span
                key={r}
                className="rounded bg-surface-elevated px-2 py-0.5 font-mono text-xs text-text-secondary"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sparkline */}
      {spectrum.wavelengths_um.length > 2 && (
        <div className="rounded-lg border border-border bg-background/40 p-4">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-text-secondary">
            Micro-espectro ({spectrum.wavelengths_um.length} muestras)
          </p>
          <Sparkline xs={spectrum.wavelengths_um} ys={spectrum.flux_per_row} />
        </div>
      )}
    </div>
  )
}

function MetricCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary/70">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-mono text-sm font-medium",
          highlight ? "text-accent-cyan" : "text-text-primary",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Sparkline({ xs, ys }: { xs: number[]; ys: number[] }) {
  const W = 600;
  const H = 120;
  const PAD = 8;

  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMax = Math.max(...ys, 1e-9);
  const yMin = Math.min(...ys, 0);

  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;

  const points = xs
    .map((x, i) => {
      const px = PAD + ((x - xMin) / xSpan) * (W - 2 * PAD);
      const py = H - PAD - ((ys[i] - yMin) / ySpan) * (H - 2 * PAD);
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-32 w-full">
      <polyline
        points={points}
        fill="none"
        stroke="hsl(var(--accent-cyan))"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}
