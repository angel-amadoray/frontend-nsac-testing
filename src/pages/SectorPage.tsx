import { AlertTriangle, Crosshair, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DetectorAnimation } from '@/components/controls/DetectorAnimation'
import { DetectorSelector } from '@/components/controls/DetectorSelector'
import {
  DualEpochSelector,
  SingleEpochSelector,
} from '@/components/controls/EpochSelector'
import { OverlayToggle } from '@/components/controls/OverlayToggle'
import { ViewToggle, type ViewMode } from '@/components/controls/ViewToggle'
import { Skeleton } from '@/components/ui/Skeleton'
import { SliderControl } from '@/components/ui/SliderControl'
import { AsteroidMarker } from '@/components/viewer/AsteroidMarker'
import { ErrorOverlay } from '@/components/viewer/ErrorOverlay'
import {
  IdentifyPopover,
  type PopoverPosition,
} from '@/components/viewer/IdentifyPopover'
import { ImageViewer } from '@/components/viewer/ImageViewer'
import { LoadingOverlay } from '@/components/viewer/LoadingOverlay'
import { useComposite } from '@/hooks/useComposite'
import { useDifference } from '@/hooks/useDifference'
import { useHotspot } from '@/hooks/useHotspot'
import { useIdentify } from '@/hooks/useIdentify'
import { useKnownObjects } from '@/hooks/useKnownObjects'
import { useUrlState } from '@/hooks/useUrlState'
import { resolveApiUrl } from '@/lib/api'
import type { KnownObject } from '@/lib/types'
import { cn, formatDec, formatRA } from '@/lib/utils'

// ---- Defaults ----
const DEFAULTS = {
  view: 'composite' as ViewMode,
  detector: 1,
  stretch: 10,
  mode: 'per_row' as 'per_row' | 'global',
  threshold: 99,
  max_vmag: 19,
}

export function SectorPage() {
  const { id } = useParams<{ id: string }>()
  const { get, getNumber, set } = useUrlState()
  const hotspotQuery = useHotspot(id)
  const hotspot = hotspotQuery.data

  // ---- Estado en URL ----
  const view = get('view', DEFAULTS.view) as ViewMode
  const detector = getNumber('detector', DEFAULTS.detector)
  const epoch = get('epoch', hotspot?.epochs[0] ?? '')
  const epochFrom = get('epoch_from', hotspot?.epochs[0] ?? '')
  const epochTo = get('epoch_to', hotspot?.epochs[1] ?? hotspot?.epochs[0] ?? '')
  const overlayEnabled = get('overlay', '0') === '1'
  const identifyMode = get('identify', '0') === '1'
  const stretch = getNumber('stretch', DEFAULTS.stretch)
  const mode = get('mode', DEFAULTS.mode) as 'per_row' | 'global'
  const threshold = getNumber('threshold', DEFAULTS.threshold)
  const maxVmag = getNumber('max_vmag', DEFAULTS.max_vmag)

  // ---- Popover ----
  const [popover, setPopover] = useState<PopoverPosition | null>(null)

  // ---- Queries ----
  const compositeQuery = useComposite(
    {
      sector_id: id ?? '',
      epoch,
      detector,
      stretch_scale: stretch,
      mode,
    },
    Boolean(hotspot) && view === 'composite' && Boolean(epoch),
  )

  const differenceQuery = useDifference(
    {
      sector_id: id ?? '',
      epoch_from: epochFrom,
      epoch_to: epochTo,
      detector,
      threshold_percentile: threshold,
    },
    Boolean(hotspot) &&
      view === 'difference' &&
      Boolean(epochFrom) &&
      Boolean(epochTo) &&
      epochFrom !== epochTo,
  )

  const activeQuery = view === 'composite' ? compositeQuery : differenceQuery

  const imageUrl = useMemo(() => {
    if (!activeQuery.data) return null
    return resolveApiUrl(activeQuery.data.url)
  }, [activeQuery.data])

  const knownQuery = useKnownObjects(
    {
      sector_id: id ?? '',
      epoch: view === 'composite' ? epoch : epochFrom,
      detector,
      max_vmag: maxVmag,
      include_pixels: true,
    },
    Boolean(hotspot) && overlayEnabled,
  )

  const markers = useMemo<KnownObject[]>(() => {
    if (!knownQuery.data) return []
    return knownQuery.data.objects.filter(
      (o) => o.in_frame === true && o.pixel_x != null && o.pixel_y != null,
    )
  }, [knownQuery.data])

  const identifyMutation = useIdentify()

  // ---- Reset popover al cambiar de contexto ----
  useEffect(() => {
    setPopover(null)
    identifyMutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, detector, epoch, epochFrom, epochTo])

  // ---- Handlers ----
  const handleImageClick = (
    pixelX: number,
    pixelY: number,
    screenX: number,
    screenY: number,
  ) => {
    if (!hotspot) return
    identifyMutation.reset()
    setPopover({ screenX, screenY, pixelX, pixelY })
    identifyMutation.mutate({
      sectorId: hotspot.id,
      epoch: view === 'composite' ? epoch : epochFrom,
      detector,
      pixelX,
      pixelY,
    })
  }

  const handleMarkerClick = (obj: KnownObject, screenX: number, screenY: number) => {
    setPopover({ screenX, screenY, markerObject: obj })
  }

  const closePopover = () => setPopover(null)

  // ---- Commits de sliders (cada uno actualiza su URL param) ----
  const commitStretch = useCallback((v: number) => set({ stretch: v }), [set])
  const commitThreshold = useCallback((v: number) => set({ threshold: v }), [set])
  const commitMaxVmag = useCallback((v: number) => set({ max_vmag: v }), [set])
  const commitMode = useCallback((m: 'per_row' | 'global') => set({ mode: m }), [set])

  // ---- Reset ----
  const handleReset = () => {
    if (!hotspot) return
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
      overlay: '0',
      identify: '0',
    })
    setPopover(null)
  }

  // ---- Mensajes ----
  const loadingMessage =
    view === 'composite' ? 'Procesando imagen espectral…' : 'Comparando épocas T₁ vs T₂…'
  const loadingHint =
    view === 'composite'
      ? 'Puede tardar ~15 s la primera vez'
      : 'Alineando y restando épocas (~20 s la primera vez)'

  // ---- Loading / error de hotspot ----
  if (hotspotQuery.isLoading) {
    return (
      <div className="mx-auto max-w-[1600px] px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (hotspotQuery.isError || !hotspot) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-danger" />
        <h1 className="mt-4 font-display text-2xl font-bold">Sector no encontrado</h1>
        <p className="mt-2 text-text-secondary">
          {hotspotQuery.error instanceof Error
            ? hotspotQuery.error.message
            : 'No se pudo cargar el sector.'}
        </p>
      </div>
    )
  }

  const overlaySvg =
    overlayEnabled && markers.length > 0 ? (
      <svg
        viewBox="0 0 2040 2040"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {markers.map((obj) => (
          <AsteroidMarker key={obj.name} object={obj} onClick={handleMarkerClick} />
        ))}
      </svg>
    ) : null

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* ───── Viewer ───── */}
        <div className="relative">
          {imageUrl ? (
            <ImageViewer
              src={imageUrl}
              alt={hotspot.name}
              overlay={overlaySvg}
              enableClick={identifyMode}
              onImageClick={handleImageClick}
            />
          ) : (
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-black">
              <LoadingOverlay
                active={activeQuery.isLoading}
                message={loadingMessage}
                hint={loadingHint}
              />
              {activeQuery.isError && (
                <ErrorOverlay
                  message={
                    activeQuery.error instanceof Error
                      ? activeQuery.error.message
                      : 'Error desconocido'
                  }
                  onRetry={() => activeQuery.refetch()}
                />
              )}
            </div>
          )}

          {activeQuery.data && (
            <div className="pointer-events-none absolute top-3 left-3 z-30 rounded-md border border-border bg-surface/90 px-2.5 py-1 font-mono text-xs backdrop-blur">
              {activeQuery.data.cached ? (
                <span className="text-accent-green">⚡ cache</span>
              ) : (
                <span className="text-accent-amber">● recién generado</span>
              )}
            </div>
          )}

          {activeQuery.isFetching && activeQuery.data && (
            <div className="pointer-events-none absolute top-3 right-3 z-30 rounded-md border border-accent-cyan/40 bg-surface/90 px-2.5 py-1 font-mono text-xs backdrop-blur">
              <span className="text-accent-cyan">↻ actualizando</span>
            </div>
          )}

          {activeQuery.isFetching && !activeQuery.data && (
            <LoadingOverlay active message={loadingMessage} hint={loadingHint} />
          )}

          {identifyMode && (
            <div className="pointer-events-none absolute bottom-3 left-3 z-30 flex items-center gap-2 rounded-md border border-accent-green/40 bg-surface/90 px-2.5 py-1 font-mono text-xs backdrop-blur">
              <Crosshair className="h-3 w-3 text-accent-green" />
              <span className="text-accent-green">Haz click para identificar</span>
            </div>
          )}
        </div>

        {/* ───── Sidebar ───── */}
        <aside className="space-y-5">
          {/* Header + reset */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-bold leading-tight">
                {hotspot.name}
              </h1>
              <p className="mt-1.5 text-sm text-text-secondary">{hotspot.description}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-text-secondary">
                <span>RA {formatRA(hotspot.ra)}</span>
                <span>Dec {formatDec(hotspot.dec)}</span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="shrink-0 rounded-md border border-border bg-surface p-1.5 text-text-secondary transition-colors hover:border-accent-amber/40 hover:text-accent-amber"
              title="Restaurar valores por defecto"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <ViewToggle value={view} onChange={(v) => set({ view: v })} />

          <DetectorSelector value={detector} onChange={(d) => set({ detector: d })} />

          <DetectorAnimation
            current={detector}
            onDetectorChange={(d) => set({ detector: d })}
            disabled={hotspot.epochs.length === 0}
          />

          {view === 'composite' ? (
            <>
              <SingleEpochSelector
                epochs={hotspot.epochs}
                value={epoch}
                onChange={(ep) => set({ epoch: ep })}
              />

              {/* Stretch slider */}
              <SliderControl
                label="Stretch (arcsinh)"
                value={stretch}
                min={0.1}
                max={100}
                step={0.5}
                formatValue={(v) => v.toFixed(1)}
                onCommit={commitStretch}
                description="Más alto = resalta estructuras débiles"
              />

              {/* Mode toggle */}
              <div>
                <label className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-text-secondary">
                  <span>Normalización</span>
                </label>
                <div className="grid grid-cols-2 gap-1 rounded-md border border-border bg-surface p-1">
                  {(['per_row', 'global'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => commitMode(m)}
                      className={cn(
                        'rounded px-2 py-1.5 font-mono text-xs transition-colors',
                        mode === m
                          ? 'bg-accent-cyan/15 text-accent-cyan'
                          : 'text-text-secondary hover:text-text-primary',
                      )}
                    >
                      {m === 'per_row' ? 'Por fila' : 'Global'}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 font-mono text-xs text-text-secondary/60">
                  Por fila aplana el gradiente espectral.
                </p>
              </div>
            </>
          ) : (
            <>
              <DualEpochSelector
                epochs={hotspot.epochs}
                from={epochFrom}
                to={epochTo}
                onChange={(f, t) => set({ epoch_from: f, epoch_to: t })}
              />

              {epochFrom === epochTo && (
                <p className="rounded-md border border-accent-amber/30 bg-accent-amber/5 p-2.5 font-mono text-xs text-accent-amber">
                  Selecciona dos épocas distintas.
                </p>
              )}

              {/* Threshold slider */}
              <SliderControl
                label="Umbral (percentil)"
                value={threshold}
                min={90}
                max={99.9}
                step={0.1}
                formatValue={(v) => `${v.toFixed(1)}`}
                onCommit={commitThreshold}
                description="Bajo = más candidatos; alto = solo lo extremo"
              />
            </>
          )}

          <OverlayToggle
            enabled={overlayEnabled}
            count={markers.length}
            isLoading={knownQuery.isLoading}
            onChange={(v) => set({ overlay: v ? '1' : '0' })}
          />

          {/* Max Vmag slider (solo si overlay activo) */}
          {overlayEnabled && (
            <SliderControl
              label="Magnitud límite (V)"
              value={maxVmag}
              min={10}
              max={22}
              step={0.5}
              unit=" mag"
              onCommit={commitMaxVmag}
              description="SPHEREx detecta hasta V ≈ 20"
            />
          )}

          {/* Identify toggle */}
          <div>
            <label className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-text-secondary">
              <span>Modo identificar</span>
            </label>
            <button
              onClick={() => set({ identify: identifyMode ? '0' : '1' })}
              className={cn(
                'flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-all',
                identifyMode
                  ? 'border-accent-green/50 bg-accent-green/10 text-accent-green'
                  : 'border-border bg-surface text-text-secondary hover:border-accent-green/30 hover:text-text-primary',
              )}
            >
              <span className="flex items-center gap-2">
                <Crosshair className="h-4 w-4" />
                {identifyMode ? 'Click para identificar' : 'Activar identificación'}
              </span>
            </button>
          </div>

          {knownQuery.isError && overlayEnabled && (
            <p className="rounded-md border border-danger/30 bg-danger/5 p-2.5 font-mono text-xs text-danger">
              Error cargando asteroides: {knownQuery.error.message}
            </p>
          )}
        </aside>
      </div>

      <IdentifyPopover
        position={popover}
        isLoading={identifyMutation.isPending}
        data={identifyMutation.data}
        error={identifyMutation.error}
        onClose={closePopover}
      />
    </div>
  )
}