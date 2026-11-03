import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SectorGrid } from '@/components/sector/SectorGrid'
import { SectorGridSkeleton } from '@/components/sector/SectorGridSkeleton'
import { useHotspots } from '@/hooks/useHotspots'

export function HomePage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useHotspots()

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <section className="mb-12 text-center">
        <span className="mb-4 inline-block rounded-full border border-accent-cyan/30 bg-accent-cyan/5 px-3 py-1 font-mono text-xs text-accent-cyan">
          NASA SPHEREx · Misión en órbita
        </span>
        <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl">
          El universo en <span className="text-gradient">102 longitudes de onda</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
          Explora imágenes espectrales capturadas por el telescopio SPHEREx.
          Detecta asteroides, compara épocas y descubre candidatos a nuevos objetos.
        </p>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Sectores disponibles</h2>
          {isFetching && !isLoading && (
            <span className="flex items-center gap-2 font-mono text-xs text-text-secondary">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Actualizando
            </span>
          )}
        </div>

        {isLoading && <SectorGridSkeleton />}

        {isError && (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-danger/30 bg-danger/5 p-8 text-center">
            <AlertTriangle className="h-10 w-10 text-danger" />
            <div>
              <h3 className="font-display text-lg font-semibold">No se pudo cargar</h3>
              <p className="mt-1 text-sm text-text-secondary">
                {error instanceof Error ? error.message : 'Error desconocido'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </div>
        )}

        {data && data.length === 0 && (
          <div className="rounded-xl border border-border bg-surface p-8 text-center text-text-secondary">
            No hay sectores disponibles todavía.
          </div>
        )}

        {data && data.length > 0 && <SectorGrid sectors={data} />}
      </section>
    </div>
  )
}