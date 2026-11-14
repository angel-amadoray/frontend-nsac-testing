interface TargetPreviewProps {
  compositeUrl: string
  pixelX: number
  pixelY: number
  imageSize?: number
  displaySize?: number
  zoom?: number
}

/**
 * Mini viewer centrado en (pixelX, pixelY) del composite.
 * Maneja el flip Y del WebP (FITS convention) automáticamente.
 */
export function TargetPreview({
  compositeUrl,
  pixelX,
  pixelY,
  imageSize = 2040,
  displaySize = 300,
  zoom = 3,
}: TargetPreviewProps) {
  // WebP fue flipud → fila 0 del array está abajo
  const displayY = imageSize - 1 - pixelY

  const rawLeft = -(pixelX * zoom - displaySize / 2)
  const rawTop = -(displayY * zoom - displaySize / 2)
  const minOffset = displaySize - imageSize * zoom
  const left = Math.max(minOffset, Math.min(0, rawLeft))
  const top = Math.max(minOffset, Math.min(0, rawTop))

  const cx = pixelX * zoom + left
  const cy = displayY * zoom + top

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-border bg-black"
      style={{ width: displaySize, height: displaySize }}
    >
      <img
        src={compositeUrl}
        alt="Target preview"
        draggable={false}
        style={{
          position: 'absolute',
          left,
          top,
          width: imageSize * zoom,
          height: imageSize * zoom,
          imageRendering: 'pixelated',
        }}
      />
      <svg
        className="pointer-events-none absolute inset-0"
        width={displaySize}
        height={displaySize}
      >
        <line x1={cx - 18} y1={cy} x2={cx + 18} y2={cy} stroke="hsl(var(--accent-cyan))" strokeWidth={1.5} />
        <line x1={cx} y1={cy - 18} x2={cx} y2={cy + 18} stroke="hsl(var(--accent-cyan))" strokeWidth={1.5} />
        <circle cx={cx} cy={cy} r={22} fill="none" stroke="hsl(var(--accent-cyan))" strokeWidth={1} opacity={0.6} />
      </svg>
    </div>
  )
}