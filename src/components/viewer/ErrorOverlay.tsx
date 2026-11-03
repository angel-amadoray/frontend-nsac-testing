import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ErrorOverlayProps {
  message: string
  onRetry?: () => void
}

export function ErrorOverlay({ message, onRetry }: ErrorOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-background/95 p-8 text-center">
      <AlertTriangle className="h-10 w-10 text-danger" />
      <div>
        <p className="font-display text-lg font-medium text-text-primary">
          No se pudo cargar la imagen
        </p>
        <p className="mt-2 max-w-md font-mono text-xs text-text-secondary">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
      )}
    </div>
  )
}