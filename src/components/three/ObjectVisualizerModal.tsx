import { AlertCircle, Database, Loader2, Rotate3d, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Scene } from "@/components/three/Scene";
import { RockyBody } from "@/components/three/RockyBody";
import { StarBody } from "@/components/three/StarBody";
import { UnknownBody } from "@/components/three/UnknownBody";
import { useSpectrum, type SpectrumInput } from "@/hooks/useSpectrum";
import type { SpectrumResponse, SpherexProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "3d" | "data";

interface ObjectVisualizerModalProps {
  open: boolean;
  onClose: () => void;
  /** Fuente normal: pide a /spectrum usando sector/epoch/detector/pixel. */
  input?: SpectrumInput | null;
  /** Override: si se pasa, NO se llama a /spectrum, se usa este perfil directo. */
  overrideProfile?: SpherexProfile | null;
  /** Override del sparkline (para el modo pair: 2 puntos en vez de una curva). */
  overrideSpectrum?: { wavelengths_um: number[]; flux_per_row: number[] } | null;
}

export function ObjectVisualizerModal({
  open,
  onClose,
  input = null,
  overrideProfile = null,
  overrideSpectrum = null,
}: ObjectVisualizerModalProps) {
  const [tab, setTab] = useState<Tab>("3d");

  // 🆕 Solo consulta /spectrum si NO estamos en modo override
  const spectrumQuery = useSpectrum(open && !overrideProfile ? input : null);

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

  // 🆕 Prioridad: override > query > null
  const profile = overrideProfile ?? spectrumQuery.data?.profile ?? null;
  const isLoading = !overrideProfile && spectrumQuery.isLoading && !profile;
  const error = !overrideProfile && spectrumQuery.isError ? spectrumQuery.error : null;

  // 🆕 SpectrumResponse: si hay override, construirlo sintético; si no, usar el de la query
  const spectrumData: SpectrumResponse | null = overrideProfile
    ? {
        sector_id: "",
        epoch: "",
        detector: 0,
        pixel_x: 0,
        pixel_y: 0,
        wavelengths_um: overrideSpectrum?.wavelengths_um ?? [],
        flux_per_row: overrideSpectrum?.flux_per_row ?? [],
        profile: overrideProfile,
      }
    : spectrumQuery.data ?? null;

  // 🆕 Texto del header según el modo
  const headerDetail = (() => {
    if (!profile) return null;
    const parts: string[] = [profile.candidate_class.replace("_", " ")];
    if (profile.confidence > 0) {
      parts.push(`conf ${(profile.confidence * 100).toFixed(0)}%`);
    }
    if (profile.color_ratio !== null) {
      const ratio = profile.color_ratio.toFixed(3);
      const err =
        profile.color_ratio_error !== null
          ? ` ± ${profile.color_ratio_error.toFixed(3)}`
          : "";
      parts.push(`ratio ${ratio}${err}`);
    }
    if (input?.pixelX != null && input?.pixelY != null) {
      parts.push(`${input.pixelX},${input.pixelY}`);
    }
    return parts.join(" · ");
  })();

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Rotate3d className="h-5 w-5 text-accent-cyan" />
              <h2 className="font-display text-lg font-semibold">
                Visualización del objeto
              </h2>
            </div>
            {headerDetail && (
              <p className="mt-1 font-mono text-xs text-text-secondary">
                {headerDetail}
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
              {/* 🆕 Pasar spectrumData (que respeta override), no spectrumQuery.data */}
              {tab === "data" && <DataView spectrum={spectrumData} />}
            </>
          )}
        </div>

        {/* 🆕 Disclaimer dinámico según el modo */}
        <footer className="border-t border-border bg-background/50 px-5 py-3">
          <p className="font-mono text-[10px] leading-relaxed text-text-secondary/70">
            <span className="text-accent-amber">ℹ</span>{" "}
            {overrideProfile
              ? "Análisis de 2 bandas (par de detectores del mismo telescopio SPHEREx). La clasificación es un candidato estadístico, no una identificación."
              : "Interpretación visual basada en el micro-espectro SPHEREx. La clasificación usa la pendiente sobre un rango de ~0.017 μm (un solo detector)."}{" "}
            Para rigor científico completo se requieren los 6 detectores combinados.
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
  const hints = profile.visual_hints;
  const conf = profile.confidence;

  return (
    <div className="relative h-[420px] w-full">
      <div className="absolute top-3 left-3 z-10 rounded-md border border-border bg-surface/90 px-2.5 py-1 font-mono text-xs backdrop-blur">
        <span
          className={
            conf > 0.6
              ? "text-accent-green"
              : conf > 0.3
                ? "text-accent-amber"
                : "text-text-secondary"
          }
        >
          {conf > 0.6 ? "● alta confianza" : conf > 0.3 ? "● media" : "● baja"}
        </span>
      </div>

      <Scene>
        {hints.suggested_3d_model === "rocky" && (
          <RockyBody
            color={hints.base_color_hex}
            roughness={hints.roughness}
            metalness={hints.metalness}
          />
        )}
        {hints.suggested_3d_model === "star" && (
          <StarBody
            color={hints.base_color_hex}
            emissiveIntensity={hints.emissive_intensity}
          />
        )}
        {hints.suggested_3d_model === "unknown" && (
          <UnknownBody color={hints.base_color_hex} />
        )}
      </Scene>
    </div>
  );
}

function DataView({ spectrum }: { spectrum: SpectrumResponse | null }) {
  if (!spectrum) {
    return (
      <div className="p-6 text-center text-sm text-text-secondary">
        Datos del espectro no disponibles.
      </div>
    );
  }

  const { profile } = spectrum;

  const fmt = (v: number | null, d = 4) =>
    v !== null && v !== undefined ? v.toFixed(d) : "—";
  const fmtExp = (v: number | null) =>
    v !== null && v !== undefined ? v.toExponential(2) : "—";

  const ratioDisplay =
    profile.color_ratio !== null
      ? `${fmt(profile.color_ratio, 3)}${
          profile.color_ratio_error !== null
            ? ` ± ${fmt(profile.color_ratio_error, 3)}`
            : ""
        }`
      : "—";

  const confDisplay =
    profile.confidence > 0
      ? `${(profile.confidence * 100).toFixed(0)}%`
      : "baja";

  return (
    <div className="space-y-4 p-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard
          label="Clase candidata"
          value={profile.candidate_class.replace("_", " ")}
          highlight
        />
        <MetricCard label="Confianza" value={confDisplay} />
        <MetricCard label="Ratio F(long/short)" value={ratioDisplay} />
        <MetricCard label="Color index" value={fmt(profile.color_index, 3)} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Flujo" value={fmtExp(profile.total_flux)} />
        <MetricCard
          label="S/N"
          value={profile.snr !== null ? profile.snr.toFixed(1) : "—"}
        />
        <MetricCard label="Puntos λ" value={`${profile.n_spectral_points}`} />
        <MetricCard
          label="Rango λ"
          value={`${profile.wavelength_range_nm.toFixed(1)} nm`}
        />
      </div>

      {!profile.reliable && (
        <div className="rounded-md border border-accent-amber/30 bg-accent-amber/5 p-3">
          <p className="font-mono text-xs text-accent-amber">
            ⚠ Rango espectral insuficiente (
            {profile.wavelength_range_nm.toFixed(1)} nm, mínimo 3 nm). La
            clasificación requiere combinar los 6 detectores para mayor
            cobertura.
          </p>
        </div>
      )}

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

      {spectrum.wavelengths_um.length > 0 && (
        <div className="rounded-lg border border-border bg-background/40 p-4">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-text-secondary">
            {spectrum.wavelengths_um.length > 2
              ? `Micro-espectro (${spectrum.wavelengths_um.length} muestras)`
              : `Puntos espectrales (${spectrum.wavelengths_um.length})`}
          </p>
          <Sparkline xs={spectrum.wavelengths_um} ys={spectrum.flux_per_row} />
        </div>
      )}
    </div>
  );
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

  // 🆕 Puntos visibles si son pocos (modo pair = 2 puntos)
  const showDots = xs.length <= 6;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-32 w-full">
      <polyline
        points={points}
        fill="none"
        stroke="hsl(var(--accent-cyan))"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {showDots &&
        xs.map((x, i) => {
          const px = PAD + ((x - xMin) / xSpan) * (W - 2 * PAD);
          const py = H - PAD - ((ys[i] - yMin) / ySpan) * (H - 2 * PAD);
          return (
            <circle
              key={i}
              cx={px}
              cy={py}
              r={4}
              fill="hsl(var(--accent-cyan))"
            />
          );
        })}
    </svg>
  );
}