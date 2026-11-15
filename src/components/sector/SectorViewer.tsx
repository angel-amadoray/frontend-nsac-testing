
import type { ReactNode } from "react";

import { Crosshair } from "lucide-react";

import { DetectorToolbar } from "@/components/sector/DetectorToolbar";
import { EpochTimeline } from "@/components/sector/EpochTimeline";

import { ImageViewer } from "@/components/viewer/ImageViewer";
import { ErrorOverlay } from "@/components/viewer/ErrorOverlay";
import { LoadingOverlay } from "@/components/viewer/LoadingOverlay";

import type { ViewMode } from "@/components/controls/ViewToggle";

type EpochTarget = "from" | "to";

interface SectorViewerProps {
  detector: number;
  isLoadingDetectors: boolean;
  detectorCount: number;
  onDetectorNavigate: (direction: -1 | 1) => void;

  imageUrl: string | null;
  imageAlt: string;
  overlay: ReactNode;
  identifyMode: boolean;
  onImageClick: (pixelX: number, pixelY: number) => void;

  isImageLoading: boolean;
  isImageError: boolean;
  imageErrorMessage: string;
  onRetry: () => void;
  isImageFetching: boolean;
  hasImageData: boolean;
  loadingMessage: string;
  loadingHint: string;

  epochs: string[];
  view: ViewMode;
  selectedEpoch: string;
  epochFrom: string;
  epochTo: string;
  epochTarget: EpochTarget;
  onTargetChange: (target: EpochTarget) => void;
  onSelectEpoch: (epoch: string) => void;
  onNavigateEpoch: (direction: -1 | 1) => void;
}

export function SectorViewer({
  detector,
  isLoadingDetectors,
  detectorCount,
  onDetectorNavigate,
  imageUrl,
  imageAlt,
  overlay,
  identifyMode,
  onImageClick,
  isImageLoading,
  isImageError,
  imageErrorMessage,
  onRetry,
  isImageFetching,
  hasImageData,
  loadingMessage,
  loadingHint,
  epochs,
  view,
  selectedEpoch,
  epochFrom,
  epochTo,
  epochTarget,
  onTargetChange,
  onSelectEpoch,
  onNavigateEpoch,
}: SectorViewerProps) {
  return (
    <section
      className="sector-viewer"
      aria-label="Astronomical image viewer"
    >
      <DetectorToolbar
        detector={detector}
        isLoading={isLoadingDetectors}
        detectorCount={detectorCount}
        onNavigate={onDetectorNavigate}
      />

      <div className="sector-viewer-content">
        {imageUrl ? (
          <ImageViewer
            src={imageUrl}
            alt={imageAlt}
            overlay={overlay}
            enableClick={identifyMode}
            onImageClick={onImageClick}
            className="sector-image-viewer"
          />
        ) : (
          <div className="sector-viewer-empty">
            <LoadingOverlay
              active={isImageLoading}
              message={loadingMessage}
              hint={loadingHint}
            />

            {isImageError && (
              <ErrorOverlay
                message={imageErrorMessage}
                onRetry={onRetry}
              />
            )}
          </div>
        )}
      </div>

      {epochs.length > 0 && (
        <EpochTimeline
          epochs={epochs}
          view={view}
          selectedEpoch={selectedEpoch}
          epochFrom={epochFrom}
          epochTo={epochTo}
          epochTarget={epochTarget}
          onTargetChange={onTargetChange}
          onSelectEpoch={onSelectEpoch}
          onNavigate={onNavigateEpoch}
        />
      )}

      {isImageFetching && hasImageData && (
        <div className="sector-viewer-status">
          <span>↻ Updating image</span>
        </div>
      )}

      {identifyMode && (
        <div className="sector-identify-hint">
          <Crosshair className="h-3 w-3" />
          <span>Click to identify object</span>
        </div>
      )}
    </section>
  );
}
