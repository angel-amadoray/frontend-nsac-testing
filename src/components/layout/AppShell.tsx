import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'

export function AppShell({ children }: { children: ReactNode }) {
  const isHome = useLocation().pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      {!isHome && <Header />}
      <main className="flex-1">{children}</main>
      {!isHome && (
        <footer className="border-t border-border/60 py-4 text-center font-mono text-xs text-text-secondary">
          Datos: NASA / IRSA SPHEREx · JPL SBDB · Procesado por SPHEREx Explorer
        </footer>
      )}
    </div>
  )
}
