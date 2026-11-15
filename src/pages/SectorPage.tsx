import "./SectorPage.css";

import { SectorViewer } from "@/components/sector/SectorViewer";
import { SectorSidebar } from "@/components/sector/SectorSidebar";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { AlertTriangle } from "lucide-react";


import { Skeleton } from "@/components/ui/Skeleton";

import { AsteroidMarker } from "@/components/viewer/AsteroidMarker";

import { ObjectVisualizerModal } from "@/components/three/ObjectVisualizerModal";

import { useComposite } from "@/hooks/useComposite";
import { useDifference } from "@/hooks/useDifference";
import { useHotspot } from "@/hooks/useHotspot";
import { useKnownObjects } from "@/hooks/useKnownObjects";
import { useUrlState } from "@/hooks/useUrlState";
import { useAvailableDetectors } from "@/hooks/useAvailableDetectors";

import { resolveApiUrl } from "@/lib/api";
import type { KnownObject } from "@/lib/types";
import { formatDec, formatRA } from "@/lib/utils";

import type { ViewMode } from "@/components/controls/ViewToggle";

import type { SpectrumInput } from "@/hooks/useSpectrum";

// =========================================================
// 00. DEFAULT CONFIGURATION
// =========================================================

const DEFAULTS = {
  view: "composite" as ViewMode,
  detector: 1,
  stretch: 10,
  mode: "global" as "global" | "per_row",
  threshold: 99,
  max_vmag: 22,
};

// =========================================================
// 00.1 DETECTOR NAVIGATION
// =========================================================

const DETECTOR_SEQUENCE = [1, 2, 3, 4, 5, 6] as const;

// =========================================================
// 01. SECTOR PAGE
// =========================================================

export function SectorPage() {
  const { id } = useParams<{ id: string }>();

  const { get, getNumber, set } = useUrlState();

  // =======================================================
  // 01.1 SECTOR DATA
  // =======================================================

  const hotspotQuery = useHotspot(id);
  const hotspot = hotspotQuery.data;

  // =======================================================
  // 01.2 URL-BASED VIEWER STATE
  // =======================================================

  const view = get("view", DEFAULTS.view) as ViewMode;

  const detector = getNumber("detector", DEFAULTS.detector);

  const epoch = get("epoch", hotspot?.epochs[0] ?? "");

  const epochFrom = get("epoch_from", hotspot?.epochs[0] ?? "");

  const epochTo = get(
    "epoch_to",
    hotspot?.epochs[1] ?? hotspot?.epochs[0] ?? "",
  );

  const overlayEnabled = get("overlay", "0") === "1";
  const identifyMode = get("identify", "0") === "1";

  const stretch = getNumber("stretch", DEFAULTS.stretch);
  const mode = get("mode", DEFAULTS.mode) as "global" | "per_row";
  const threshold = getNumber("threshold", DEFAULTS.threshold);
  const maxVmag = getNumber("max_vmag", DEFAULTS.max_vmag);

  // =======================================================
  // 01.3 EPOCH TIMELINE STATE
  // Determines which endpoint is modified in Difference mode.
  // =======================================================

  const [epochTarget, setEpochTarget] = useState<"from" | "to">("to");

  const epochs = hotspot?.epochs ?? [];

  const selectedTimelineEpoch =
    view === "composite" ? epoch : epochTarget === "from" ? epochFrom : epochTo;

  const selectTimelineEpoch = useCallback(
    (selectedEpoch: string) => {
      if (view === "composite") {
        set({ epoch: selectedEpoch });
        return;
      }

      if (epochTarget === "from") {
        set({ epoch_from: selectedEpoch });
      } else {
        set({ epoch_to: selectedEpoch });
      }
    },
    [view, epochTarget, set],
  );

  const changeEpoch = useCallback(
    (direction: -1 | 1) => {
      if (epochs.length <= 1) return;

      const currentIndex = epochs.indexOf(selectedTimelineEpoch);
      const safeIndex = currentIndex === -1 ? 0 : currentIndex;

      const nextIndex = (safeIndex + direction + epochs.length) % epochs.length;

      const nextEpoch = epochs[nextIndex];

      if (nextEpoch) {
        selectTimelineEpoch(nextEpoch);
      }
    },
    [epochs, selectedTimelineEpoch, selectTimelineEpoch],
  );

  // =======================================================
  // 02. SPECTRAL VISUALIZER STATE
  // =======================================================

  const [visualizerInput, setVisualizerInput] = useState<SpectrumInput | null>(
    null,
  );

  // =======================================================
  // 03. IMAGE PROCESSING QUERIES
  // =======================================================

  const compositeQuery = useComposite(
    {
      sector_id: id ?? "",
      epoch,
      detector,
      stretch_scale: stretch,
      mode,
    },
    Boolean(hotspot) && view === "composite" && Boolean(epoch),
  );

  const differenceQuery = useDifference(
    {
      sector_id: id ?? "",
      epoch_from: epochFrom,
      epoch_to: epochTo,
      detector,
      threshold_percentile: threshold,
    },
    Boolean(hotspot) &&
      view === "difference" &&
      Boolean(epochFrom) &&
      Boolean(epochTo) &&
      epochFrom !== epochTo,
  );

  const activeQuery = view === "composite" ? compositeQuery : differenceQuery;

  const imageUrl = useMemo(() => {
    if (!activeQuery.data) return null;

    return resolveApiUrl(activeQuery.data.url);
  }, [activeQuery.data]);

  // =======================================================
  // 04. KNOWN OBJECTS AND MARKERS
  // =======================================================

  const knownQuery = useKnownObjects(
    {
      sector_id: id ?? "",
      epoch: view === "composite" ? epoch : epochFrom,
      detector,
      max_vmag: maxVmag,
      include_pixels: true,
      radius_deg: 2.5,
    },
    Boolean(hotspot) && overlayEnabled,
  );

  const markers = useMemo<KnownObject[]>(() => {
    if (!knownQuery.data) return [];

    return knownQuery.data.objects.filter(
      (object) =>
        object.in_frame === true &&
        object.pixel_x != null &&
        object.pixel_y != null,
    );
  }, [knownQuery.data]);

  // =======================================================
  // 05. AVAILABLE DETECTORS AND NAVIGATION
  // =======================================================

  const currentEpochForDetectors = view === "composite" ? epoch : epochFrom;

  const { data: availableDetectorsData, isLoading: isLoadingDetectors } =
    useAvailableDetectors(id ?? "", currentEpochForDetectors);

  const availableDetectors = availableDetectorsData?.detectors;

  const detectorSequence = useMemo(() => {
    if (!availableDetectors?.length) {
      return [...DETECTOR_SEQUENCE];
    }

    return DETECTOR_SEQUENCE.filter((detectorNumber) =>
      availableDetectors.includes(detectorNumber),
    );
  }, [availableDetectors]);

  useEffect(() => {
    if (
      detectorSequence.length > 0 &&
      !detectorSequence.includes(detector as (typeof DETECTOR_SEQUENCE)[number])
    ) {
      set({ detector: detectorSequence[0] });
    }
  }, [detectorSequence, detector, set]);

  const changeDetector = useCallback(
    (direction: -1 | 1) => {
      if (detectorSequence.length === 0 || isLoadingDetectors) return;

      const currentIndex = detectorSequence.indexOf(
        detector as (typeof DETECTOR_SEQUENCE)[number],
      );

      const safeIndex = currentIndex === -1 ? 0 : currentIndex;

      const nextIndex =
        (safeIndex + direction + detectorSequence.length) %
        detectorSequence.length;

      set({ detector: detectorSequence[nextIndex] });
    },
    [detector, detectorSequence, isLoadingDetectors, set],
  );

  // =======================================================
  // 06. CONTEXT RESET
  // =======================================================

  useEffect(() => {
    setVisualizerInput(null);
  }, [view, detector, epoch, epochFrom, epochTo]);

  // =======================================================
  // 07. IMAGE INTERACTION HANDLERS
  // =======================================================

  const handleImageClick = (pixelX: number, pixelY: number) => {
    if (!hotspot) return;

    setVisualizerInput({
      sectorId: hotspot.id,
      epoch: view === "composite" ? epoch : epochFrom,
      detector,
      pixelX,
      pixelY,
    });
  };

  const handleMarkerClick = (object: KnownObject) => {
    if (!hotspot || object.pixel_x == null || object.pixel_y == null) {
      return;
    }

    setVisualizerInput({
      sectorId: hotspot.id,
      epoch: view === "composite" ? epoch : epochFrom,
      detector,
      pixelX: object.pixel_x,
      pixelY: object.pixel_y,
    });
  };

  // =======================================================
  // 08. CONTROL COMMIT HANDLERS
  // =======================================================

  const commitStretch = useCallback(
    (value: number) => set({ stretch: value }),
    [set],
  );

  const commitThreshold = useCallback(
    (value: number) => set({ threshold: value }),
    [set],
  );

  const commitMaxVmag = useCallback(
    (value: number) => set({ max_vmag: value }),
    [set],
  );

  const commitMode = useCallback(
    (value: "per_row" | "global") => set({ mode: value }),
    [set],
  );

  // =======================================================
  // 09. RESTORE DEFAULT SETTINGS
  // =======================================================

  const handleReset = () => {
    if (!hotspot) return;

    set({
      view: DEFAULTS.view,
      detector: DEFAULTS.detector,
      epoch: hotspot.epochs[0],
      epoch_from: hotspot.epochs[0],
      epoch_to: hotspot.epochs[1] ?? hotspot.epochs[0],
      stretch: DEFAULTS.stretch,
      mode: DEFAULTS.mode,
      threshold: DEFAULTS.threshold,
      max_vmag: DEFAULTS.max_vmag,
      overlay: "0",
      identify: "0",
    });

    setEpochTarget("to");
  };

  // =======================================================
  // 10. LOADING MESSAGES
  // =======================================================

  const loadingMessage =
    view === "composite"
      ? "Processing spectral image..."
      : "Comparing observation epochs T₁ vs T₂...";

  const loadingHint =
    view === "composite"
      ? "Initial processing may take approximately 15 seconds."
      : "Aligning and subtracting observation epochs...";

  // =======================================================
  // 11. LOADING STATE
  // =======================================================

  if (hotspotQuery.isLoading) {
    return (
      <main className="sector-page">
        <div className="sector-layout sector-layout--loading">
          <section className="sector-viewer sector-viewer--loading">
            <div className="sector-detector-toolbar">
              <span />
              <span className="sector-detector-title">SELECTING DETECTOR</span>
              <span />
            </div>

            <Skeleton className="sector-loading-image" />
          </section>

          <aside className="sector-sidebar sector-sidebar--loading">
            <Skeleton className="h-10 w-full rounded-none" />
            <Skeleton className="h-24 w-full rounded-none" />
            <Skeleton className="h-24 w-full rounded-none" />
            <Skeleton className="h-24 w-full rounded-none" />
          </aside>
        </div>
      </main>
    );
  }

  // =======================================================
  // 12. ERROR STATE
  // =======================================================

  if (hotspotQuery.isError || !hotspot) {
    return (
      <main className="sector-page">
        <div className="sector-error">
          <AlertTriangle className="h-10 w-10" />

          <span className="sector-section-label">DATA RETRIEVAL ERROR</span>

          <h1>Sector not found</h1>

          <p>
            {hotspotQuery.error instanceof Error
              ? hotspotQuery.error.message
              : "The requested astronomical sector could not be loaded."}
          </p>
        </div>
      </main>
    );
  }

  // =======================================================
  // 13. ASTRONOMICAL OVERLAY
  // =======================================================

  const overlaySvg =
    overlayEnabled && markers.length > 0 ? (
      <svg
        viewBox="0 0 2040 2040"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {markers.map((object) => (
          <AsteroidMarker
            key={object.name}
            object={object}
            onClick={handleMarkerClick}
          />
        ))}
      </svg>
    ) : null;

  // =======================================================
  // 14. MAIN PAGE
  // =======================================================

  return (
    <main className="sector-page">
      <div className="sector-layout">
        {/* =================================================
    SECTION 01 — IMAGE VIEWER
    ================================================= */}

        <SectorViewer
          detector={detector}
          isLoadingDetectors={isLoadingDetectors}
          detectorCount={detectorSequence.length}
          onDetectorNavigate={changeDetector}
          imageUrl={imageUrl}
          imageAlt={hotspot.name}
          overlay={overlaySvg}
          identifyMode={identifyMode}
          onImageClick={handleImageClick}
          isImageLoading={activeQuery.isLoading}
          isImageError={activeQuery.isError}
          imageErrorMessage={
            activeQuery.error instanceof Error
              ? activeQuery.error.message
              : "Unknown processing error"
          }
          onRetry={() => activeQuery.refetch()}
          isImageFetching={activeQuery.isFetching}
          hasImageData={Boolean(activeQuery.data)}
          loadingMessage={loadingMessage}
          loadingHint={loadingHint}
          epochs={epochs}
          view={view}
          selectedEpoch={selectedTimelineEpoch}
          epochFrom={epochFrom}
          epochTo={epochTo}
          epochTarget={epochTarget}
          onTargetChange={setEpochTarget}
          onSelectEpoch={selectTimelineEpoch}
          onNavigateEpoch={changeEpoch}
        />

        {/* =================================================
            SECTION 02 — CONFIGURATION SIDEBAR
            ================================================= */}

        {/* =================================================
    SECTION 02 — CONFIGURATION SIDEBAR
    ================================================= */}

        <SectorSidebar
          sectorId={hotspot.id}
          sectorName={hotspot.name}
          sectorDescription={hotspot.description}
          rightAscension={formatRA(hotspot.ra)}
          declination={formatDec(hotspot.dec)}
          view={view}
          onViewChange={(value) => set({ view: value })}
          onReset={handleReset}
          stretch={stretch}
          onStretchCommit={commitStretch}
          mode={mode}
          onModeCommit={commitMode}
          threshold={threshold}
          onThresholdCommit={commitThreshold}
          epochFrom={epochFrom}
          epochTo={epochTo}
          overlayEnabled={overlayEnabled}
          overlayCount={markers.length}
          isLoadingObjects={knownQuery.isLoading}
          onOverlayChange={(value) => set({ overlay: value ? "1" : "0" })}
          maxVmag={maxVmag}
          onMaxVmagCommit={commitMaxVmag}
          identifyMode={identifyMode}
          onIdentifyToggle={() => set({ identify: identifyMode ? "0" : "1" })}
          objectErrorMessage={
            knownQuery.isError
              ? knownQuery.error instanceof Error
                ? knownQuery.error.message
                : "Unknown object retrieval error"
              : null
          }
        />
      </div>

      {/* SPECTRAL VISUALIZER MODAL */}

      <ObjectVisualizerModal
        open={visualizerInput !== null}
        onClose={() => setVisualizerInput(null)}
        input={visualizerInput}
      />
    </main>
  );
}
