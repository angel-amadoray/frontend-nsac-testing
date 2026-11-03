import { Loader2, Sparkles, Star, X, AlertTriangle, Rotate3D } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { IdentifyResponse, KnownObject } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface PopoverPosition {
  screenX: number;
  screenY: number;
  pixelX?: number;
  pixelY?: number;
  markerObject?: KnownObject;
}

interface IdentifyPopoverProps {
  position: PopoverPosition | null;
  isLoading: boolean;
  data?: IdentifyResponse;
  error?: Error | null;
  onClose: () => void;
  onVisualize: (pixelX: number, pixelY: number) => void;
}

const OFFSET = 16;

export function IdentifyPopover({
  position,
  isLoading,
  data,
  error,
  onClose,
  onVisualize
}: IdentifyPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera o tecla Escape
  useEffect(() => {
    if (!position) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", handleKey);
    // setTimeout para no capturar el click que abrió el popover
    const t = setTimeout(
      () => document.addEventListener("mousedown", handleClick),
      0,
    );
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
      clearTimeout(t);
    };
  }, [position, onClose]);

  if (!position) return null;

  // Clampear el popover dentro del viewport
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = 320;
  const approxHeight = 180;
  const left = Math.min(position.screenX + OFFSET, vw - width - 8);
  const top = Math.min(position.screenY + OFFSET, vh - approxHeight - 8);

  return createPortal(
    <div
      ref={ref}
      className="fixed z-[100] w-80 rounded-xl border border-border bg-surface/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-md"
      style={{ left, top }}
    >
      <button
        onClick={onClose}
        className="absolute right-2 top-2 rounded p-1 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Marcador directo */}
      {position.markerObject && (
        <MarkerContent object={position.markerObject} />
      )}

      {/* Loading identify */}
      {!position.markerObject && isLoading && (
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-accent-cyan" />
          <div>
            <p className="font-display text-sm font-medium">
              Consultando JPL SBDB…
            </p>
            <p className="mt-0.5 font-mono text-xs text-text-secondary">
              Pixel ({position.pixelX}, {position.pixelY})
            </p>
          </div>
        </div>
      )}

      {/* Error identify */}
      {!position.markerObject && error && (
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-danger" />
          <div>
            <p className="font-display text-sm font-medium">
              Error al consultar JPL
            </p>
            <p className="mt-1 font-mono text-xs text-text-secondary">
              {error.message}
            </p>
          </div>
        </div>
      )}

      {/* Resultado identify */}
      {!position.markerObject && data && !isLoading && (
        <IdentifyContent data={data} position={position} />
      )}

      {/* Botón Ver en 3D */}
      {((position.markerObject && position.pixelX == null) || data) && (
        <button
          onClick={() => {
            const px = position.pixelX ?? null;
            const py = position.pixelY ?? null;
            if (px != null && py != null) {
              onVisualize(px, py);
              onClose();
            }
          }}
          disabled={position.markerObject && position.pixelX == null}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-accent-purple/40 bg-accent-purple/10 px-3 py-2 font-mono text-xs text-accent-purple transition-colors hover:bg-accent-purple/20 disabled:opacity-40"
        >
          <Rotate3D className="h-3 w-3" />
          Visualizar en 3D
        </button>
      )}
    </div>,
    document.body,
  );
}

function MarkerContent({ object }: { object: KnownObject }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-accent-cyan">
        <Star className="h-4 w-4 fill-current" />
        <span className="font-mono text-xs uppercase tracking-wider">
          Asteroide conocido
        </span>
      </div>
      <p className="font-display text-base font-semibold leading-tight">
        {object.name}
      </p>
      <div className="mt-2 space-y-0.5 font-mono text-xs text-text-secondary">
        {object.vmag && <p>V = {object.vmag} mag</p>}
        {object.ra && <p>RA = {object.ra}</p>}
        {object.dec && <p>Dec = {object.dec}</p>}
        {object.total_offset_arcsec && (
          <p>Offset = {object.total_offset_arcsec}″</p>
        )}
      </div>
    </div>
  );
}

function IdentifyContent({
  data,
  position,
}: {
  data: IdentifyResponse;
  position: PopoverPosition;
}) {
  if (data.is_candidate) {
    return (
      <div>
        <div className="mb-2 flex items-center gap-2 text-accent-green">
          <Sparkles className="h-4 w-4" />
          <span className="font-mono text-xs uppercase tracking-wider">
            Candidato
          </span>
        </div>
        <p className="font-display text-base font-semibold leading-tight">
          Posible nuevo descubrimiento
        </p>
        <p className="mt-1.5 text-sm text-text-secondary">
          No hay asteroides catalogados a menos de {data.tolerance_arcsec}″ de
          esta posición.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs text-text-secondary">
          <div className="rounded border border-border bg-background/50 px-2 py-1.5">
            <p className="text-text-secondary/60">RA</p>
            <p className="text-text-primary">{data.ra_deg.toFixed(5)}°</p>
          </div>
          <div className="rounded border border-border bg-background/50 px-2 py-1.5">
            <p className="text-text-secondary/60">Dec</p>
            <p className="text-text-primary">{data.dec_deg.toFixed(5)}°</p>
          </div>
        </div>
        <p className="mt-2 font-mono text-[10px] text-text-secondary/50">
          Pixel ({position.pixelX}, {position.pixelY})
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-accent-cyan">
        <Star className="h-4 w-4 fill-current" />
        <span className="font-mono text-xs uppercase tracking-wider">
          Conocido ({data.n_known})
        </span>
      </div>
      <div
        className={cn(
          "space-y-2",
          data.known_objects.length > 3 && "max-h-48 overflow-y-auto",
        )}
      >
        {data.known_objects.map((obj) => (
          <div
            key={obj.name}
            className="rounded-md border border-border bg-background/40 px-2.5 py-2"
          >
            <p className="font-display text-sm font-medium leading-tight">
              {obj.name}
            </p>
            <p className="mt-0.5 font-mono text-xs text-text-secondary">
              {obj.vmag && `V=${obj.vmag} · `}offset{" "}
              {obj.total_offset_arcsec ?? "—"}″
            </p>
          </div>
        ))}
      </div>
      <p className="mt-2 font-mono text-[10px] text-text-secondary/50">
        RA {data.ra_deg.toFixed(4)}° · Dec {data.dec_deg.toFixed(4)}°
      </p>
    </div>
  );
}
