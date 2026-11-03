import type { Hotspot } from '@/lib/types'
import { SectorCard } from './SectorCard'

export function SectorGrid({ sectors }: { sectors: Hotspot[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sectors.map((s) => (
        <SectorCard key={s.id} hotspot={s} />
      ))}
    </div>
  )
}