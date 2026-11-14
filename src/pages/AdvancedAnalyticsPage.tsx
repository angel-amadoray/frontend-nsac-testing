import { AlertCircle, Loader2, Sparkles, Wand2 } from 'lucide-react'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { PairSpectrumCard } from '@/components/advanced/PairSpectrumCard'
import { ClassificationCard } from '@/components/advanced/ClassificationCard'
import { useHotspot } from '@/hooks/useHotspot'
import { usePairSpectrum } from '@/hooks/usePairSpectrum'
import { useSuggestTarget } from '@/hooks/useSuggestTarget'
import { useUrlState } from '@/hooks/useUrlState'

export function AdvancedAnalyticsPage() {
  const { id } = useParams<{ id: string }>()
  const { get } = useUrlState()
  const hotspotQuery = useHotspot(id)
  const hotspot = hotspotQuery.data

  const epoch = hotspot?.epochs[0] ?? ''
  const [raInput, setRaInput] = useState<string>('')
  const [decInput, setDecInput] = useState<string>('')

  const pairMutation = usePairSpectrum()
  const suggestMutation = useSuggestTarget()

  const handleSuggest = () => {
    if (!hotspot) return
    suggestMutation.mutate({
      sectorId: hotspot.id,
      epoch,
      obsId: get('obs_id', '') || undefined,
      visit: Number(get('visit', '0')) || undefined,
      minSnr: 10,
    })
  }

  const handleAnalyze = () => {
    if (!hotspot) return
    const ra = Number(raInput)
    const dec = Number(decInput)
    if (!Number.isFinite(ra) || !Number.isFinite(dec)) return
    pairMutation.mutate({
      sectorId: hotspot.id,
      epoch,
      raDeg: ra,
      decDeg: dec,
      obsId: get('obs_id', '') || undefined,
      visit: Number(get('visit', '0')) || undefined,
    })
  }

  // Autocompletar cuando suggestMutation encuentra target
  if (suggestMutation.data?.target && !raInput && !decInput) {
    setRaInput(suggestMutation.data.target.ra_deg.toFixed(5))
    setDecInput(suggestMutation.data.target.dec_deg.toFixed(5))
  }

  if (hotspotQuery.isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="mt-4 h-96 w-full" />
      </div>
    )
  }

  if (!hotspot) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-danger" />
        <h1 className="mt-4 font-display text-2xl font-bold">
          Sector no encontrado
        </h1>
      </div>
    )
  }

  if (hotspot.epochs.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-text-secondary" />
        <h1 className="mt-4 font-display text-2xl font-bold">
          Sin épocas disponibles
        </h1>
        <p className="mt-2 text-text-secondary">
          Este sector no tiene datos descargados.
        </p>
        <Link to={`/sector/${id}`} className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            Volver al sector
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-text-secondary/70">
          <Link to={`/sector/${id}`} className="hover:text-text-primary">
            ← {hotspot.name}
          </Link>
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold">
          Análisis avanzado
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary">
          Espectro de dos bandas mediante pares de detectores del mismo
          telescopio SPHEREx. Detecta bandas de absorción a 3 μm (hielo de
          agua) u otras firmas espectrales.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Panel de resultados */}
        <div className="space-y-4">
          {!pairMutation.data && !pairMutation.isPending && (
            <div className="rounded-xl border border-border bg-surface p-12 text-center">
              <Sparkles className="mx-auto h-10 w-10 text-accent-cyan/50" />
              <h2 className="mt-4 font-display text-lg font-semibold">
                Selecciona un objetivo
              </h2>
              <p className="mt-2 max-w-md mx-auto text-sm text-text-secondary">
                Usa el panel de la derecha para buscar automáticamente una
                fuente brillante o ingresa coordenadas manualmente.
              </p>
            </div>
          )}

          {pairMutation.isPending && (
            <div className="rounded-xl border border-border bg-surface p-12 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent-cyan" />
              <p className="mt-4 font-mono text-sm text-text-secondary">
                Analizando par de detectores…
              </p>
              <p className="mt-1 font-mono text-xs text-text-secondary/60">
                Puede tardar ~10-20 s
              </p>
            </div>
          )}

          {pairMutation.isError && (
            <div className="rounded-xl border border-danger/30 bg-danger/5 p-6">
              <AlertCircle className="h-6 w-6 text-danger" />
              <p className="mt-2 font-display text-base font-semibold">
                Error en el análisis
              </p>
              <p className="mt-1 font-mono text-xs text-text-secondary">
                {pairMutation.error instanceof Error
                  ? pairMutation.error.message
                  : 'Error desconocido'}
              </p>
            </div>
          )}

          {pairMutation.data && pairMutation.data.short && pairMutation.data.long && (
            <>
              <PairSpectrumCard
                short={pairMutation.data.short}
                long={pairMutation.data.long}
                ratio={pairMutation.data.ratio}
                ratioError={pairMutation.data.ratio_error}
              />
              <ClassificationCard
                classification={pairMutation.data.classification}
              />
            </>
          )}

          {pairMutation.data && (!pairMutation.data.short || !pairMutation.data.long) && (
            <div className="rounded-xl border border-accent-amber/30 bg-accent-amber/5 p-6">
              <AlertCircle className="h-6 w-6 text-accent-amber" />
              <p className="mt-2 font-display text-base font-semibold">
                Sin cobertura
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {pairMutation.data.classification.reason}
              </p>
            </div>
          )}
        </div>

        {/* Panel de control */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Objetivo
            </h3>

            <Button
              variant="primary"
              size="sm"
              className="mt-3 w-full"
              onClick={handleSuggest}
              disabled={suggestMutation.isPending || !epoch}
            >
              {suggestMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Buscando…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Encontrar fuente brillante
                </>
              )}
            </Button>

            {suggestMutation.data && !suggestMutation.data.target && (
              <p className="mt-2 rounded-md border border-accent-amber/30 bg-accent-amber/5 p-2 font-mono text-xs text-accent-amber">
                {suggestMutation.data.reason}
              </p>
            )}

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-secondary">
                  RA (grados)
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={raInput}
                  onChange={(e) => setRaInput(e.target.value)}
                  placeholder="88.31"
                  className="w-full rounded-md border border-border bg-background/40 px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-secondary/40 focus:border-accent-cyan focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-text-secondary">
                  Dec (grados)
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={decInput}
                  onChange={(e) => setDecInput(e.target.value)}
                  placeholder="-6.75"
                  className="w-full rounded-md border border-border bg-background/40 px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-secondary/40 focus:border-accent-cyan focus:outline-none"
                />
              </div>
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={handleAnalyze}
                disabled={
                  pairMutation.isPending ||
                  !raInput ||
                  !decInput ||
                  !Number.isFinite(Number(raInput)) ||
                  !Number.isFinite(Number(decInput))
                }
              >
                {pairMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analizando…
                  </>
                ) : (
                  'Analizar par espectral'
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface/50 p-4">
            <p className="font-mono text-[10px] leading-relaxed text-text-secondary/70">
              <span className="text-accent-amber">ℹ</span> Análisis basado en{' '}
              <span className="text-text-primary">2 bandas</span> del mismo
              telescopio SPHEREx. La clasificación es un candidato
              estadístico, no una identificación definitiva. Para espectro
              completo de 6 puntos se requieren 3 visitas con telescopios
              distintos.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}