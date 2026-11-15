
import {
  AlertCircle,
  Database,
  Loader2,
  Rotate3d,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Scene } from "@/components/three/Scene";
import { RockyBody } from "@/components/three/RockyBody";
import { StarBody } from "@/components/three/StarBody";
import { UnknownBody } from "@/components/three/UnknownBody";
import { GlossaryText } from "@/components/glossary/GlossaryText";

import { useSpectrum, type SpectrumInput } from "@/hooks/useSpectrum";
import type { SpectrumResponse, SpherexProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "3d" | "data";

interface ObjectVisualizerModalProps {
  /** Standard source: requests /spectrum using sector/epoch/detector/pixel. */
  open: boolean;
  onClose: () => void;
  input?: SpectrumInput | null;

  /** Override: skips /spectrum and uses this profile directly. */
  overrideProfile?: SpherexProfile | null;

  /** Spectrum override, used in pair mode with two points instead of a curve. */
  overrideSpectrum?: {
    wavelengths_um: number[];
    flux_per_row: number[];
  } | null;
}

export function ObjectVisualizerModal({
  open,
  onClose,
  input = null,
  overrideProfile = null,
  overrideSpectrum = null,
}: ObjectVisualizerModalProps) {
  const [tab, setTab] = useState<Tab>("3d");

  // Request spectrum data only when an override profile is not provided.
  const spectrumQuery = useSpectrum(
    open && !overrideProfile ? input : null,
  );

  // Close the modal with Escape.
  useEffect(() => {
    if (!open) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  if (!open) return null;

  // Priority: override profile > query result > null.
  const profile =
    overrideProfile ?? spectrumQuery.data?.profile ?? null;

  const isLoading =
    !overrideProfile && spectrumQuery.isLoading && !profile;

  const error =
    !overrideProfile && spectrumQuery.isError
      ? spectrumQuery.error
      : null;

  // Build a synthetic response when an override profile is provided.
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

  // Header information depends on the current visualization mode.
  const headerDetail = (() => {
    if (!profile) return null;

    const parts: string[] = [
      profile.candidate_class.replace(/_/g, " "),
    ];

    if (profile.confidence > 0) {
      parts.push(`${(profile.confidence * 100).toFixed(0)}% confidence`);
    }

    if (profile.color_ratio !== null) {
      const ratio = profile.color_ratio.toFixed(3);

      const error =
        profile.color_ratio_error !== null
          ? ` ± ${profile.color_ratio_error.toFixed(3)}`
          : "";

      parts.push(`Ratio ${ratio}${error}`);
    }

    if (input?.pixelX != null && input?.pixelY != null) {
      parts.push(`Pixel ${input.pixelX}, ${input.pixelY}`);
    }

    return parts.join(" · ");
  })();

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close object visualizer"
        className="absolute inset-0 cursor-default bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="object-visualizer-title"
        className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden border border-border bg-surface shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <Rotate3d className="h-5 w-5 shrink-0 text-accent-cyan" />

              <h2
                id="object-visualizer-title"
                className="font-sans text-lg font-semibold tracking-tight text-text-primary"
              >
                Object Visualization
              </h2>
            </div>

            {headerDetail && (
              <p className="mt-2 font-mono text-[10px] leading-relaxed tracking-wide text-text-secondary sm:text-xs">
                {headerDetail}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 border border-border bg-surface-elevated p-2 text-text-secondary transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Tabs */}
        <nav
          className="flex border-b border-border"
          aria-label="Visualization modes"
        >
          <TabButton
            active={tab === "3d"}
            onClick={() => setTab("3d")}
            icon={Rotate3d}
            label="3D VIEW"
          />

          <TabButton
            active={tab === "data"}
            onClick={() => setTab("data")}
            icon={Database}
            label="SPECTRAL DATA"
          />
        </nav>

        {/* Main content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex h-[420px] items-center justify-center px-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-accent-cyan" />

                <div>
                  <p className="font-sans text-sm font-medium text-text-primary">
                    Retrieving spectral data
                  </p>

                  <p className="mt-1 font-mono text-[10px] text-text-secondary">
                    Extracting the pixel micro-spectrum...
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex h-[420px] flex-col items-center justify-center gap-4 p-8 text-center">
              <AlertCircle className="h-8 w-8 text-danger" />

              <div>
                <p className="font-sans text-sm font-semibold text-text-primary">
                  Unable to load spectrum
                </p>

                <p className="mt-2 max-w-md font-mono text-xs leading-relaxed text-text-secondary">
                  {error.message}
                </p>
              </div>
            </div>
          )}

          {profile && !isLoading && (
            <>
              {tab === "3d" && <View3D profile={profile} />}

              {tab === "data" && (
                <DataView spectrum={spectrumData} />
              )}
            </>
          )}
        </div>

        {/* Scientific disclaimer */}
        <footer className="border-t border-border bg-background/40 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 font-mono text-xs text-accent-cyan">
              INFO
            </span>

            <p className="font-sans text-[11px] leading-relaxed text-text-secondary">
              <GlossaryText>
                {overrideProfile
                  ? "Two-band analysis using a pair of detectors from the same SPHEREx telescope. The classification is a statistical candidate, not a confirmed identification."
                  : "Visual interpretation based on the SPHEREx pixel micro-spectrum. Classification uses the spectral slope across an approximately 0.017 μm range from a single detector."}
              </GlossaryText>{" "}
              <GlossaryText>
                Full scientific coverage requires combining data from all six detectors.
              </GlossaryText>
            </p>
          </div>
        </footer>
      </section>
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
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-2 border-b-2 px-5 py-3 font-sans text-[10px] font-semibold tracking-wider transition-colors",
        active
          ? "border-accent-cyan bg-accent-cyan/5 text-accent-cyan"
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
  const confidence = profile.confidence;

  const confidenceLabel =
    confidence > 0.6
      ? "HIGH CONFIDENCE"
      : confidence > 0.3
        ? "MEDIUM CONFIDENCE"
        : "LOW CONFIDENCE";

  const confidenceColor =
    confidence > 0.6
      ? "text-accent-green"
      : confidence > 0.3
        ? "text-accent-amber"
        : "text-text-secondary";

  return (
    <div className="relative h-[420px] w-full bg-background/30">
      <div className="absolute left-4 top-4 z-10 border border-border bg-surface/90 px-3 py-2 backdrop-blur">
        <span
          className={cn(
            "font-mono text-[9px] tracking-wider",
            confidenceColor,
          )}
        >
          ● {confidenceLabel}
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

function DataView({
  spectrum,
}: {
  spectrum: SpectrumResponse | null;
}) {
  if (!spectrum) {
    return (
      <div className="p-10 text-center">
        <p className="font-sans text-sm text-text-secondary">
          Spectral data is not available.
        </p>
      </div>
    );
  }

  const { profile } = spectrum;

  const fmt = (value: number | null, decimals = 4) =>
    value !== null && value !== undefined
      ? value.toFixed(decimals)
      : "—";

  const fmtExp = (value: number | null) =>
    value !== null && value !== undefined
      ? value.toExponential(2)
      : "—";

  const ratioDisplay =
    profile.color_ratio !== null
      ? `${fmt(profile.color_ratio, 3)}${
          profile.color_ratio_error !== null
            ? ` ± ${fmt(profile.color_ratio_error, 3)}`
            : ""
        }`
      : "—";

  const confidenceDisplay =
    profile.confidence > 0
      ? `${(profile.confidence * 100).toFixed(0)}%`
      : "Low";

  return (
    <div className="space-y-6 p-5 sm:p-6">
      {/* Classification metrics */}
      <section>
        <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
          <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-text-primary">
            Classification Overview
          </h3>

          <span className="font-mono text-[9px] text-text-secondary">
            01 / PROFILE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <MetricCard
            label="Candidate Class"
            value={profile.candidate_class.replace(/_/g, " ")}
            highlight
          />

          <MetricCard
            label="Confidence"
            value={confidenceDisplay}
          />

          <MetricCard
            label="Flux Ratio (Long/Short)"
            value={ratioDisplay}
          />

          <MetricCard
            label="Color Index"
            value={fmt(profile.color_index, 3)}
          />
        </div>
      </section>

      {/* Spectral measurements */}
      <section>
        <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
          <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-text-primary">
            Spectral Measurements
          </h3>

          <span className="font-mono text-[9px] text-text-secondary">
            02 / MEASUREMENTS
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <MetricCard
            label="Total Flux"
            value={fmtExp(profile.total_flux)}
          />

          <MetricCard
            label="Signal-to-Noise"
            value={
              profile.snr !== null
                ? profile.snr.toFixed(1)
                : "—"
            }
          />

          <MetricCard
            label="Spectral Points"
            value={`${profile.n_spectral_points}`}
          />

          <MetricCard
            label="Wavelength Range"
            value={`${profile.wavelength_range_nm.toFixed(1)} nm`}
          />
        </div>
      </section>

      {/* Reliability warning */}
      {!profile.reliable && (
        <section className="border border-accent-amber/30 bg-accent-amber/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-amber" />

            <div>
              <h3 className="font-sans text-xs font-semibold text-accent-amber">
                Limited Spectral Coverage
              </h3>

              <p className="mt-1 font-sans text-xs leading-relaxed text-text-secondary">
                <GlossaryText>
                  The available spectral range is insufficient</GlossaryText> (
                  {profile.wavelength_range_nm.toFixed(1)} nm; minimum 3 nm).
                  <GlossaryText>Combining data from all six detectors is required for broader
                  spectral coverage and a more reliable classification.
                </GlossaryText>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Algorithm reasons */}
      {profile.reasons.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-text-primary">
              Classification Factors
            </h3>

            <span className="font-mono text-[9px] text-text-secondary">
              03 / ANALYSIS
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.reasons.map((reason) => (
              <span
                key={reason}
                className="border border-border bg-surface-elevated px-3 py-1.5 font-mono text-[10px] text-text-secondary"
              >
                <GlossaryText>{reason}</GlossaryText>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Spectrum chart */}
      {spectrum.wavelengths_um.length > 0 && (
        <section className="border border-border bg-background/30 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-text-primary">
                Spectral Profile
              </h3>

              <p className="mt-1 font-mono text-[9px] text-text-secondary">
                {spectrum.wavelengths_um.length > 2
                  ? `MICRO-SPECTRUM / ${spectrum.wavelengths_um.length} SAMPLES`
                  : `SPECTRAL POINTS / ${spectrum.wavelengths_um.length}`}
              </p>
            </div>

            <span className="font-mono text-[9px] text-accent-cyan">
              WAVELENGTH (μm)
            </span>
          </div>

          <Sparkline
            xs={spectrum.wavelengths_um}
            ys={spectrum.flux_per_row}
          />
        </section>
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
    <div className="min-w-0 border border-border bg-background/40 p-3">
      <p className="font-mono text-[9px] uppercase tracking-wider text-text-secondary/70">
        {label}
      </p>

      <p
        className={cn(
          "mt-2 break-words font-mono text-sm font-medium",
          highlight ? "text-accent-cyan" : "text-text-primary",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Sparkline({
  xs,
  ys,
}: {
  xs: number[];
  ys: number[];
}) {
  const W = 600;
  const H = 120;
  const PAD = 8;

  const pointCount = Math.min(xs.length, ys.length);

  if (pointCount === 0) return null;

  const validPoints = xs
    .slice(0, pointCount)
    .map((x, index) => ({
      x,
      y: ys[index],
    }))
    .filter(
      (point) =>
        Number.isFinite(point.x) &&
        Number.isFinite(point.y),
    );

  if (validPoints.length === 0) return null;

  const xValues = validPoints.map((point) => point.x);
  const yValues = validPoints.map((point) => point.y);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMax = Math.max(...yValues, 1e-9);
  const yMin = Math.min(...yValues, 0);

  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;

  const getX = (x: number) =>
    PAD + ((x - xMin) / xSpan) * (W - 2 * PAD);

  const getY = (y: number) =>
    H - PAD - ((y - yMin) / ySpan) * (H - 2 * PAD);

  const points = validPoints
    .map(
      ({ x, y }) =>
        `${getX(x).toFixed(1)},${getY(y).toFixed(1)}`,
    )
    .join(" ");

  const showDots = validPoints.length <= 6;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-32 w-full overflow-visible"
      role="img"
      aria-label="Spectral profile chart"
    >
      <line
        x1={PAD}
        y1={H - PAD}
        x2={W - PAD}
        y2={H - PAD}
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="1"
      />

      <polyline
        points={points}
        fill="none"
        stroke="hsl(var(--accent-cyan))"
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {showDots &&
        validPoints.map(({ x, y }, index) => (
          <circle
            key={index}
            cx={getX(x)}
            cy={getY(y)}
            r={3.5}
            fill="hsl(var(--accent-cyan))"
          />
        ))}
    </svg>
  );
}
