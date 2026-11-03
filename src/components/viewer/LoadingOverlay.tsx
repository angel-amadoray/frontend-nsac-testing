import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface LoadingOverlayProps {
  active: boolean
  message: string
  hint?: string
}

export function LoadingOverlay({ active, message, hint }: LoadingOverlayProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!active) {
      setElapsed(0)
      return
    }
    const start = Date.now()
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 250)
    return () => clearInterval(id)
  }, [active])

  if (!active) return null

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-background/90 backdrop-blur-sm">
      <Loader2 className="h-10 w-10 animate-spin text-accent-cyan" />
      <div className="text-center">
        <p className="font-display text-lg font-medium text-text-primary">
          {message}
        </p>
        {hint && (
          <p className="mt-1 font-mono text-xs text-text-secondary">{hint}</p>
        )}
        {elapsed > 0 && (
          <p className="mt-3 font-mono text-xs text-text-secondary/70">
            {elapsed}s
          </p>
        )}
      </div>
    </div>
  )
}