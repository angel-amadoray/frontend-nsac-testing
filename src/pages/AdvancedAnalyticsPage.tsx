import { AlertCircle, Loader2, List, Sparkles, Wand2, Box } from "lucide-react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { PairSpectrumCard } from "@/components/advanced/PairSpectrumCard";
import { ClassificationCard } from "@/components/advanced/ClassificationCard";
import { TargetPreview } from "@/components/advanced/TargetPreview";
import { BrightPixelsList } from "@/components/advanced/BrightPixelsList";
import { ObjectVisualizerModal } from "@/components/three/ObjectVisualizerModal";
import { useHotspot } from "@/hooks/useHotspot";
import { usePairSpectrum } from "@/hooks/usePairSpectrum";
import { useBrightestValid } from "@/hooks/useBrightestValid";
import { useComposite } from "@/hooks/useComposite";
import { useUrlState } from "@/hooks/useUrlState";
import { resolveApiUrl } from "@/lib/api";
import type {
  BrightPixelItem,
  PairSpectrumResponse,
  SpherexProfile,
} from "@/lib/types";

/**
 * Converts a pair (2 points) to a SpherexProfile compatible with the 3D modal.
 */
function pairToProfile(pair: PairSpectrumResponse): SpherexProfile {
  const cls = pair.classification.classification;
  const ratio = pair.ratio ?? 1.0;
  const confidence = pair.classification.confidence;
  const shortUm = pair.short?.wavelength_center_um ?? 0.92;
  const longUm = pair.long?.wavelength_center_um ?? 3.12;

  let candidate_class: "STAR_LIKE" | "ROCKY_LIKE" | "UNKNOWN" = "UNKNOWN";
  let model: "star" | "rocky" | "unknown" = "unknown";

  if (cls === "HOT_STAR" || cls === "SUN_LIKE_STAR" || cls === "COOL_STAR") {
    candidate_class = "STAR_LIKE";
    model = "star";
  } else if (cls === "VERY_COOL" || cls === "COOL_DUSTY") {
    candidate_class = "ROCKY_LIKE";
    model = "rocky";
  } else {
    candidate_class = "UNKNOWN";
    model = "unknown";
  }

  // Material color based on color temperature
  let baseColor = "#c8c8c8";
  const T = pair.classification.color_temperature_k;
  if (T !== null) {
    if (T > 10000)
      baseColor = "#a8c8ff"; // blue (O/B/A)
    else if (T > 5500)
      baseColor = "#e0e8ff"; // blue-white (F/G)
    else if (T > 3500)
      baseColor = "#ffd8b8"; // orange (K/M)
    else baseColor = "#e8a070"; // red (late M dwarfs)
  }

  return {
    candidate_class,
    confidence,
    reasons: [cls.toLowerCase()],
    color_ratio: pair.ratio,
    color_ratio_error: pair.ratio_error,
    color_index:
      pair.ratio !== null ? Math.max(-1, Math.min(1, (1 - ratio) * 2)) : null,
    f_short: pair.short?.flux ?? null,
    f_long: pair.long?.flux ?? null,
    wavelength_range_um: [shortUm, longUm],
    wavelength_range_nm: (longUm - shortUm) * 1000,
    n_spectral_points: 2,
    reliable: true,
    total_flux: null,
    flux_error: null,
    snr: Math.min(pair.short?.snr ?? 0, pair.long?.snr ?? 0) || null,
    valid_fraction_aperture: 1.0,
    valid_fraction_annulus: 1.0,
    cutout_edge: false,
    visual_hints: {
      base_color_hex: baseColor,
      roughness: model === "star" ? 0.25 : 0.92,
      metalness: model === "star" ? 0.05 : 0.15,
      emissive_intensity: model === "star" ? 0.85 : 0.0,
      scale_hint: model === "star" ? "large" : "small",
      suggested_3d_model: model,
    },
  };
}

export function AdvancedAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const { get } = useUrlState();
  const hotspotQuery = useHotspot(id);
  const hotspot = hotspotQuery.data;

  const epoch = hotspot?.epochs[0] ?? "";
  const obsId = get("obs_id", "") || undefined;
  const visit = Number(get("visit", "0")) || undefined;

  const [selectedPixel, setSelectedPixel] = useState<BrightPixelItem | null>(
    null,
  );
  const [show3D, setShow3D] = useState(false);

  const pairMutation = usePairSpectrum();
  const brightestMutation = useBrightestValid();

  const compositeQuery = useComposite(
    { sector_id: id ?? "", epoch, detector: 1 },
    Boolean(hotspot) && Boolean(epoch),
  );
  const compositeUrl = compositeQuery.data
    ? resolveApiUrl(compositeQuery.data.url)
    : null;

  const handleLoadList = () => {
    if (!hotspot) return;
    brightestMutation.mutate({
      sectorId: hotspot.id,
      epoch,
      obsId,
      visit,
      topN: 20,
      minSnr: 10,
    });
  };

  const handleSelectPixel = (p: BrightPixelItem) => {
    setSelectedPixel(p);
    if (!hotspot) return;
    pairMutation.mutate({
      sectorId: hotspot.id,
      epoch,
      raDeg: p.ra_deg,
      decDeg: p.dec_deg,
      obsId,
      visit,
    });
  };

  if (hotspotQuery.isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="mt-4 h-96 w-full" />
      </div>
    );
  }

  if (!hotspot) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-danger" />
        <h1 className="mt-4 font-display text-2xl font-bold">
          Sector not found
        </h1>
      </div>
    );
  }

  if (hotspot.epochs.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-text-secondary" />
        <h1 className="mt-4 font-display text-2xl font-bold">
          No epochs available
        </h1>
        <Link to={`/sector/${id}`} className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            Back to sector
          </Button>
        </Link>
      </div>
    );
  }

  const pairResult = pairMutation.data;
  const profile3D = pairResult ? pairToProfile(pairResult) : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-text-secondary/70">
          <Link to={`/sector/${id}`} className="hover:text-text-primary">
            ← {hotspot.name}
          </Link>
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold">
          Advanced analytics
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary">
          Discover what type of object it is by comparing how much light it
          emits at two colors of the spectrum. Click on a bright object from the
          list to analyze it.
        </p>
      </header>

      <details className="mb-5 rounded-lg border border-border bg-surface/40 p-4">
        <summary className="cursor-pointer font-mono text-xs uppercase tracking-wider text-text-secondary">
          📖 How to interpret these results?
        </summary>
        <div className="mt-3 space-y-2 text-sm text-text-secondary">
          <p>
            Each object is measured at{" "}
            <strong className="text-text-primary">two wavelengths</strong>: a
            near-blue light band (~0.92 μm) and a mid-infrared band (~3.12 μm).
          </p>
          <p>
            The brightness difference between both bands tells us approximately
            the{" "}
            <strong className="text-text-primary">object's temperature</strong>.
          </p>
          <ul className="ml-4 list-disc space-y-1 text-xs">
            <li>
              <strong className="text-sky-400">Hot stars</strong> → brighter in
              the blue band.
            </li>
            <li>
              <strong className="text-yellow-400">Sun-like stars</strong> →
              similar in both bands.
            </li>
            <li>
              <strong className="text-red-400">Cold objects</strong> (dust,
              brown dwarfs) → brighter in infrared.
            </li>
          </ul>
          <p className="text-xs text-text-secondary/60">
            Note: with only two points, the temperature is approximate. Precise
            classification requires more wavelengths.
          </p>
        </div>
      </details>

      <div className="grid gap-5 lg:grid-cols-[400px_1fr]">
        {/* ── Left panel: list + preview ── */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-secondary">
                Bright objects
              </h3>
              <List className="h-4 w-4 text-text-secondary/50" />
            </div>

            <Button
              variant="primary"
              size="sm"
              className="mt-3 w-full"
              onClick={handleLoadList}
              disabled={brightestMutation.isPending || !epoch}
            >
              {brightestMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching for bright objects…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Find bright objects
                </>
              )}
            </Button>

            {brightestMutation.data &&
              brightestMutation.data.pixels.length === 0 && (
                <p className="mt-2 rounded-md border border-accent-amber/30 bg-accent-amber/5 p-2 font-mono text-xs text-accent-amber">
                  No valid pixels. Try lowering min_snr in the backend.
                </p>
              )}

            {brightestMutation.data &&
              brightestMutation.data.pixels.length > 0 && (
                <div className="mt-3">
                  <BrightPixelsList
                    pixels={brightestMutation.data.pixels}
                    selectedRank={selectedPixel?.rank ?? null}
                    onSelect={handleSelectPixel}
                  />
                  <p className="mt-2 font-mono text-[10px] text-text-secondary/60">
                    {brightestMutation.data.n_valid} valid out of{" "}
                    {brightestMutation.data.n_candidates_scanned} scanned
                  </p>
                </div>
              )}
          </div>

          {/* Target preview */}
          {selectedPixel && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-text-secondary">
                Where it is in the sky
              </h3>
              {compositeQuery.isLoading && (
                <div
                  className="flex items-center justify-center rounded-lg border border-border bg-black"
                  style={{ width: 340, height: 340 }}
                >
                  <Loader2 className="h-8 w-8 animate-spin text-accent-cyan" />
                </div>
              )}
              {compositeQuery.isError && (
                <div
                  className="flex items-center justify-center rounded-lg border border-danger/30 bg-danger/5 px-4 text-center"
                  style={{ width: 340, height: 340 }}
                >
                  <p className="font-mono text-xs text-danger">
                    Error loading composite
                  </p>
                </div>
              )}
              {compositeUrl && (
                <>
                  <TargetPreview
                    compositeUrl={compositeUrl}
                    pixelX={selectedPixel.pixel_short_x}
                    pixelY={selectedPixel.pixel_short_y}
                    displaySize={340}
                    zoom={3}
                  />
                  <p className="mt-2 font-mono text-[10px] text-text-secondary/60">
                    RA {selectedPixel.ra_deg.toFixed(4)}° · Dec{" "}
                    {selectedPixel.dec_deg.toFixed(4)}°
                  </p>
                </>
              )}
            </div>
          )}
        </aside>

        {/* ── Right panel: analysis + 3D ── */}
        <div className="space-y-4">
          {!pairResult && !pairMutation.isPending && (
            <div className="rounded-xl border border-border bg-surface p-12 text-center">
              <Sparkles className="mx-auto h-10 w-10 text-accent-cyan/50" />
              <h2 className="mt-4 font-display text-lg font-semibold">
                Select a pixel
              </h2>
              <p className="mt-2 mx-auto max-w-md text-sm text-text-secondary">
                Click "Find bright objects" to see bright pixels with coverage
                in both detectors, or enter coordinates manually in the list.
              </p>
            </div>
          )}

          {pairMutation.isPending && (
            <div className="rounded-xl border border-border bg-surface p-12 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent-cyan" />
              <p className="mt-4 font-mono text-sm text-text-secondary">
                Analyzing detector pair…
              </p>
            </div>
          )}

          {pairMutation.isError && (
            <div className="rounded-xl border border-danger/30 bg-danger/5 p-6">
              <AlertCircle className="h-6 w-6 text-danger" />
              <p className="mt-2 font-display text-base font-semibold">
                Analysis error
              </p>
              <p className="mt-1 font-mono text-xs text-text-secondary">
                {pairMutation.error instanceof Error
                  ? pairMutation.error.message
                  : "Unknown error"}
              </p>
            </div>
          )}

          {pairResult && pairResult.short && pairResult.long && (
            <>
              <ClassificationCard classification={pairResult.classification} />
              <PairSpectrumCard
                short={pairResult.short}
                long={pairResult.long}
                ratio={pairResult.ratio}
                ratioError={pairResult.ratio_error}
              />
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => setShow3D(true)}
              >
                <Box className="h-4 w-4" />
                View in 3D
              </Button>
            </>
          )}

          {pairResult && (!pairResult.short || !pairResult.long) && (
            <div className="rounded-xl border border-accent-amber/30 bg-accent-amber/5 p-6">
              <AlertCircle className="h-6 w-6 text-accent-amber" />
              <p className="mt-2 font-display text-base font-semibold">
                No coverage
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {pairResult.classification.reason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3D modal with override */}
      <ObjectVisualizerModal
        open={show3D && profile3D !== null}
        onClose={() => setShow3D(false)}
        input={null}
        overrideProfile={profile3D}
        overrideSpectrum={
          pairResult && pairResult.short && pairResult.long
            ? {
                wavelengths_um: [
                  pairResult.short.wavelength_center_um,
                  pairResult.long.wavelength_center_um,
                ],
                flux_per_row: [
                  pairResult.short.flux ?? 0,
                  pairResult.long.flux ?? 0,
                ],
              }
            : null
        }
      />
    </div>
  );
}