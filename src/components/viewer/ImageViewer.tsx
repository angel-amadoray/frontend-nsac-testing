import { Maximize2, Minus, Plus } from 'lucide-react'
import { useCallback, useRef, type ReactNode } from 'react'
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch'
import { cn } from '@/lib/utils'

/** Tamaño nativo de las imágenes SPHEREx (2040×2040). */
export const IMAGE_SIZE = 2040

interface ImageViewerProps {
  src: string
  alt: string
  /** Overlay absoluto (SVG de marcadores, etc.). Se renderiza sobre la imagen. */
  overlay?: ReactNode
  /** Si está activo, deshabilita el pan y dispara onImageClick en cada click. */
  enableClick?: boolean
  /** Callback con las coordenadas del pixel en el sistema 2040×2040. */
  onImageClick?: (pixelX: number, pixelY: number, screenX: number, screenY: number) => void
  className?: string
}

export function ImageViewer({
  src,
  alt,
  overlay,
  enableClick = false,
  onImageClick,
  className,
}: ImageViewerProps) {
  const controlsRef = useRef<ReactZoomPanPinchRef>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableClick || !onImageClick || !imgRef.current) return
      const rect = imgRef.current.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const relX = (e.clientX - rect.left) / rect.width
      const relY = (e.clientY - rect.top) / rect.height
      // Ignorar clicks fuera del área real de la imagen
      if (relX < 0 || relX > 1 || relY < 0 || relY > 1) return

      onImageClick(
        Math.round(relX * IMAGE_SIZE),
        Math.round(relY * IMAGE_SIZE),
        e.clientX,
        e.clientY,
      )
    },
    [enableClick, onImageClick],
  )

  return (
    <div
      className={cn(
        'relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-black',
        className,
      )}
    >
      <TransformWrapper
        ref={controlsRef}
        initialScale={1}
        minScale={0.5}
        maxScale={8}
        centerOnInit
        doubleClick={{ mode: 'reset' }}
        wheel={{ step: 0.15 }}
        panning={{ disabled: enableClick, velocityDisabled: false }}
        limitToBounds={false}
      >
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
          contentStyle={{ width: '100%', height: '100%' }}
        >
          {/* Wrapper interno que se transforma con la imagen */}
          <div className="relative h-full w-full" onClick={handleClick}>
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              className="pointer-events-none h-full w-full select-none object-contain"
              draggable={false}
            />
            {overlay}
          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* Controles zoom */}
      <div className="absolute right-3 bottom-3 z-30 flex flex-col gap-1.5 rounded-md border border-border bg-surface/90 p-1 backdrop-blur">
        <button
          onClick={() => controlsRef.current?.zoomIn()}
          className="rounded p-1.5 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary"
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={() => controlsRef.current?.zoomOut()}
          className="rounded p-1.5 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary"
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={() => controlsRef.current?.resetTransform()}
          className="rounded p-1.5 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary"
          aria-label="Reset"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}