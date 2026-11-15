
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DetectorToolbarProps {
  detector: number;
  isLoading: boolean;
  detectorCount: number;
  onNavigate: (direction: -1 | 1) => void;
}

export function DetectorToolbar({
  detector,
  isLoading,
  detectorCount,
  onNavigate,
}: DetectorToolbarProps) {
  const navigationDisabled = isLoading || detectorCount <= 1;

  return (
    <nav
      className="sector-detector-toolbar"
      aria-label="Detector navigation"
    >
      <button
        type="button"
        className="sector-detector-arrow"
        onClick={() => onNavigate(-1)}
        disabled={navigationDisabled}
        aria-label="Previous detector"
        title="Previous detector"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <span className="sector-detector-title" aria-live="polite">
        DETECTOR {String(detector).padStart(2, "0")}
      </span>

      <button
        type="button"
        className="sector-detector-arrow"
        onClick={() => onNavigate(1)}
        disabled={navigationDisabled}
        aria-label="Next detector"
        title="Next detector"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}
