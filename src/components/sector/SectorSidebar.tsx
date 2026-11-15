
import { Link } from "react-router-dom";
import { Crosshair, RotateCcw, Sparkles } from "lucide-react";

import { OverlayToggle } from "@/components/controls/OverlayToggle";
import { ViewToggle, type ViewMode } from "@/components/controls/ViewToggle";
import { SliderControl } from "@/components/ui/SliderControl";

import { cn } from "@/lib/utils";

interface SectorSidebarProps {
  sectorId: string;
  sectorName: string;
  sectorDescription: string;
  rightAscension: string;
  declination: string;

  view: ViewMode;
  onViewChange: (value: ViewMode) => void;

  onReset: () => void;

  stretch: number;
  onStretchCommit: (value: number) => void;

  mode: "global" | "per_row";
  onModeCommit: (value: "global" | "per_row") => void;

  threshold: number;
  onThresholdCommit: (value: number) => void;
  epochFrom: string;
  epochTo: string;

  overlayEnabled: boolean;
  overlayCount: number;
  isLoadingObjects: boolean;
  onOverlayChange: (enabled: boolean) => void;

  maxVmag: number;
  onMaxVmagCommit: (value: number) => void;

  identifyMode: boolean;
  onIdentifyToggle: () => void;

  objectErrorMessage: string | null;
}

export function SectorSidebar({
  sectorId,
  sectorName,
  sectorDescription,
  rightAscension,
  declination,
  view,
  onViewChange,
  onReset,
  stretch,
  onStretchCommit,
  mode,
  onModeCommit,
  threshold,
  onThresholdCommit,
  epochFrom,
  epochTo,
  overlayEnabled,
  overlayCount,
  isLoadingObjects,
  onOverlayChange,
  maxVmag,
  onMaxVmagCommit,
  identifyMode,
  onIdentifyToggle,
  objectErrorMessage,
}: SectorSidebarProps) {
  return (
    <aside className="sector-sidebar">
      {/* SECTOR INFORMATION */}

      <header className="sector-header">
        <div className="sector-header-content">
          <span className="sector-section-label">
            SPHEREx / OBSERVATION SECTOR
          </span>

          <h1>{sectorName}</h1>

          <p>{sectorDescription}</p>

          <div className="sector-coordinates">
            <span>RA {rightAscension}</span>
            <span>DEC {declination}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="sector-reset"
          title="Restore default settings"
          aria-label="Restore default settings"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </header>

      {/* VIEW MODE */}

      <section className="sector-control">
        <span className="sector-section-label">01 / VIEW MODE</span>

        <ViewToggle value={view} onChange={onViewChange} />
      </section>

      {/* COMPOSITE MODE */}

      {view === "composite" ? (
        <>
          <section className="sector-control">
            <span className="sector-section-label">02 / IMAGE STRETCH</span>

            <SliderControl
              label="Stretch (arcsinh)"
              value={stretch}
              min={1}
              max={100}
              step={2}
              formatValue={(value) => value.toFixed(1)}
              onCommit={onStretchCommit}
              description="Higher values enhance faint structures."
            />
          </section>

          <section className="sector-control">
            <span className="sector-section-label">
              03 / SPECTRAL ANALYSIS
            </span>

            <Link
              to={`/sector/${sectorId}/advanced`}
              className="sector-advanced-link"
            >
              <Sparkles className="h-4 w-4 shrink-0" />

              <div>
                <p>Advanced analysis</p>
                <span>Two-band spectral analysis</span>
              </div>
            </Link>
          </section>

          <section className="sector-control">
            <span className="sector-section-label">04 / NORMALIZATION</span>

            <div className="sector-normalization">
              {(["global", "per_row"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onModeCommit(value)}
                  className={cn(
                    mode === value && "sector-normalization-active",
                  )}
                >
                  {value === "per_row" ? "Per row" : "Global"}
                </button>
              ))}
            </div>

            <p className="sector-control-description">
              Per-row normalization reduces spectral gradients.
            </p>
          </section>
        </>
      ) : (
        /* DIFFERENCE MODE */

        <section className="sector-control">
          <span className="sector-section-label">
            02 / DETECTION THRESHOLD
          </span>

          <SliderControl
            label="Threshold (percentile)"
            value={threshold}
            min={90}
            max={99.9}
            step={0.1}
            formatValue={(value) => value.toFixed(1)}
            onCommit={onThresholdCommit}
            description="Lower values detect more candidates; higher values isolate extreme changes."
          />

          {epochFrom === epochTo && (
            <p className="sector-warning">
              Select two different observation epochs.
            </p>
          )}
        </section>
      )}

      {/* OBJECT OVERLAY */}

      <section className="sector-control">
        <span className="sector-section-label">05 / OBJECT OVERLAY</span>

        <OverlayToggle
          enabled={overlayEnabled}
          count={overlayCount}
          isLoading={isLoadingObjects}
          onChange={onOverlayChange}
        />
      </section>

      {/* OBJECT MAGNITUDE */}

      {overlayEnabled && (
        <section className="sector-control">
          <span className="sector-section-label">
            06 / OBJECT MAGNITUDE
          </span>

          <SliderControl
            label="Limiting magnitude (V)"
            value={maxVmag}
            min={10}
            max={24}
            step={2}
            unit=" mag"
            onCommit={onMaxVmagCommit}
            description="SPHEREx detects objects up to approximately V ≈ 20."
          />
        </section>
      )}

      {/* PIXEL IDENTIFICATION */}

      <section className="sector-control">
        <span className="sector-section-label">
          07 / PIXEL IDENTIFICATION
        </span>

        <button
          type="button"
          onClick={onIdentifyToggle}
          className={cn(
            "sector-identify-button",
            identifyMode && "sector-identify-button--active",
          )}
          aria-pressed={identifyMode}
        >
          <span className="sector-identify-button-label">
            <Crosshair className="h-4 w-4" />

            {identifyMode
              ? "Click image to identify"
              : "Enable identification"}
          </span>

          <span className="sector-identify-status">
            {identifyMode ? "Active" : "Inactive"}
          </span>
        </button>
      </section>

      {/* OBJECT RETRIEVAL ERROR */}

      {objectErrorMessage && overlayEnabled && (
        <p className="sector-error-message">
          Object retrieval error: {objectErrorMessage}
        </p>
      )}

      {/* SIDEBAR FOOTER */}

      <footer className="sector-sidebar-footer">
        <span>NASA SPHEREx</span>
        <span>SECTOR EXPLORER / 01</span>
      </footer>
    </aside>
  );
}
