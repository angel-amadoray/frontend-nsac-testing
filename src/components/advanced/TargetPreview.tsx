interface TargetPreviewProps {
  compositeUrl: string
  pixelX: number
  pixelY: number
  imageSize?: number
  displaySize?: number
  zoom?: number
}

export function TargetPreview({
  compositeUrl,
  pixelX,
  pixelY,
  imageSize = 2040,
  displaySize = 340,
  zoom = 3,
}: TargetPreviewProps) {
  // El WebP fue flipud'd: fila 0 del array = fila 2039 del archivo
  const visualY = imageSize - 1 - pixelY

  const imgW = imageSize * zoom
  const imgH = imageSize * zoom

  // Posición del target en la imagen completa (en px de la imagen escalada)
  const targetInImageX = pixelX * zoom
  const targetInImageY = visualY * zoom

  // Queremos el target en el centro del viewport
  const rawBgX = displaySize / 2 - targetInImageX
  const rawBgY = displaySize / 2 - targetInImageY

  // Clamp para no mostrar fuera de la imagen
  const minBgX = displaySize - imgW
  const minBgY = displaySize - imgH
  const bgX = Math.min(0, Math.max(minBgX, rawBgX))
  const bgY = Math.min(0, Math.max(minBgY, rawBgY))

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-border bg-black"
      style={{
        width: displaySize,
        height: displaySize,
        backgroundImage: `url(${compositeUrl})`,
        backgroundSize: `${imgW}px ${imgH}px`,
        backgroundPosition: `${bgX}px ${bgY}px`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
      }}
    >
      <svg
        className="pointer-events-none absolute inset-0"
        width={displaySize}
        height={displaySize}
      >
        <line
          x1={displaySize / 2 - 20}
          y1={displaySize / 2}
          x2={displaySize / 2 + 20}
          y2={displaySize / 2}
          stroke="hsl(var(--accent-cyan))"
          strokeWidth={1.5}
        />
        <line
          x1={displaySize / 2}
          y1={displaySize / 2 - 20}
          x2={displaySize / 2}
          y2={displaySize / 2 + 20}
          stroke="hsl(var(--accent-cyan))"
          strokeWidth={1.5}
        />
        <circle
          cx={displaySize / 2}
          cy={displaySize / 2}
          r={24}
          fill="none"
          stroke="hsl(var(--accent-cyan))"
          strokeWidth={1}
          opacity={0.7}
        />
      </svg>
    </div>
  )
}