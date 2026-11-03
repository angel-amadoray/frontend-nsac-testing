import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface DetectorAnimationProps {
  current: number
  onDetectorChange: (detector: number) => void
  disabled?: boolean
}

export function DetectorAnimation({
  current,
  onDetectorChange,
  disabled = false,
}: DetectorAnimationProps) {
  const [playing, setPlaying] = useState(false)
  const currentRef = useRef(current)

  useEffect(() => {
    currentRef.current = current
  }, [current])

  useEffect(() => {
    if (!playing || disabled) return
    const id = setInterval(() => {
      onDetectorChange(currentRef.current === 6 ? 1 : currentRef.current + 1)
    }, 1500)
    return () => clearInterval(id)
  }, [playing, disabled, onDetectorChange])

  // Si el componente se deshabilita, pausar
  useEffect(() => {
    if (disabled && playing) setPlaying(false)
  }, [disabled, playing])

  return (
    <button
      onClick={() => setPlaying((p) => !p)}
      disabled={disabled}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition-all',
        playing
          ? 'border-accent-purple/50 bg-accent-purple/10 text-accent-purple'
          : 'border-border bg-surface text-text-secondary hover:border-accent-purple/30 hover:text-text-primary',
        'disabled:opacity-40 disabled:cursor-not-allowed',
      )}
    >
      {playing ? (
        <>
          <Pause className="h-4 w-4 fill-current" />
          Detener animación
        </>
      ) : (
        <>
          <Play className="h-4 w-4 fill-current" />
          Animar detectores
        </>
      )}
    </button>
  )
}