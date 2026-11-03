import type { KnownObject } from '@/lib/types'

interface AsteroidMarkerProps {
  object: KnownObject
  onClick: (object: KnownObject, screenX: number, screenY: number) => void
  color?: 'cyan' | 'green'
}

/**
 * Marcador SVG que vive dentro del viewBox 0..2040.
 * Solo se renderiza si pixel_x/pixel_y están presentes.
 */
export function AsteroidMarker({ object, onClick, color = 'cyan' }: AsteroidMarkerProps) {
  if (object.pixel_x == null || object.pixel_y == null) return null

  const stroke = color === 'cyan' ? 'hsl(var(--accent-cyan))' : 'hsl(var(--accent-green))'

  return (
    <g
      transform={`translate(${object.pixel_x} ${object.pixel_y})`}
      className="cursor-pointer"
      style={{ pointerEvents: 'auto' }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(object, e.clientX, e.clientY)
      }}
    >
      {/* Aro exterior */}
      <circle
        r={15}
        fill="none"
        stroke={stroke}
        strokeWidth={2.5}
        opacity={0.85}
        className="transition-opacity hover:opacity-100"
      >
        <title>{`${object.name}${object.vmag ? ` — V=${object.vmag}` : ''}`}</title>
      </circle>
      {/* Punto central */}
      <circle r={4} fill={stroke} />
      {/* Halo suave al hover */}
      <circle r={22} fill={stroke} opacity={0} className="hover:opacity-20 transition-opacity" />
    </g>
  )
}