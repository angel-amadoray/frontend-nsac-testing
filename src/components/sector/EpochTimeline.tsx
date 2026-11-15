
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type EpochTarget = "from" | "to";

interface EpochTimelineProps {
  epochs: string[];
  view: "composite" | "difference";
  selectedEpoch: string;
  epochFrom: string;
  epochTo: string;
  epochTarget: EpochTarget;
  onTargetChange: (target: EpochTarget) => void;
  onSelectEpoch: (epoch: string) => void;
  onNavigate: (direction: -1 | 1) => void;
}

export function EpochTimeline({
  epochs,
  view,
  selectedEpoch,
  epochFrom,
  epochTo,
  epochTarget,
  onTargetChange,
  onSelectEpoch,
  onNavigate,
}: EpochTimelineProps) {
  if (epochs.length === 0) return null;

  return (
    <nav
      className="sector-epoch-timeline"
      aria-label="Observation epoch timeline"
    >
      <div className="sector-epoch-header">
        <span className="sector-epoch-heading">
          {view === "composite"
            ? "TIMELINE OF OBSERVATION EPOCHS"
            : "EPOCH COMPARISON"}
        </span>

        {view === "difference" && (
          <div
            className="sector-epoch-target"
            aria-label="Select comparison endpoint"
          >
            <button
              type="button"
              className={cn(
                "sector-epoch-target-button",
                epochTarget === "from" && "active",
              )}
              onClick={() => onTargetChange("from")}
              aria-pressed={epochTarget === "from"}
            >
              FROM · T₁
            </button>

            <button
              type="button"
              className={cn(
                "sector-epoch-target-button",
                epochTarget === "to" && "active",
              )}
              onClick={() => onTargetChange("to")}
              aria-pressed={epochTarget === "to"}
            >
              TO · T₂
            </button>
          </div>
        )}
      </div>

      <div className="sector-epoch-navigation">
        <button
          type="button"
          className="sector-epoch-arrow"
          onClick={() => onNavigate(-1)}
          disabled={epochs.length <= 1}
          aria-label="Previous observation epoch"
          title="Previous observation epoch"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="sector-epoch-track">
          {epochs.map((ep) => {
            const isSelected = ep === selectedEpoch;
            const isFrom = view === "difference" && ep === epochFrom;
            const isTo = view === "difference" && ep === epochTo;

            return (
              <button
                key={ep}
                type="button"
                className={cn(
                  "sector-epoch-point",
                  isSelected && "active",
                  isFrom && "is-from",
                  isTo && "is-to",
                )}
                onClick={() => onSelectEpoch(ep)}
                aria-pressed={isSelected}
                aria-label={`Select observation epoch ${ep}`}
                title={ep}
              >
                <span className="sector-epoch-dot" />
                <span className="sector-epoch-label">{ep}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="sector-epoch-arrow"
          onClick={() => onNavigate(1)}
          disabled={epochs.length <= 1}
          aria-label="Next observation epoch"
          title="Next observation epoch"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
}
